import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DialogDelete } from '../../../components/DialogService/DialogService';
import { FooterButtonCenter } from '../../../components/FooterButton/FooterButton';
import { Loading } from '../../../components/Loading/Loading';
import { getTextMenu } from '../../../utils/MenuUtil';

import ADM04List from './ADM04List';
import ADM04Dialog from './ADM04Dialog';

//SERVICE
import {
    ADM04GetDataList, ADM04CreateData, ADM04UpdateData, ADM04CancelData, UpdateOrder
} from '../../../service/ServiceADM/ServiceADM04';

export default function ADM04() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [dialogToken, setDialogToken] = useState({ dialog: false, action: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);



    useEffect(() => {
        setSubmitted(false)
    }, [dialog])

    useEffect(() => {
        onADM04GetDataList();
    }, []);

    const onADM04GetDataList = () => {
        setLoading(true);
        ADM04GetDataList()
            .then(res => {
                setLoading(false);
                if (res.status == 200 && res.result != null) {
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
        // console.log(object)
        let showerror = false;
        for (const property in object) {

            if (object[property] === 0 || object[property] === '' || object[property] === null || object[property] === undefined) {

                if (property != "remark")
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
        if (dialog.action === "บันทึก" && validation(submitForm)) {
            setLoading(true);
            ADM04CreateData(submitForm)
                .then(res => {
                    setLoading(false);
                    showMessages('success', `สำเร็จ`, 'บันทึกข้อมูล Status Code');
                    onADM04GetDataList();
                    setDialog(false);
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
        } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
            setLoading(true);
            ADM04UpdateData(submitForm)
                .then(res => {
                    setLoading(false);
                    showMessages('success', `สำเร็จ`, 'แก้ไขข้อมูล Status Code');
                    onADM04GetDataList();
                    setDialog(false);
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
            ADM04CancelData(deleteDialog).then(res => {
                setLoading(false);
                showMessages('success', `สำเร็จ`, `${deleteDialog.record_status === "C" ? 'ยกเลิก' : 'ลบ' }ข้อมูลสำเร็จ`);
                onADM04GetDataList();
                setDeleteDialog(false);
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        }
        return (
            <FooterButtonCenter onClickOk={() => onADM03DeleteData()} onClickCancle={() => setDeleteDialog(false)} />
        );
    }

    const onRowReorder = (e) => {
        setDialog(true);
        UpdateOrder(e.value).then(res => {
            setLoading(false);
            showMessages('success', `สำเร็จ`, 'บันทึกจัดเรียง');
            onADM04GetDataList();
            setDialog(false);
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
                        <h1 className="p-m-0">{getTextMenu()}</h1>
                    </div>
                    <ADM04List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}
                        onRowReorder={onRowReorder}
                    />
                    {dialog && (
                        <ADM04Dialog
                            dialog={dialog}
                            setDialog={setDialog}
                            submitForm={(e) => submitForm(e)}
                            submitted={submitted}
                            showMessages={showMessages}
                            setLoading={setLoading}
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
                textContent={deleteDialog.textConfirm}
            />
        </>
    )
}
