import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DialogDelete } from '../../../components/DialogService/DialogService';
import { FooterButtonCenter } from '../../../components/FooterButton/FooterButton';
import { Loading } from '../../../components/Loading/Loading';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import DMS07Search from './DMS07Search';
import DMS07List from './DMS07List';
import DMS07Dialog from './DMS07Dialog';

//SERVICE
import { DMS07GetDataList, DMS07SetRecordStatus, DMS07CreateData, DMS07UpdateData, DMS07UpdateNextRunTime, DMS07CancelData } from '../../../service/ServiceDMS/ServiceDMS07';
import { DMS02GetDataList, } from '../../../service/ServiceDMS/ServiceDMS02';
import { masterService } from '../../../service/ServiceMaster/MasterService';

var dateFormat = require('dateformat');

export default function DMS07() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    //DDL
    const [optionSource, setOptionSource] = useState([]);
    const [optionPattern, setOptionPattern] = useState([]);
    const [searchData, setSearchData] = useState({

        "start_date": new Date(),
        "end_date": new Date(),
        "tb_mm_transfer_job_seq": 0,
    });

    useEffect(() => {
        // onDMS07GetDataList();

        // masterService("GetDataSource/1/1", {}, "GET")
        //     .then(res => {
        //         setOptionSource(res.result);
        //     }, function (err) {
        //         showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
        //     });

        // onGetPattren();

        // setDataTable([
        //     {
        //         "c1": "1",
        //         "c2": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24",
        //         "c3": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 1 (TB_REG_PACEL, MAP_LAND_GIS_47, MAP_LAND_GIS_48)",
        //         "c4": "AUTO SCHEDULE",
        //         "c5": "Weekly",
        //         "c6": "1/22/21 9:00 PM",
        //         "c7": "1/29/21 9:00 PM",
        //         "c8": "1/22/21 9:00 PM",
        //         "c10": "Friday",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "2",
        //         "c2": "25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (TB_REG_PACEL, MAP_LAND_GIS_47, MAP_LAND_GIS_48)",
        //         "c4": "AUTO SCHEDULE",
        //         "c5": "Daily",
        //         "c6": "1/22/21 8:00 PM",
        //         "c7": "1/22/21 8:10 PM",
        //         "c8": "1/22/21 8:00 PM",
        //         "c9": "10",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "3",
        //         "c2": "49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (MAS, SVO)",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "Monthly",
        //         "c6": "1/1/21 7:00 PM",
        //         "c7": "2/1/21 7:00 PM",
        //         "c8": "1/1/21 7:00 PM",
        //         "c11": "1",
        //         "c12": "January,February,March,April,May,June,July,August,September,October,November,December",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "4",
        //         "c2": "91,92,93,94,95,96,97,98,99,100,101,102,103,105,106,107,108,109,110,111,112,113,114,115,116,117,119,120,121,122,123,124,125,126,127,128,129,130,131,133,134,135,136,137,138,139,140,141,142,143,144,145,147,148,149,150,151,152,153,154,155,156,157,158,159,161,162,163,164,165,166,167,168,169,170,171,172,173,175,176,177,178,179,180,181,182,183,184,185,186,187",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (TAMBOL, AMPHOE, PROVINCE), Oracle IP 51 (TAMBOLE, AMPHOE, PROVINCE, DOLSITE, DEP_ZONE)",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "One Time",
        //         "c6": "1/20/21 7:30 PM",
        //         "c8": "1/20/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "5",
        //         "c2": "189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,",
        //         "c3": "Oracle IP 51 (INDEX)",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "One Time",
        //         "c6": "1/21/21 7:30 PM",
        //         "c8": "1/21/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "6",
        //         "c2": "245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260",
        //         "c3": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 1 (MAP_NS3K_47, MAP_NS3K_48)",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "One Time",
        //         "c6": "1/22/21 7:30 PM",
        //         "c8": "1/22/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "7",
        //         "c2": "261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (MAP_NS3K_47,MAP_NS3K_48,MAP_LAND_NSL_47,MAP_LAND_NSL_48)",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "One Time",
        //         "c6": "1/23/21 7:30 PM",
        //         "c8": "1/23/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "8",
        //         "c2": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24",
        //         "c3": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 1 (TB_REG_PACEL, MAP_LAND_GIS_47, MAP_LAND_GIS_48) ทั้งหมด",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "One Time",
        //         "c6": "1/24/21 7:30 PM",
        //         "c8": "1/24/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "9",
        //         "c2": "25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (TB_REG_PACEL, MAP_LAND_GIS_47, MAP_LAND_GIS_48) ทั้งหมด",
        //         "c4": "MANUAL (ALL)",
        //         "c5": "One Time",
        //         "c6": "1/25/21 7:30 PM",
        //         "c8": "1/25/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "10",
        //         "c2": "25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (TB_REG_PACEL, MAP_LAND_GIS_47, MAP_LAND_GIS_48) เฉพาะที่ปลี่ยนแปลง",
        //         "c4": "MANUAL (INCREMENT)",
        //         "c5": "One Time",
        //         "c6": "1/26/21 7:30 PM",
        //         "c8": "1/26/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "11",
        //         "c2": "1,4,7,10,13,16,19,22",
        //         "c3": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 1 (TB_REG_PACEL)",
        //         "c4": "MANUAL (CONDITION)",
        //         "c5": "One Time",
        //         "c6": "1/27/21 7:30 PM",
        //         "c8": "1/27/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "12",
        //         "c2": "2,5,8,11,14,17,20,23",
        //         "c3": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 1 (MAP_LAND_GIS_47)",
        //         "c4": "MANUAL (CONDITION)",
        //         "c5": "One Time",
        //         "c6": "1/28/21 7:30 PM",
        //         "c8": "1/28/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "13",
        //         "c2": "3,6,9,12,15,18,21,24",
        //         "c3": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 1 (MAP_LAND_GIS_48)",
        //         "c4": "MANUAL (CONDITION)",
        //         "c5": "One Time",
        //         "c6": "1/29/21 7:30 PM",
        //         "c8": "1/29/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "14",
        //         "c2": "25,28,31,34,37,40,43,46",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (TB_REG_PACEL)",
        //         "c4": "MANUAL (CONDITION)",
        //         "c5": "One Time",
        //         "c6": "1/30/21 7:30 PM",
        //         "c8": "1/30/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "15",
        //         "c2": "26,29,32,35,38,41,44,47",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (MAP_LAND_GIS_47)",
        //         "c4": "MANUAL (CONDITION)",
        //         "c5": "One Time",
        //         "c6": "1/31/21 7:30 PM",
        //         "c8": "1/31/21 7:30 PM",
        //         "c13": "N"
        //     },
        //     {
        //         "c1": "16",
        //         "c2": "27,30,33,36,39,42,45,48",
        //         "c3": "โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (MAP_LAND_GIS_48)",
        //         "c4": "MANUAL (CONDITION)",
        //         "c5": "One Time",
        //         "c6": "2/1/21 7:30 PM",
        //         "c8": "2/1/21 7:30 PM",
        //         "c13": "N"
        //     }
        // ])
    }, []);

    const onDMS07GetDataList = () => {
        setLoading(true);
        DMS07GetDataList(searchData)
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
                // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const onGetPattren = (data) => {
        setLoading(true)
        DMS02GetDataList({
            source_seq: data === null || data === undefined ? 0 : data,
            transfer_data_group_seq: 0
        })
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    let temp = [];
                    let index = 1;
                    res.result.forEach(element => {
                        temp.push({
                            ...element,
                            index: index
                            // value: element.transfer_data_seq.toString(),
                            // label: ("Schema ต้นทาง:" + element.source_process + "  |") + ("ตารางต้นทาง:" + element.source_table + " | ") + ("แหล่งข้อมูลปลายทาง:" + element.target_process + " | ") + ("Schema ปลายทาง:" + element.target_schema + " | ") + ("ตารางปลายทาง:" + element.target_table)
                        })
                        index++
                    });
                    setOptionPattern(temp);
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const validation = (object) => {
        let showerror = false;
        for (const property in object) {
            if (property == 'job_detail' || property == 'schedule_mode' || property == 'schedule_type' || property == 'next_run_time') {
                if (object[property] === null || object[property] === undefined || object[property] === '' || object[property] === "0") {
                    showerror = true
                }
            }
        }

        if (showerror) {
            setSubmitted(true);
            return false;
        } else {
            setSubmitted(false);
            return true;
        }
    }

    const submitForm = (submitForm, dataSelect) => {
        if (dialog.action === "บันทึก" && validation(submitForm)) {
            setLoading(true);
            DMS07CreateData(submitForm, dataSelect)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'บันทึกตารางเวลา (Schedule) การถ่ายโอนข้อมูล');
                        setDataTable(res.result);
                        onDMS07GetDataList();
                        setDialog(false);
                    } else {
                        showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
        } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
            setLoading(true);
            DMS07UpdateData(submitForm, dataSelect)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'แก้ไขตารางเวลา (Schedule) การถ่ายโอนข้อมูล');
                        setDataTable(res.result);
                        onDMS07GetDataList();
                        setDialog(false);
                    } else {
                        showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
        }
    }

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 8000 });
    }


    const onStatusChange = (rowData, isChecked) => {
        setLoading(true);
        DMS07SetRecordStatus({
            "transfer_job_seq": rowData.transfer_job_seq,
            "record_status": isChecked === true ? "N" : "C"
        }).then(res => {
            if (res.status === 200) {
                showMessages('success', `สำเร็จ`, isChecked === true ? "เปิด การใช้งาน" : "ปิด การใช้งาน");
                onDMS07GetDataList();
                setDeleteDialog(false);
            }
            setLoading(false);
        }, function (err) {
            setLoading(false);
            showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
        });
    }

    const onUpdateNextTime = (rowData) => {
        if (rowData.next_run_time === null || rowData.next_run_time === "") {
            setSubmitted(true)
        } else {
            setLoading(true);
            DMS07UpdateNextRunTime({
                "transfer_job_seq": rowData.transfer_job_seq,
                "next_run_time": dateFormat(new Date(rowData.next_run_time), "yyyy-mm-dd'T'HH:MM:ss")
            }).then(res => {
                if (res.status === 200) {
                    showMessages('success', `สำเร็จ`, 'แก้ไข Next Run Time');
                    onDMS07GetDataList();
                    setDialog(false);
                }
                setLoading(false);
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
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
                    </div>
                    <DMS07Search
                        searchData={searchData}
                        setSearchData={setSearchData}
                        onSearch={() => onDMS07GetDataList()}
                    />
                    <DMS07List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}
                        onStatusChange={onStatusChange}
                    />
                    {dialog && (
                        <DMS07Dialog
                            dialog={dialog}
                            setDialog={setDialog}
                            submitForm={submitForm}
                            submitted={submitted}
                            setSubmitted={setSubmitted}
                            optionSource={optionSource}
                            optionPattern={optionPattern}
                            onGetPattren={onGetPattren}
                            setLoading={setLoading}
                            showMessages={showMessages}
                            onUpdateNextTime={onUpdateNextTime}
                        />
                    )}

                </div>
            </div>

        </>
    )
}
