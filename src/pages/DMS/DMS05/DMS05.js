import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Loading } from '../../../components/Loading/Loading';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import DMS05Search from './DMS05Search';
import DMS05List from './DMS05List';
import DMS05Dialog from './DMS05Dialog';

//SERVICE
import { DMS05GetDataList, DMS05CreateData, DMS05UpdateData, DMS05RunProcess } from '../../../service/ServiceDMS/ServiceDMS05';
import { masterService } from '../../../service/ServiceMaster/MasterService';

export default function DMS05() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [searchData, setSearchData] = useState({
        "start_date": new Date(),
        "end_date": new Date(),
    });
    const [submitted, setSubmitted] = useState(false);
    // MS
    const [msDataSource, setMsDataSource] = useState([]);
    const [msDataTable, setMsDataTable] = useState([]);
    const [msDataScale, setMsDataScale] = useState([]);
    const [msDataScalePage, setMsDataScalePage] = useState([]);

    useEffect(() => {
        onDMS05GetDataList();
    }, []);

    useEffect(() => {
        masterService("GetDataSource?mode=1&source_process=1", {}, "GET")
            .then(res => {
                setMsDataSource(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });

        //มาตราส่วน
        masterService(`GetUTMScale?mode=1`, {}, "GET")
            .then(res => {
                setMsDataScale(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });

        // onGetTransferDataGroup();
    }, []);

    const onGetTransferDataGroup = (source_schema = '') => {
        masterService(`GetTransferDataGroup?mode=1&source_schema=${source_schema}`, {}, "GET").then(res => {
            let temp = res.result;
            temp.splice(0, 1);
            setMsDataTable(temp);
        });
    }

    const onDMS05GetDataList = () => {
        setLoading(true);
        DMS05GetDataList(searchData)
            .then(res => {
                setLoading(false);
                if (res.status === 200 && res.errors.message === null) {
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
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, res.errors.message);
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

    //UTMMAP4
    const onScalePage = (scale_name) => {
        masterService(`GetLandScalePage?scale_name=${scale_name}`, {}, "GET")
            .then(res => {
                setMsDataScalePage(res.result);

            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });

    }

    const validation = (object) => {
        let showerror = false;
        for (const property in object) {
            if (property === "source_seq" || property === "source_schema" || property === "source_table") {
                if (object[property] === 0 || object[property] === 'กรุณาเลือก Schema') {
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

    const submitForm = (submitForm) => {
        if (dialog.action === "SAVE" && validation(submitForm)) {
            setLoading(true);
            DMS05CreateData(submitForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'บันทึกเงื่อนไขการดึงข้อมูลแปลงที่ดิน');
                        // setDataTable(res.result);
                        onDMS05GetDataList();
                        setDialog(false);
                    } else {
                        showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
        } else if (dialog.action === "UPDATE" && validation(submitForm)) {
            setLoading(true);
            DMS05UpdateData(submitForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'แก้ไขเงื่อนไขการดึงข้อมูลแปลงที่ดิน');
                        // setDataTable(res.result);
                        onDMS05GetDataList();
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

    const onRunProcessCkick = (data) => {
        setLoading(true);
        DMS05RunProcess(data)
            .then(res => {
                setLoading(false);
                if (res.status === 200 && res.error === false) {
                    showMessages('success', `สำเร็จ`, 'Run Process ข้อมูลแปลงที่ดิน');
                    onDMS05GetDataList();
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    return (
        <>
            <Loading loading={loading} />
            <div className="datatable-crud-demo">
                <Toast ref={toast} position="top-right" />
                    <DMS05Search
                        searchData={searchData} setSearchData={setSearchData}
                        onDMS05GetDataList={onDMS05GetDataList}
                    />

                    <DMS05List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}
                        onRunProcessCkick={(e) => onRunProcessCkick(e)}
                    />

                    {dialog && (
                        <DMS05Dialog
                            dialog={dialog}
                            setDialog={setDialog}
                            submitForm={(e) => submitForm(e)}
                            msDataTable={msDataTable}
                            msDataSource={msDataSource}
                            msDataScale={msDataScale}
                            msDataScalePage={msDataScalePage}
                            onScalePage={onScalePage}
                            submitted={submitted}

                            onGetTransferDataGroup={onGetTransferDataGroup}
                        />
                    )}
            </div>

        </>
    )
}
