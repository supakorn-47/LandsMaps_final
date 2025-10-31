import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DialogDelete } from '../../../components/DialogService/DialogService';
import { FooterButtonCenter } from '../../../components/FooterButton/FooterButton';
import { Loading } from '../../../components/Loading/Loading';

//PAGE
import DBT02Search from './DBT02Search';
import DBT02List from './DBT02List';
import DBT02Dialog from './DBT02Dialog';

//SERVICE
import { DBT02GetDataList, DBT02CreateData, DBT02UpdateData, DBT02CancelData, DBT02TransferStatus, DBT02GetJobFileDataList } from '../../../service/ServiceDBT/ServiceDBT02';
import { masterService } from '../../../service/ServiceMaster/MasterService';

export default function DBT02() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [jobFileDataList, setJobFileDataList] = useState([]);
    const [searchData, setSearchData] = useState({
        "source_seq": 0,
        "transfer_data_group_seq": 0
    });

    // search
    const [msSearchSource, setMsSearchSource] = useState([]);
    const [msTransferDataGroup, setMsTransferDataGroup] = useState([]);
    useEffect(() => {
        masterService("GetDataSource/0/1", {}, "GET")
            .then(res => {
                setMsSearchSource(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        masterService("GetTransfer_Data_Group/0", {}, "GET")
            .then(res => {
                setMsTransferDataGroup(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });

    }, []);

    // FORM
    const [msFormDataSource, setMsFormDataSource] = useState([]);
    const [msFormDataSourceProcess, setMsFormDataSourceProcess] = useState([]);
    const [msFormDataTransferProcess, setMsFormDataTransferProcess] = useState([]);
    const [msFormDataTransferGroup, setMsFormDataTransferGroup] = useState([]);
    useEffect(() => {
        // แหล่งข้อมูล
        masterService("GetDataSource/1/1", {}, "GET")
            .then(res => {
                setMsFormDataSource(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        //แหล่งข้อมูลต้นทาง
        masterService("GetDataSource/1,2", {}, "GET")
            .then(res => {
                setMsFormDataSourceProcess(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        //แหล่งข้อมูลปลายทาง
        masterService("GetDataSource/2,3", {}, "GET")
            .then(res => {
                setMsFormDataTransferProcess(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });

        //กลุ่มตาราง
        masterService("GetTransfer_Data_Group/1", {}, "GET")
            .then(res => {
                setMsFormDataTransferGroup(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }, []);

    // LIST
    useEffect(() => {
        onDBT02GetDataList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDBT02GetDataList = () => {
        setLoading(true);
        DBT02GetDataList(searchData)
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

    const validation = (object) => {
        let showerror = false;
        for (const property in object) {
            if (property === 'source_seq' || property === 'transfer_data_group_seq' || property === 'source_process_seq' || property === 'source_schema'
                || property === 'source_table' || property === 'target_process_seq' || property === 'target_schema' || property === 'target_table') {
                if (object[property] === null || object[property] === undefined || object[property] === '' || object[property] === 0) {
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

        if (dialog.action === "บันทึก" && validation(submitForm)) {
            setLoading(true);
            DBT02CreateData(submitForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'บันทึกตารางข้อมูลการถ่ายโอน');
                        // setDataTable(res.result);
                        onDBT02GetDataList();
                        setDialog(false);
                    } else {
                        showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.message}`);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
        } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
            setLoading(true);
            DBT02UpdateData(submitForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'แก้ไขตารางข้อมูลการถ่ายโอน');
                        // setDataTable(res.result);
                        onDBT02GetDataList();
                        setDialog(false);
                    } else {
                        showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.message}`);
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

    const footerButton = () => {
        const onDBT02DeleteData = () => {
            DBT02CancelData(deleteDialog.data).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    showMessages('success', `สำเร็จ`, 'ยกเลิกข้อมูลสำเร็จ');
                    onDBT02GetDataList();
                    setDeleteDialog(false);
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        }
        return (
            <FooterButtonCenter onClickOk={() => onDBT02DeleteData()} onClickCancle={() => setDeleteDialog(false)} />
        );
    }

    const onTransferStatusChange = (rowData, isChecked) => {
        setLoading(true);
        DBT02TransferStatus({
            "transfer_data_seq": rowData.transfer_data_seq,
            "transfer_status": isChecked === true ? 1 : 0
        }).then(res => {
            if (res.status === 200) {
                showMessages('success', `สำเร็จ`, isChecked === true ? "เปิด ถ่ายโอน" : "ปิด ถ่ายโอน");
                onDBT02GetDataList();
                setDeleteDialog(false);
            }
            setLoading(false);
        }, function (err) {
            setLoading(false);
            showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
        });
    }

    const onGetJobFileDataList = (rowData) => {
        setLoading(true);
        DBT02GetJobFileDataList({
            "transfer_data_seq": rowData.transfer_data_seq,
        }).then(res => {
            setJobFileDataList(res.result)
            setLoading(false);
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
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1 className="p-m-0">{localStorage.getItem("nameMenu")}</h1>
                        {/* <div style={{ marginTop: -5 }} >
                            <Button onClick={() => onDBT02GetDataList()} icon="pi pi-refresh" className="p-button-rounded p-button-success" tooltip="คลิกเพื่อ Refresh" tooltipOptions={{ position: 'left' }} />
                        </div> */}
                    </div>
                    <DBT02Search
                        searchData={searchData} setSearchData={setSearchData}
                        onDBT02GetDataList={onDBT02GetDataList}
                        msSearchSource={msSearchSource} msTransferDataGroup={msTransferDataGroup}
                    />
                    <DBT02List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}
                        onTransferStatusChange={onTransferStatusChange}
                        onGetJobFileDataList={onGetJobFileDataList}
                    />

                    {dialog && (
                        <DBT02Dialog
                            dialog={dialog}
                            setDialog={setDialog}
                            submitForm={(e) => submitForm(e)}
                            setSubmitted={setSubmitted}
                            submitted={submitted}
                            onGetJobFileDataList={onGetJobFileDataList}
                            jobFileDataList={jobFileDataList}
                            // MS
                            msFormDataSource={msFormDataSource}
                            msFormDataSourceProcess={msFormDataSourceProcess}
                            msFormDataTransferProcess={msFormDataTransferProcess}
                            msFormDataTransferGroup={msFormDataTransferGroup} />
                    )}

                </div>
            </div>
            <DialogDelete
                visible={deleteDialog.open}
                header="การยืนยัน"
                modal
                footer={footerButton()}
                onHide={() => setDeleteDialog(false)}
                textContent="คุณต้องการยกเลิกข้อมูล ใช่หรือไม่ ?"
            />
        </>
    )
}
