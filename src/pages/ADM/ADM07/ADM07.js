import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { DialogConfirm, DialogDelete } from '../../../components/DialogService/DialogService';
import FooterButton, { FooterButtonCenter } from '../../../components/FooterButton/FooterButton';
import { Loading } from '../../../components/Loading/Loading';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import ADM07List from './ADM07List';
import ADM07Dialog from './ADM07Dialog';

//SERVICE
import {
    ADM07GetDataList,
    ADM07CreateData,
    ADM07UpdateData,
    ADM07GetDataSurveyUserByFormID,
    ADM07CreateDataSurveyUser,
    ADM07DeleteData,
    ADM07GetDataSurveyListByFormID,
    ADM07AddDataSurveyList
} from '../../../service/ServiceADM/ServiceADM07';

export default function ADM07() {
    const toast = useRef(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [loading, setLoading] = useState(false);

    // NEW
    const [onChangeText, setOnChangeText] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        onGetDataList();
    }, []);

    const onGetDataList = () => {
        setLoading(true);
        ADM07GetDataList()
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    let count = 1;
                    res.result.forEach(element => {
                        element.index = count;
                        count++;
                    });
                    setDataTable(res.result);
                } else {
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
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

    const onGetDataSurveyUserByFormID = (rowData) => {
        ADM07GetDataSurveyUserByFormID(rowData)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    setDialog({ dialogGroup: true, action: 'แก้ไข', dataForm: res.result, data: rowData });
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const onCreateDataSurveyUser = (list) => {
        setLoading(true);
        ADM07CreateDataSurveyUser(dialog.data, list)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    showMessages('success', `สำเร็จ`, 'กำหนดกลุ่มผู้ใช้งาน');
                    setDialog(false)
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const onGetDataSurveyListByFormID = (rowData) => {
        setLoading(true);
        ADM07GetDataSurveyListByFormID(rowData)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    setDialog({ dialogConfigQuestion: true, action: 'คำถาม', data: rowData, list: res.result });
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status}`, err.response.data.message);
            });
    }

    const validation = (object) => {
        if (object.form_name_th === '' || object.form_name_en === '') {
            setSubmitted(true);
            return false;
        } else {
            setSubmitted(false);
            return true;
        }
    }

    const submitForm = (data) => {
        if (dialog.action === "เพิ่ม" && validation(data)) {
            ADM07CreateData(data)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'บันทึกแบบสำรวจความพึงพอใจ');
                        onGetDataList();
                        setDialog(false);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด ${err.response.data.errors.message}`, '');
                });
        } else if (dialog.action === "แก้ไข" && validation(data)) {
            ADM07UpdateData(data)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'แก้ไขแบบสำรวจความพึงพอใจ');
                        onGetDataList();
                        setDialog(false);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด ${err.response.data.errors.message}`, '');
                });
        } else if (dialog.action === "คำถาม" && data.length > 0) {
            setLoading(true);
            ADM07AddDataSurveyList(data)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'กำหนดคำถาม');
                        setDialog(false)
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด`, err.response.data.errors.message);
                });
        }

    }

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 10000 });
    }

    const footerButton = () => {
        const onADM07DeleteData = () => {
            ADM07DeleteData(deleteDialog.data.form_seq)
                .then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'ลบข้อมูลสำเร็จ');
                        onGetDataList();
                        setDeleteDialog(false);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด`, err.response.data.errors.message);
                });
        }
        return (
            <FooterButtonCenter onClickOk={() => onADM07DeleteData()} onClickCancle={() => setDeleteDialog(false)} />
        );
    }

    return (
        <>
            <Loading loading={loading} />
            <Toast ref={toast} position="top-right" />
            <div className="datatable-crud-demo">
                <div className="card">
                    <h1 className="p-m-0">{getTextMenu()}</h1>
                    {/* <ADM07Search /> */}
                    <ADM07List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}

                        // 
                        onGetDataSurveyUserByFormID={onGetDataSurveyUserByFormID}
                        onGetDataSurveyListByFormID={onGetDataSurveyListByFormID}
                    />
                    {dialog.dialogConfigQuestion === true || dialog.dialog === true || dialog.dialogGroup === true ?
                        <ADM07Dialog
                            dialog={dialog}
                            setDialog={setDialog}
                            submitForm={(e) => submitForm(e)}
                            onCreateDataSurveyUser={(e) => onCreateDataSurveyUser(e)}
                            onChangeText={onChangeText}
                            setOnChangeText={setOnChangeText}
                            submitted={submitted}
                            setSubmitted={setSubmitted}
                        />
                        : ''}
                </div>
            </div>
            <DialogDelete
                visible={deleteDialog.open}
                header="การยืนยัน"
                modal
                footer={footerButton()}
                onHide={() => setDeleteDialog(false)}
                textContent="คุณต้องการลบข้อมูล ใช่หรือไม่ ?"
            />
        </>
    )
}
