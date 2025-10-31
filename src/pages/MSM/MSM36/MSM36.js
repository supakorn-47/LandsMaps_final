import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Loading } from '../../../components/Loading/Loading';
import { Button } from 'primereact/button';
import Iframe from "react-iframe";
import { Dialog } from 'primereact/dialog';
import { formatDateTH2, formatDateTH_full2 } from '../../../utils/DateUtil';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import MSM36List from './MSM36List';

//SERVICE
import MSM36Services from '../../../service/ServiceMSM/ServiceMSM36';

//PDF
import { generatePdf } from '../../../utils/PDFMakeUtil';

//EXCEL
import * as FileSaver from 'file-saver';
import XLSX from 'tempa-xlsx';
import { strToArrBuffer, excelSheetFromAoA, excelSheetFromDataSet } from "../../../utils/dataHelpers";

export default function MSM36() {
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [dataTable, setDataTable] = useState([
        {
            index: 1,
            log_monitor_name: 'API Service',
            request_dtm: '2023-03-09T10:00:56.071+07:00',
            response_dtm: '2023-03-09T10:00:56.071+07:00',
            response_time: '0.3',
            response_status: '1',
            service_url: '',
            log_desc: ''
        },
        {
            index: 2,
            log_monitor_name: 'API Exchange',
            request_dtm: '2023-03-09T10:00:56.071+07:00',
            response_dtm: '2023-03-09T10:00:56.071+07:00',
            response_time: '0.1',
            response_status: '1',
            service_url: '',
            log_desc: ''
        },
        {
            index: 3,
            log_monitor_name: 'API Log',
            request_dtm: '2023-03-09T11:28:51.071+07:00',
            response_dtm: '2023-03-09T11:28:51.071+07:00',
            response_time: '0.3',
            response_status: '1',
            service_url: '',
            log_desc: ''
        },
        {
            index: 4,
            log_monitor_name: 'API WebAdmin',
            request_dtm: '2023-03-08T09:33:56.071+07:00',
            response_dtm: '2023-03-08T09:33:56.071+07:00',
            response_time: '0.7',
            response_status: '1',
            service_url: '',
            log_desc: ''
        },
        {
            index: 5,
            log_monitor_name: 'API WebPortal',
            request_dtm: '2023-03-07T12:12:11.071+07:00',
            response_dtm: '2023-03-07T12:12:11.071+07:00',
            response_time: '0.1',
            response_status: '1',
            service_url: '',
            log_desc: ''
        }

    ]);
    const [dialogPDF, setDialogPDF] = useState(false);

    useEffect(() => {
        onGetDataList();
    }, []);

    const onGetDataList = () => {
        setLoading(true);
        MSM36Services.GetDataList()
            .then(res => {
                setLoading(false)
                if (res.status === 200) {
                    let temp = [];
                    let index = 1;
                    res.result.forEach(element => {
                        temp.push({
                            ...element,
                            index: index
                        })
                        index++;
                    });
                    setDataTable(temp);
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
        setLoading(true)
        let data = dataTable
        let data2 = {};
        let ol_arr = [];
        //#region 
        if (data.length > 0) {

            for (let i = 0; i < data.length; i++) {
                let response_status = data[i].response_status == 1 ? "Running" : "Failed"
                //columus 
                ol_arr.push(
                    {
                        table: {
                            widths: ['4%', '15%', '9%', '9%', '9%', '9%', '7%', '28%', '13%'],
                            body: [
                                [
                                    {
                                        text: data[i].index,
                                        style: { alignment: "center", fontSize: 12 }
                                    },
                                    {
                                        text: data[i].log_monitor_name,
                                        style: { fontSize: 12 }
                                    },
                                    {
                                        text: data[i].log_monitor_ip,
                                        style: { alignment: "center", fontSize: 12 }
                                    },
                                    {
                                        text: formatDateTH2(data[i].request_dtm, true),
                                        style: { alignment: "center", fontSize: 12 }
                                    },
                                    {
                                        text: formatDateTH2(data[i].response_dtm, true),
                                        style: { alignment: "center", fontSize: 12 }
                                    },
                                    {
                                        text: data[i].response_time,
                                        style: { alignment: "center", fontSize: 12 }
                                    },
                                    {
                                        text: response_status,
                                        style: { alignment: "center", fontSize: 12 }
                                    },
                                    {
                                        text: data[i].service_url,
                                        style: { fontSize: 12 }
                                    },
                                    {
                                        text: data[i].log_desc,
                                        style: { fontSize: 12 }
                                    },
                                ]
                            ]
                        },

                        layout: {
                            hLineWidth: function (i, node) {
                                return 0.25;
                            },
                            vLineWidth: function (i, node) {
                                return 0.25;
                            },

                        },
                    },

                )
                data2 = ol_arr;
            }
            var content = {
                pageSize: "A4",
                pageOrientation: 'landscape',
                content: [
                    // generateHead_SCS16(),
                    data2,
                ],
                pageMargins: [20, 20, 40, 40],
                style: "tableExample",
            }
            generatePdf(true, content, dataUrl => {
                // this.setState({ pdfURL: dataUrl, viewPDF: true });
                setDialogPDF({ open: true, pdfURL: dataUrl })
                setLoading(false)
            })
        }
        else {
            showMessages('warn', `เกิดข้อผิดพลาด`, 'ไม่พบข้อมูลส่งออก');
            setLoading(false)
        }

    }

    const onCreateExcelClick = () => {
        setLoading(true)
        let setBorder = {
            "left": {
                "style": "thin",
                "color": {
                    "auto": 1
                }
            },
            "right": {
                "style": "thin",
                "color": {
                    "auto": 1
                }
            },
            "top": {
                "style": "thin",
                "color": {
                    "auto": 1
                }
            },
            "bottom": {
                "style": "thin",
                "color": {
                    "auto": 1
                }
            }
        };
        let styleTextHeaders = {
            fill: {
                fgColor: { rgb: "ffffff" }
            },
            font: { bold: true },
            alignment: {
                horizontal: "center", vertical: "center", wrapText: true
            },
            border: setBorder,

        };
        let styleHeaders = {
            fill: {
                fgColor: { rgb: "c7c7c7" }
            },
            font: { bold: true },
            alignment: {
                horizontal: "center", vertical: "center", wrapText: true
            },
            border: setBorder,

        };
        let styleBorderB = {
            fill: {
                fgColor: { rgb: "ffffff" }
            },
            border: setBorder,
            alignment: {
                vertical: "center", wrapText: true
            },

        };
        let styleBorderB_Center = {
            fill: {
                fgColor: { rgb: "ffffff" }
            },
            border: setBorder,
            alignment: {
                horizontal: "center", vertical: "center", wrapText: true
            },
        };


        if (dataTable.length > 0) {
            let dataRow = dataTable
            let dataExcel = []

            let headerText = [{
                "text": "รายงาน Monitor Response Time" + "\n" + "รายงาน ณ " + formatDateTH_full2(new Date(), true),
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

            // ADD Headers
            dataExcel.push([
                { value: "ลำดับ", style: styleHeaders, },
                { value: "ชื่อโปรแกรม", style: styleHeaders },
                { value: "หมายเลขเครื่อง", style: styleHeaders },
                { value: "วันเวลา Request", style: styleHeaders },
                { value: "วันเวลา Response", style: styleHeaders },
                { value: "Response Time(s)", style: styleHeaders },
                { value: "สถานะ", style: styleHeaders },
                { value: "ที่อยู่ Service", style: styleHeaders },
                { value: "รายละเอียด", style: styleHeaders },
            ])

            // ADD Row
            for (let i = 0; i < dataRow.length; i++) {

                let response_status = dataRow[i].response_status == 1 ? "Running" : "Failed"
                //dataExcel
                dataExcel.push([
                    // { value: dataRow[i].log_dtm ? moment(dataRow[i].log_dtm).format('DD/MM/YYYY hh:mm:ss') : '', style: styleBorderB },
                    { value: dataRow[i].index, style: styleBorderB_Center },
                    { value: dataRow[i].log_monitor_name ? dataRow[i].log_monitor_name : '', style: styleBorderB },
                    { value: dataRow[i].log_monitor_ip ? dataRow[i].log_monitor_ip : '', style: styleBorderB_Center },
                    { value: dataRow[i].request_dtm ? formatDateTH2(dataRow[i].request_dtm, true) : '', style: styleBorderB_Center },
                    { value: dataRow[i].response_dtm ? formatDateTH2(dataRow[i].response_dtm, true) : '', style: styleBorderB_Center },
                    { value: dataRow[i].response_time ? dataRow[i].response_time : '', style: styleBorderB_Center },
                    { value: response_status, style: styleBorderB_Center },
                    { value: dataRow[i].service_url ? dataRow[i].service_url : '', style: styleBorderB },
                    { value: dataRow[i].log_desc ? dataRow[i].log_desc : '', style: styleBorderB },
                ])

            }
            //"xlsx"  "csv"
            exportFile(dataExcel)
            // this.handleCloseExport()
        }
        else {
            showMessages('warn', `เกิดข้อผิดพลาด`, 'ไม่พบข้อมูลส่งออก');
            setLoading(false)
        }
    }

    const exportFile = (dataExcel) => {
        var dateFormat = require('dateformat');
        let filename = "SCS16_" + dateFormat(new Date().setFullYear(2564), 'yyyymmdd')

        const wb = {
            SheetNames: [filename],
            Sheets: {
                [filename]: excelSheetFromDataSet([{
                    columns: null,
                    data: dataExcel,
                    merges: [{ s: { r: 1, c: 0 }, e: { r: 0, c: 8 } }],
                    page: "MSM36"
                }])

            }
        };
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        let data = (new Blob([strToArrBuffer(wbout)], { type: "application/octet-stream" }));
        FileSaver.saveAs(data, filename + "." + 'xlsx');
        setLoading(false)
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
                            {/* <Button style={{ height: '35px', color: 'green' }} label="ส่งออก Excel" icon="pi pi-file-excel" onClick={() => onCreateExcelClick()} className="p-button-info p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก Excel" tooltipOptions={{ position: 'top' }} />
                            <Button style={{ height: '35px', marginLeft: '5px' }} label="ส่งออก PDF" icon="pi pi-file-pdf" onClick={() => onCreatePDFClick()} className="p-button-danger p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก PDF" tooltipOptions={{ position: 'top' }} /> */}
                        </div>
                    </div>

                    <MSM36List
                        dataTable={dataTable}
                        onGetDataList={onGetDataList}
                        showMessages={showMessages}
                    />

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
