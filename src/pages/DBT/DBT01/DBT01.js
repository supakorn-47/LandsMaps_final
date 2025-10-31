import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DialogDelete } from '../../../components/DialogService/DialogService';
import { FooterButtonCenter } from '../../../components/FooterButton/FooterButton';
import { Loading } from '../../../components/Loading/Loading';

//PAGE
import DBT01List from './DBT01List';
import DBT01Dialog from './DBT01Dialog';

//SERVICE
import { DBT01GetDataList, DBT01CreateData, DBT01UpdateData, DBT01CancelData, DBT01SetRecordStatus, DBT01CheckConnectionDatabase } from '../../../service/ServiceDBT/ServiceDBT01';
// import { masterService } from '../../../service/ServiceMaster/MasterService';

export default function DBT01() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    // MASTER
    const [system, setSystem] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    const [optionSource, setOptionSource] = useState([{ label: 'SOURCE', value: 'SOURCE' }, { label: 'PROCESS', value: 'PROCESS' }, { label: 'TARGET', value: 'TARGET' }])
    const [optionDataBase, setOptionDataBase] = useState([{ label: "Oracle", value: "Oracle" }, { label: "PostgreSQL", value: "PostgreSQL" }])

    const onDBT01GetDataList = () => {
        setLoading(true);
        DBT01GetDataList()
            .then(res => {
                setLoading(false);
                if (res.status === 200 && res.error === false) {
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

                if (err.response.data.status == 401) {
                    alert(JSON.stringify('เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่'))
                    window.location.href = '/login'
                } else {
                    alert(JSON.stringify(err.response.data));
                }
                setLoading(false);
            });
    }

    useEffect(() => {
        onDBT01GetDataList();
    }, []);

    const validation = (object) => {
        let showerror = false;
        for (const property in object) {
            if (object[property] === null || object[property] === undefined || object[property] === '') {
                showerror = true
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
            DBT01CreateData(submitForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'บันทึกแหล่งข้อมูลการถ่ายโอน');
                        setDataTable(res.result);
                        onDBT01GetDataList();
                        setDialog(false);
                    } else {
                        showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.message}`);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
        } else if (dialog.action === "UPDATE" && validation(submitForm)) {
            setLoading(true);
            DBT01UpdateData(submitForm)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'แก้ไขแหล่งข้อมูลการถ่ายโอน');
                        setDataTable(res.result);
                        onDBT01GetDataList();
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
        const onADM03DeleteData = () => {
            DBT01CancelData(deleteDialog.data).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    showMessages('success', `สำเร็จ`, 'ยกเลิกข้อมูลสำเร็จ');
                    onDBT01GetDataList();
                    setDeleteDialog(false);
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        }
        return (
            <FooterButtonCenter onClickOk={() => onADM03DeleteData()} onClickCancle={() => setDeleteDialog(false)} />
        );
    }

    const onStatusChange = (rowData, isChecked) => {
        setLoading(true);
        DBT01SetRecordStatus({
            "source_seq": rowData.source_seq,
            "record_status": isChecked === true ? 'N' : 'C'

        }).then(res => {
            if (res.status === 200) {
                showMessages('success', `สำเร็จ`, isChecked === true ? "เปิด การใช้งาน" : "ปิด การใช้งาน");
                onDBT01GetDataList();
                // setDeleteDialog(false);
            }
            setLoading(false);
        }, function (err) {
            setLoading(false);
            showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
        });
    }

    const onCheckConnectionDB = (rowData, isChecked) => {
        setLoading(true);
        DBT01CheckConnectionDatabase({
            "host": rowData.source_host,
            "database_type": rowData.database_type,
            "service_name": rowData.source_service_name,
            "user_name": rowData.user_name,
            "password": rowData.password,
            "port": rowData.source_port.toString()
        }).then(res => {
            if (res === "Connection Successful") {
                showMessages('success', `ตรวจสอบการเชื่อมต่อ`, res);
            } else {
                showMessages('warn', `ตรวจสอบการเชื่อมต่อ`, res);
            }
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
                            <Button onClick={() => onDBT01GetDataList()} icon="pi pi-refresh" className="p-button-rounded p-button-success" tooltip="คลิกเพื่อ Refresh" tooltipOptions={{ position: 'left' }} />
                        </div> */}
                    </div>
                    <DBT01List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}
                        onStatusChange={onStatusChange}
                    />
                    {dialog && (
                        <DBT01Dialog
                            dialog={dialog}
                            setDialog={setDialog}
                            submitForm={(e) => submitForm(e)}
                            system={system}
                            submitted={submitted}
                            setSubmitted={setSubmitted}
                            onCheckConnectionDB={onCheckConnectionDB}
                            optionSource={optionSource}
                            optionDataBase={optionDataBase}
                        />
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
