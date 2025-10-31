import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';
import { Loading } from '../../../components/Loading/Loading';
import { Button } from 'primereact/button';
import Iframe from "react-iframe";
import { Dialog } from 'primereact/dialog';
import { formatDateAPI2, formatDateTH_full2, formatDateTH } from '../../../utils/DateUtil';
import { getTextMenu } from '../../../utils/MenuUtil';
//PAGE
import MSM01Search from './MSM01Search';
import MSM01List from './MSM01List';
//Highcharts
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from 'highcharts/modules/exporting'
//SERVICE
import MSM01Services from '../../../service/ServiceMSM/ServiceMSM01';
import { masterService } from '../../../service/ServiceMaster/MasterService';
//PDF
import { generateTableMSM1, generatePdfOpenNewTab } from '../../../utils/PDFMakeUtil';
//EXCEL
import * as FileSaver from 'file-saver';
import XLSX from 'tempa-xlsx';
import { strToArrBuffer, excelSheetFromDataSet } from "../../../utils/dataHelpers";

import { exportAsExcel, styleTextHeaders, styleHeaders, text_Default, text_Center, text_Right } from "../../../utils/dataHelpers";

export default function MSM01() {
    const toast = useRef(null);
    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogPDF, setDialogPDF] = useState(false);

    // SEARCH
    let date = new Date();
    date.setMinutes(date.getMinutes() - 20)
    const [searchData, setSearchData] = useState({
        "department_seq": "-1",
        "log_exchange_dtm_start": date,
        "log_exchange_dtm_end": new Date(),
    });

    //Highcharts
    const [graphPie, setGraphPie] = useState({ title: { text: "" } });
    const [graphLine, setGraphLine] = useState({ title: { text: "" } });

    const [optionDepartment, setOptionDepartment] = useState([]);

    //export graph
    if (typeof Highcharts === 'object') {
        HighchartsExporting(Highcharts)
    }

    useEffect(() => {
        masterService(`GetDepartment?mode=0`, {}, "GET").then(res => {
            setOptionDepartment(res.result)
        });

        //format comma
        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        })
    }, []);

    const onGetDataList = () => {
        setLoading(true);
        MSM01Services.GetDataList({
            "department_seq": parseInt(searchData.department_seq),
            "log_exchange_dtm_start": formatDateAPI2(searchData.log_exchange_dtm_start, true),
            "log_exchange_dtm_end": formatDateAPI2(searchData.log_exchange_dtm_end, true)
        }).then(res => {
            console.log('res', res)
            setLoading(false);
            if (res.status === 200) {
                //Table
                let temp = [];
                let index = 1;
                res.result.forEach(element => {
                    temp.push({
                        ...element,
                        index: index
                    })
                    index++;
                });
                setDataTable(temp)
                onGetGrapList();
            } else {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
            }
        }, function (err) {
            setLoading(false);
            if (err.response.data.status == 401) {
                alert(JSON.stringify('เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่'))
                window.location.href = '/login'
            } else {
                alert(JSON.stringify(err.response.data));
            }
        });
    }

    const onGetGrapList = () => {
        setLoading(true);
        MSM01Services.GetGraphList({
            "department_seq": parseInt(searchData.department_seq),
            "log_exchange_dtm_start": formatDateAPI2(searchData.log_exchange_dtm_start, true),
            "log_exchange_dtm_end": formatDateAPI2(searchData.log_exchange_dtm_end, true),
            "service_seq": -1,
            // "log_exchange_dtm_start": "2022-09-22 05:00",
            // "log_exchange_dtm_end": "2022-09-22 18:00"
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                if (res.chart === null) return;
                if (res.chartPercentage === null) return;

                let _chart = res.chart
                let _graph = {
                    title: { text: "" },
                    subtitle: {
                        text: _chart.xAxis.categories.length === 0 ? "ไม่พบข้อมูล" : ""
                    },
                    chart: {
                        events: {
                            load() {
                                this.showLoading();
                                setTimeout(this.hideLoading.bind(this), 1000);
                            }
                        },
                        type: 'line'
                    },
                    series: _chart.series,
                    xAxis: _chart.xAxis,
                    yAxis: {
                        title: {
                            text: 'ปริมาณการใช้งาน Service (ครั้ง)'
                        }
                    },
                    // colors: ["#C0392B", "#AF7AC5", "#154360", "#c77226", "#7D6608", "#42A5F5", "#66BB6A"],
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + '<br/>' +
                                'จำนวน : ' + '<b>' + this.y.toLocaleString() + '</b>' + " (ครั้ง)";
                        }
                    },
                }
                setGraphLine(_graph)

                let _chartPercentage = res.chartPercentage;
                let _pie = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    accessibility: {
                        point: {
                            valueSuffix: '%'
                        }
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: {
                        name: _chartPercentage.series.name,
                        data: _chartPercentage.series.data_th
                    }
                }
                setGraphPie(_pie);

            } else {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
            }
        }, function (err) {
            setLoading(false);
            if (err.response.data.status == 401) {
                alert(JSON.stringify('เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่'))
                window.location.href = '/login'
            } else {
                alert(JSON.stringify(err.response.data));
            }
        });
    }

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 8000 });
    }

    const onCreatePDFClick = async () => {
        let data = dataTable
        let _arr = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let response_status = data[i].response_status === 1 ? "ติดต่อได้" : "ติดต่อไม่ได้"
                let data_status = data[i].data_status === 1 ? "ได้ข้อมูล" : "ไม่ได้ข้อมูล";
                let data_size = data[i].data_size === null ? "-" : data[i].data_size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                _arr.push(
                    [
                        {
                            text: data[i].index,
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: data[i].create_dtm,
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: data[i].ip_address,
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: data[i].department_name_th,
                            style: { fontSize: 12, wrapText: true, wordWrap: 'break-word', paddingRight: 20 }
                        },
                        {
                            text: data[i].service_name,
                            style: { fontSize: 12 }
                        },
                        {
                            text: formatDateTH(data[i].request_dtm, true),
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: formatDateTH(data[i].response_dtm, true),
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: data[i].service_method,
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: response_status,
                            style: { alignment: "center", fontSize: 12 }
                        },
                        {
                            text: data_status,
                            style: { fontSize: 12, alignment: 'right' }
                        },
                        {
                            text: data_size,
                            style: { alignment: "right", fontSize: 12 }
                        },
                    ]
                )
            }
            var content = {
                pageSize: "A4",
                pageOrientation: 'landscape',
                content: [
                    generateTableMSM1(searchData, _arr),
                ],
                pageMargins: [20, 20, 40, 40],
                style: "tableExample",
            }
            generatePdfOpenNewTab(true, content, dataUrl => {
                // this.setState({ pdfURL: dataUrl, viewPDF: true });
                // setDialogPDF({ open: true, pdfURL: dataUrl })
                setLoading(false)
            })
        }
        else {
            showMessages('warn', `เกิดข้อผิดพลาด`, 'ไม่พบข้อมูลส่งออก');
            setLoading(false)
        }

    }

    const onCreateExcelClick = () => {
        // setLoading(true)
        if (dataTable.length > 0) {
            let dataRow = dataTable
            let dataExcel = []

            let headerText = [{
                "text": "รายงานข้อมูล Log การแลกเปลี่ยนข้อมูล" + "\n" + formatDateTH_full2(searchData.log_exchange_dtm_start, true) + " ถึง " + formatDateTH_full2(searchData.log_exchange_dtm_end, true),
                "style": styleTextHeaders
            },
            {
                "text": "",
                "style": styleTextHeaders
            }]
            //หัวรายงาน
            for (let i = 0; i < headerText.length; i++) {
                dataExcel.push([{ value: headerText[i].text, style: headerText[i].style }])
            }

            dataExcel.push([]);
            dataExcel.push([]);
            // ADD Headers
            dataExcel.push([
                { value: "ลำดับ", style: styleHeaders, },
                { value: "วันเวลาจัดเก็บประวัติ", style: styleHeaders },
                { value: "หมายเลขเครื่อง", style: styleHeaders },
                { value: "หน่วยงาน", style: styleHeaders },
                { value: "ชื่อ Serivce", style: styleHeaders },
                { value: "วันเวลา" + "\n" + "Request", style: styleHeaders },
                { value: "วันเวลา Response", style: styleHeaders },
                { value: "ประเภท Service", style: styleHeaders },
                { value: "สถานะติดต่อ", style: styleHeaders },
                { value: "สถานะ", style: styleHeaders },
                { value: "ขนาดข้อมูล(byte)", style: styleHeaders },
            ])
            // ADD Row
            for (let i = 0; i < dataRow.length; i++) {
                let response_status = dataRow[i].response_status === 1 ? "ติดต่อได้" : "ติดต่อไม่ได้"
                let data_size = dataRow[i].data_size === null ? "-" : dataRow[i].data_size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                let data_status = dataRow[i].data_status === 1 ? "ได้ข้อมูล" : "ไม่ได้ข้อมูล";
                //dataExcel
                dataExcel.push([
                    { value: dataRow[i].index, style: text_Center },
                    { value: dataRow[i].create_dtm ? formatDateTH(dataRow[i].create_dtm, true) : '', style: text_Center },
                    { value: dataRow[i].ip_address ? dataRow[i].ip_address : '', style: text_Center },
                    { value: dataRow[i].department_name_th ? dataRow[i].department_name_th : '', style: text_Default },
                    { value: dataRow[i].service_name ? dataRow[i].service_name : '', style: text_Default },
                    { value: dataRow[i].request_dtm ? formatDateTH(dataRow[i].request_dtm, true) : '', style: text_Center },
                    { value: dataRow[i].response_dtm ? formatDateTH(dataRow[i].response_dtm, true) : '', style: text_Center },
                    { value: dataRow[i].service_method ? dataRow[i].service_method : '', style: text_Center },
                    { value: response_status ? response_status : '', style: text_Center },
                    { value: data_status ? data_status : '', style: text_Center },
                    { value: data_size ? data_size : '', style: text_Right },
                ])
            }
            exportAsExcel(dataExcel, "MSM01", [{ s: { r: 3, c: 0 }, e: { r: 0, c: 10 } }]);
        }
        else {
            showMessages('warn', `เกิดข้อผิดพลาด`, 'ไม่พบข้อมูลส่งออก');
            // setLoading(false)
        }
    }

    return (
        <>
            <Loading loading={loading} />
            <div className="datatable-crud-demo">
                <Toast ref={toast} position="top-right" />
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1 className="p-m-0">{getTextMenu()}</h1>
                        <div>
                            <Button style={{ height: '35px', color: 'green' }} label="ส่งออก Excel" icon="pi pi-file-excel" onClick={() => onCreateExcelClick()} className="p-button-info p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก Excel" tooltipOptions={{ position: 'top' }} />
                            <Button style={{ height: '35px', marginLeft: '5px' }} label="ส่งออก PDF" icon="pi pi-file-pdf" onClick={() => onCreatePDFClick()} className="p-button-danger p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก PDF" tooltipOptions={{ position: 'top' }} />
                        </div>
                    </div>

                    <MSM01Search
                        searchData={searchData}
                        setSearchData={setSearchData}
                        onGetDataList={onGetDataList}
                        optionDepartment={optionDepartment}
                    />

                    {dataTable.length === 0 ? '' : (
                        <div className="p-grid">
                            <div className="p-col-12 p-lg-6">
                                <div className="card" >
                                    <h1 className="centerText" style={{ textAlign: 'center' }}>กราฟแสดงปริมาณการใช้งาน Service (ครั้ง)</h1>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={graphLine}
                                    // ref={React.createRef()}
                                    />
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-6">
                                <div className="card">
                                    <h1 className="centerText" style={{ textAlign: 'center' }}>กราฟแสดง %การใช้งาน Service</h1>

                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={graphPie}
                                    // ref={React.createRef()}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <MSM01List dataTable={dataTable} />
                </div>
                {dialogPDF &&
                    (<Dialog
                        header="PDF"
                        visible={dialogPDF.open}
                        blockScroll={true}
                        maximized={true}
                        onHide={() => setDialogPDF({ open: false, pdfURL: null })} >
                        <div className="confirmation-content" style={{ paddingTop: '0em' }}>
                            <Iframe
                                url={dialogPDF.pdfURL}
                                width="100%"
                                height={window.innerHeight - 110}
                                display="initial"
                                position="relative"
                            />
                        </div>
                    </Dialog>)}
            </div>
        </>
    )
}
