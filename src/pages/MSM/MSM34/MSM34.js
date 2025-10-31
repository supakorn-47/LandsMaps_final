import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { formatDateAPI } from '../../../utils/DateUtil';
import { Loading } from '../../../components/Loading/Loading';
import { formatDateTH, formatDateTH2, formatDateTH_full2 } from '../../../utils/DateUtil';
import Iframe from "react-iframe";
import { Dialog } from 'primereact/dialog';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import MSM34Search from './MSM34Search';
import MSM34List from './MSM34List';
import MSM34Dialog from './MSM34Dialog';

//SERVICE
import { MSM34GetDataList } from '../../../service/ServiceMSM/ServiceMSM34';
import { masterService } from '../../../service/ServiceMaster/MasterService';

//PDF
import { generatePdf } from '../../../utils/PDFMakeUtil';

//EXCEL
import * as FileSaver from 'file-saver';
import XLSX from 'tempa-xlsx';
import { strToArrBuffer, excelSheetFromDataSet } from "../../../utils/dataHelpers";



export default function MSM34() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [dataTable, setDataTable] = useState([]);

    const [optionSource, setOptionSource] = useState([{ label: 'SOURCE', value: 'SOURCE' }, { label: 'PROCESS', value: 'PROCESS' }, { label: 'TARGET', value: 'TARGET' }])
    const [optionDataBase, setOptionDataBase] = useState([{ label: "Oracle", value: "Oracle" }, { label: "PostgreSQL", value: "PostgreSQL" }])


    // SEARCH
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    const [searchData, setSearchData] = useState({
        "start_date": date,
        "end_date": new Date(),
        "source_seq": "0",
        "transfer_data_group_seq": "0"
    });
    const [sourceList, setSourceList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [dialogPDF, setDialogPDF] = useState(false);

    const onMSM34GetDataList = () => {
        setLoading(true);
        let data = {
            start_date: searchData.start_date !== "" ? formatDateAPI(searchData.start_date, false) : "",
            end_date: searchData.end_date !== "" ? formatDateAPI(searchData.end_date, false) : "",
            source_seq: searchData.source_seq === "0" ? 0 : parseInt(searchData.source_seq),
            transfer_data_group_seq: searchData.transfer_data_group_seq === "0" ? 0 : parseInt(searchData.transfer_data_group_seq),
        }
        MSM34GetDataList(data)
            .then(res => {
                setLoading(false);
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
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, res.message);
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

    useEffect(() => {
        onMSM34GetDataList();

        masterService("GetDataSource/1/1", {}, "GET")
            .then(res => {
                setSourceList(res.result);
                setLoading(false);
            }, function (err) {
                setLoading(false);
            });

        masterService("GetTransfer_Data_Group/0", {}, "GET")
            .then(res => {
                setTableList(res.result);
                setLoading(false);
            }, function (err) {
                setLoading(false);
            });
    }, []);

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 8000 });
    }

    const onCreatePDFClick = async () => {
        setLoading(true)
        let data = dataTable;
        let data2 = {};
        let ol_arr = [];
        // data2.type = 'none';

        //#region 
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {

                //columus 
                ol_arr.push({
                    table: {
                        widths: ['4%', '6%', '6%', '6%', '6%', '5%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '7%'],
                        body: [
                            [
                                {
                                    text: data[i].order_no,
                                    style: { alignment: "center", fontSize: 12 },
                                }, {
                                    text: formatDateTH2(data[i].log_start_dtm, true),
                                    style: { alignment: "center", fontSize: 12 }
                                }, {
                                    text: formatDateTH2(data[i].log_end_dtm, true),
                                    style: { alignment: "center", fontSize: 12 }
                                }, {
                                    text: data[i].source_name,
                                    style: { fontSize: 12 },
                                }, {
                                    text: data[i].transfer_data_group_name,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].transfer_data_group_process_seq,
                                    style: { alignment: "center", fontSize: 12 }
                                }, {
                                    text: data[i].source_process,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].source_schema,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].source_table,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].target_process,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].target_schema,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].target_table,
                                    style: { fontSize: 12 }
                                }, {
                                    text: data[i].schedule_mode,
                                    style: { fontSize: 12 }
                                }, {
                                    text: numberWithCommas(data[i].total_record),
                                    style: { alignment: "right", fontSize: 12 }
                                }, {
                                    text: data[i].transfer_process_status,
                                    style: { alignment: "center", fontSize: 12 }
                                }, {
                                    text: data[i].log_desc,
                                    style: { alignment: "center", fontSize: 12 }
                                }, {
                                    text: data[i].log_path,
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
                        paddingLeft: function (i, node) {
                            return 3.5;
                        },
                        paddingRight: function (i, node) {
                            return 3.5;
                        },
                    },
                })

                data2 = ol_arr;
            }
            var content = {
                pageOrientation: 'landscape',
                pageSize: "A4",
                // content: [
                //     generateHead_MSM34(searchData),
                //     data2
                // ],
                pageMargins: [20, 20, 20, 40],
                style: "tableExample",
                // styles: styles
            }
            generatePdf(true, content, dataUrl => {
                // this.setState({ pdfURL: dataUrl, viewPDF: true });
                setDialogPDF({ open: true, pdfURL: dataUrl })
                setLoading(false)
            })
        } else {
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

        let styleBorderB_Right = {
            fill: {
                fgColor: { rgb: "ffffff" }
            },
            border: setBorder,
            alignment: {
                horizontal: "right", vertical: "center", wrapText: true
            },
        };

        let headerText = [{
            "text": "รายงานสรุปการถ่ายโอนข้อมูล" + "\n" + formatDateTH_full2(searchData.start_date) + " ถึง " + formatDateTH_full2(searchData.end_date),
            "style": styleTextHeaders
        },
        {
            "text": "",
            "style": styleTextHeaders
        }]

        // const { readData } = this.props;
        if (dataTable.length > 0) {
            let dataRow = dataTable
            let dataExcel = []

            //หัวรายงาน
            for (let i = 0; i < headerText.length; i++) {
                dataExcel.push([{ value: headerText[i].text, style: headerText[i].style }])
            }

            // ADD Headers
            dataExcel.push([
                { value: "ลำดับ", style: styleHeaders },
                { value: "วัน เวลาเริ่มต้น", style: styleHeaders },
                { value: "วัน เวลาสิ้นสุด", style: styleHeaders },
                { value: "แหล่งข้อมูล", style: styleHeaders },
                { value: "กลุ่มตาราง", style: styleHeaders },
                { value: "ลำดับการทำงาน", style: styleHeaders },
                { value: "แหล่งข้อมูลต้นทาง", style: styleHeaders },
                { value: "Schema ต้นทาง", style: styleHeaders },
                { value: "ตารางต้นทาง", style: styleHeaders },
                { value: "แหล่งข้อมูลปลายทาง", style: styleHeaders },
                { value: "Schema ปลายทาง", style: styleHeaders },
                { value: "ตารางปลายทาง", style: styleHeaders },
                { value: "Schedule Mode", style: styleHeaders },
                { value: "จำนวนข้อมูล", style: styleHeaders },
                { value: "สถานะการถ่ายโอน", style: styleHeaders },
                { value: "ข้อผิดพลาด", style: styleHeaders },
                { value: "Log Path", style: styleHeaders },
            ])

            // ADD Row
            for (let i = 0; i < dataRow.length; i++) {
                //dataExcel
                dataExcel.push([
                    { value: dataRow[i].order_no ? dataRow[i].order_no : '', style: styleBorderB_Center },
                    { value: dataRow[i].log_start_dtm ? formatDateTH2(dataRow[i].log_start_dtm, true) : '', style: styleBorderB_Center },
                    { value: dataRow[i].log_end_dtm ? formatDateTH2(dataRow[i].log_end_dtm, true) : '', style: styleBorderB_Center },
                    { value: dataRow[i].source_name ? dataRow[i].source_name : '', style: styleBorderB },
                    { value: dataRow[i].transfer_data_group_name ? dataRow[i].transfer_data_group_name : '', style: styleBorderB },
                    { value: dataRow[i].transfer_data_group_process_seq ? dataRow[i].transfer_data_group_process_seq : '', style: styleBorderB_Center },
                    { value: dataRow[i].source_process ? dataRow[i].source_process : '', style: styleBorderB },
                    { value: dataRow[i].source_schema ? dataRow[i].source_schema : '', style: styleBorderB },
                    { value: dataRow[i].source_table ? dataRow[i].source_table : '', style: styleBorderB },
                    { value: dataRow[i].target_process ? dataRow[i].target_process : '', style: styleBorderB },
                    { value: dataRow[i].target_schema ? dataRow[i].target_schema : '', style: styleBorderB },
                    { value: dataRow[i].target_table ? dataRow[i].target_table : '', style: styleBorderB },
                    { value: dataRow[i].schedule_mode ? dataRow[i].schedule_mode : '', style: styleBorderB },
                    { value: numberWithCommas(dataRow[i].total_record), style: styleBorderB_Right },
                    { value: dataRow[i].transfer_process_status ? dataRow[i].transfer_process_status : '', style: styleBorderB_Center },
                    { value: dataRow[i].log_desc ? dataRow[i].log_desc : '', style: styleBorderB_Center },
                    { value: dataRow[i].log_path ? dataRow[i].log_path : '', style: styleBorderB },
                ])

            }
            //"xlsx"  "csv"
            exportFile(dataExcel)
            // this.handleCloseExport()
        } else {
            showMessages('warn', `เกิดข้อผิดพลาด`, 'ไม่พบข้อมูลส่งออก');
            setLoading(false)
        }
    }

    const exportFile = (dataExcel) => {
        var dateFormat = require('dateformat');
        let filename = "MSM34_" + dateFormat(new Date().setFullYear(2564), 'yyyymmdd')

        const wb = {
            SheetNames: [filename],
            Sheets: {
                [filename]: excelSheetFromDataSet([{
                    columns: null,
                    data: dataExcel,
                    merges: [{ s: { r: 1, c: 0 }, e: { r: 0, c: 16 } }],
                    page: "MSM34"
                }])
            }
        };
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        let data = (new Blob([strToArrBuffer(wbout)], { type: "application/octet-stream" }));
        FileSaver.saveAs(data, filename + "." + 'xlsx');
        setLoading(false)
    }

    const numberWithCommas = (data) => {
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return (
        <>
            <Loading loading={loading} />
            <div className="datatable-crud-demo">
                <Toast ref={toast} position="top-right" />
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1 className="p-m-0">{getTextMenu()}</h1>
                        <div style={{ marginTop: -5 }} >
                            <Button style={{ height: '35px', color: 'green' }} label="ส่งออก Excel" icon="pi pi-file-excel" onClick={() => onCreateExcelClick()} className="p-button-info p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก Excel" tooltipOptions={{ position: 'top' }} />
                            <Button style={{ height: '35px', marginLeft: '5px' }} label="ส่งออก PDF" icon="pi pi-file-pdf" onClick={() => onCreatePDFClick()} className="p-button-danger p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก PDF" tooltipOptions={{ position: 'top' }} />
                        </div>
                    </div>

                    <MSM34Search
                        searchData={searchData} setSearchData={setSearchData}
                        sourceList={sourceList} tableList={tableList}
                        onMSM34GetDataList={onMSM34GetDataList}
                    />

                    <MSM34List dataTable={dataTable}  setDialog={setDialog}/>

                    <MSM34Dialog
                            dialog={true}
                            setDialog={setDialog}
                            optionSource={optionSource}
                            optionDataBase={optionDataBase}
                        />

                </div>
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
        </>
    )
}