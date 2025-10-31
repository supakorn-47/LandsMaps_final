import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { DialogConfirm, DialogDelete } from '../../../components/DialogService/DialogService';
import FooterButton, { FooterButtonCenter } from '../../../components/FooterButton/FooterButton';
import { Loading } from '../../../components/Loading/Loading';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import ADM06Search from './ADM06Search';
import ADM06List from './ADM06List';
import ADM06Dialog from './ADM06Dialog';

//SERVICE
import { masterService } from '../../../service/ServiceMaster/MasterService';
import ADM06Services from '../../../service/ServiceADM/ServiceADM06';
import { Dialog } from 'primereact/dialog';
import Iframe from "react-iframe";
import { Button } from 'primereact/button';

export default function ADM06() {
    const toast = useRef(null);
    const [dataTable, setDataTable] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popupViewFile, setPopupViewFile] = useState(false);
    // SEARCH
    const [searchData, setSearchData] = useState({
        "announce_date_from": new Date(new Date().setDate(1)),
        "announce_date_to": new Date()
    });

    const [submitted, setSubmitted] = useState(false);

    const [arrFile, setArrFile] = useState([
        {
            file: ""
        }
    ]);

    const [arrImg, setArrImg] = useState([
        {
            file: ""
        }
    ]);

    const [annouceType, setAnnouceType] = useState([]);
    
    useEffect(() => {
        onGetDataList();

        masterService(`GetAnnounceType?mode=1`, {}, "GET")
            .then(res => {
                setAnnouceType(res.result);
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.status} ${err.response.message}`, '');
            });

    }, []);

    useEffect(() => {
        return () => {
            setArrFile([
                {
                    file: ""
                }
            ])
            setArrImg([
                {
                    file: ""
                }
            ])
        }
    }, [dialog]);

    const onGetDataList = () => {
        setLoading(true);
        ADM06Services.GetDataList(searchData)
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

    const onGetAnnounceFileList = (rowData, check = "") => {
        setLoading(true);
        ADM06Services.GetAnnounceFileList(rowData)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    if (check === "") {
                        setDialog({ dialog: true, action: 'แก้ไข', data: rowData })
                    }
                    let files = [];
                    let images = [];
                    res.result.forEach(element => {
                        if (element.announce_file_type === "1") {
                            images.push(element)
                        } else {
                            files.push(element)
                        }
                    });
                    setArrFile(files);
                    setArrImg(images);
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

    const onViewFileClick = (rowData) => {
        setLoading(true);
        ADM06Services.GetAnnounceFileList(rowData)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    let arrImage = [];
                    let arrPDF = [];
                    res.result.forEach(element => {
                        if (element.announce_file_type === "1") {
                            arrImage.push(element);
                        } else {
                            arrPDF.push(element);
                        }
                    });
                    setDialog({ dialogViewImage: true, action: 'แสดงรูปภาพ', viewImage: arrImage, viewPDF: arrPDF })
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

    const validation = (object) => {
        if (object.function_name === '' || object.announce_title_th === '' ||
            object.announce_title_en === '' || object.announce_desc_th === '' ||
            object.announce_desc_en === '' || object.service_url === '' || object.announce_type === -1 || object.announce_type === '-1'
        ) {
            setSubmitted(true);
            return false;
        } else {
            setSubmitted(false);
            return true;
        }
    }

    const submitForm = (submitForm, arrFile, arrImg) => {
        // console.log('submitForm', submitForm)
        let files = [...arrImg, ...arrFile];
        let _ArrFileSendToApi = [];
        for (let index = 0; index < files.length; index++) {
            if (files[index].announce_file_seq === undefined && files[index].file !== "") {
                _ArrFileSendToApi.push(files[index]);
            }
        }

        let announce_file_types = [];
        _ArrFileSendToApi.forEach(element => {
            if (element.type === "application/pdf") {
                announce_file_types.push('2');
            } else {
                announce_file_types.push('1');
            }
        });
        
        if (dialog.action === "บันทึก" && validation(submitForm)) {
            setLoading(true);
            ADM06Services.CreateData({
                ...submitForm,
                files: _ArrFileSendToApi,
                announce_file_types: announce_file_types
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    showMessages('success', `สำเร็จ`, 'บันทึกกำหนดข่าวประกาศ');
                    onGetDataList();
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
            ADM06Services.UpdateData({
                ...submitForm,
                files: _ArrFileSendToApi,
                announce_file_types: announce_file_types
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    showMessages('success', `สำเร็จ`, 'แก้ไขกำหนดข่าวประกาศ');
                    onGetDataList();
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

    //DELETE
    const footerButton = () => {

        const onDeleteData = () => {
            setLoading(true);
            if (deleteDialog.onClickDelete === 'ROW') {
                ADM06Services.DeleteData({
                    announce_seq: deleteDialog.data.announce_seq
                }).then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'ลบข้อมูลสำเร็จ');
                        onGetDataList();
                        setDeleteDialog(false);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
            } else if (deleteDialog.onClickDelete === 'FILE') {
                ADM06Services.DeleteFile({
                    announce_file_seq: deleteDialog.data.announce_file_seq
                }).then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        showMessages('success', `สำเร็จ`, 'ลบข้อมูลสำเร็จ');
                        onGetAnnounceFileList(deleteDialog.data, 'DeleteFile');
                        setDeleteDialog(false);
                        arrImg.splice(deleteDialog.data.indexDelete, 1);
                    }
                }, function (err) {
                    setLoading(false);
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
                });
            }
        }
        return (
            <FooterButtonCenter onClickOk={() => onDeleteData()} onClickCancle={() => setDeleteDialog(false)} />
        );

    }

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 10000 });
    }

    const footerPDF = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                <Button label="ปิดหน้าต่าง" icon="pi pi-times" onClick={() => setPopupViewFile(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
            </div>
        );
    }

    return (
        <>
            <Loading loading={loading} />
            <div className="datatable-crud-demo">
                {/* <Toast ref={(el) => toast = el} /> */}
                <Toast ref={toast} position="top-right" />
                <div className="card">
                    <h1 className="p-m-0">{getTextMenu()}</h1>
                    <ADM06Search
                        searchData={searchData}
                        setSearchData={setSearchData}
                        onSearch={() => onGetDataList()}
                    />
                    <ADM06List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        setDeleteDialog={setDeleteDialog}
                        onGetAnnounceFileList={onGetAnnounceFileList}
                        onViewFileClick={onViewFileClick} />
                </div>
                {dialog.dialog === true || dialog.dialogViewImage === true ? <>
                    <ADM06Dialog
                        dialog={dialog}
                        setDialog={setDialog}
                        submitForm={(a, b, c) => submitForm(a, b, c)}
                        submitted={submitted}
                        showMessages={showMessages}
                        arrFile={arrFile} setArrFile={setArrFile}
                        arrImg={arrImg} setArrImg={setArrImg}
                        setPopupViewFile={setPopupViewFile}
                        setDeleteDialog={setDeleteDialog}
                        annouceType={annouceType}
                    />
                </> : ''}
                <DialogDelete
                    visible={deleteDialog.open}
                    header="การยืนยัน"
                    modal
                    footer={footerButton()}
                    onHide={() => setDeleteDialog(false)}
                    textContent="คุณต้องการลบข้อมูล ใช่หรือไม่ ?"
                />

            </div>

            {popupViewFile &&
                (<Dialog
                    header="PDF"
                    visible={popupViewFile.open}
                    blockScroll={true}
                    maximized={true}
                    onHide={() => setPopupViewFile({ open: false, linkURL: null })}
                    footer={footerPDF()}
                >
                    <div className="confirmation-content" style={{ paddingTop: '0em' }}>
                        <Iframe
                            url={popupViewFile.linkURL}
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
