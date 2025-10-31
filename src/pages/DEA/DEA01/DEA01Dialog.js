import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from "primereact/selectbutton";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { validateInputText } from '../../../utils/ValidateUtil';
import { formatDateTH } from '../../../utils/DateUtil';
import { Calendars } from '../../../components/Calendar/Calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { currentPageReportTemplate, paginatorTemplate, rowsPerPageOptions } from '../../../utils/TableUtil';

//Service
import { DEA01GetJWTKong } from '../../../service/ServiceDEA/ServiceDEA01';

export default function DEA01Dialog({ dialog, setDialog, submitForm, submitted, dataConfig, submitFormConfigService, dataToken,
    setDialogToken, dialogToken, submitFormConfigToken, returnStatus, showMessages, setLoading }) {
    const [formObject, setformObject] = useState({});
    const [selectedTable, setSelectedTable] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [depTypeName, setDepTypeName] = useState([{ label: "รับข้อมูล", value: "1" }, { label: "ส่งข้อมูล", value: "2" }, { label: "รับ-ส่งข้อมูล", value: "3" }])
    const [statusOption, setStatusOption] = useState([{ label: "ใช้งาน", value: "N" }, { label: "ไม่ใช้งาน", value: "C" }])

    useEffect(() => {

        if (dialog.dialog === true) {
            setformObject(dialog.data);
        } else {
            setformObject({
                department_name_th: '',
                department_name_en: '',
                department_type: '1',
                consumer_username: '',
                custom_id: '',
                consumer_id: '',
                jwt_key: '',
                jwt_secret: '',
                jwt_algorithm: '',
                record_status: 'N',
                remark: '',
            })
        }
    }, [dialog.dialog])

    // กำหนด Service
    useEffect(() => {
        if (dialog.dialogConfigService == true) {
            let arr_Temp = [];
            dataConfig.forEach(element => {
                if (element.ischecked === 1) {
                    arr_Temp.push(element);
                }
            });
            setSelectedTable(arr_Temp);
        }
    }, [dialog.dialogConfigService])

    // กำหนด Token
    useEffect(() => {
        let date = new Date();
        date.setMinutes(date.getMinutes() + 5)
        if (dialog.dialogConfigToken == true) {
            if (dialogToken.action === 'แก้ไข') {
                setformObject(dialogToken.data)
            } else {
                setformObject({
                    department_seq: dialog.data.department_seq,
                    token_expires_dtm: date,
                    remark: ""
                })
            }
        }
    }, [dialogToken.dialog])


    //consumerUsername
    const onDEA01GetJWTKong = (username) => {
        setLoading(true)
        DEA01GetJWTKong(username)
            .then(res => {
                setLoading(false)
                if (res.result.length > 0) {
                    setformObject({
                        ...formObject,
                        custom_id: res.result[0].custom_id,
                        consumer_id: res.result[0].consumer_id,
                        jwt_key: res.result[0].jwt_key,
                        jwt_secret: res.result[0].jwt_secret,
                        jwt_algorithm: res.result[0].jwt_algorithm,
                    })
                } else {
                    showMessages('warn', `แจ้งเตือน`, 'ไม่พบ Consumer Username');
                    setformObject({
                        ...formObject,
                        custom_id: "",
                        consumer_id: "",
                        jwt_key: "",
                        jwt_secret: "",
                        jwt_algorithm: "",
                    })
                }

            }, function (err) {
                setLoading(false)
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            })


    }

    //แก้ไข
    const dialogUpdate = () => {

        const renderFooter = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setDialog(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label="แก้ไข" icon="pi pi-check" onClick={() => submitForm(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }

        return (
            <Dialog
                header={"แก้ไขข้อมูลหน่วยงานแลกเปลี่ยน"}
                visible={dialog.dialog}
                style={{ width: '40vw' }}
                footer={renderFooter()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid" style={{ marginBottom: 30 }}>
                <div className="p-col-12">
                        <label>หน่วยงาน (ภาษาไทย)<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.department_name_th} onChange={(e) => setformObject({ ...formObject, department_name_th: e.target.value })} />
                        {submitted && !formObject.department_name_th && validateInputText('department_name_th', 'หน่วยงาน (ภาษาไทย)')}
                    </div>
                    <div className="p-col-12">
                        <label>หน่วยงาน (ภาษาอังกฤษ)<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.department_name_en} onChange={(e) => setformObject({ ...formObject, department_name_en: e.target.value })} />
                        {submitted && !formObject.department_name_en && validateInputText('department_name_en', 'หน่วยงาน (ภาษาอังกฤษ)')}
                    </div>
                    <div className="p-col-12">
                        <label>หมายเหตุ<span style={{ color: "red" }}>*</span></label>
                        <InputTextarea rows={3} value={formObject.remark} onChange={(e) => setformObject({ ...formObject, remark: e.target.value })} 
                        style={{ resize: 'none' }}/>
                        {submitted && !formObject.remark && validateInputText('remark', 'วัตถุประสงค์')}
                    </div>
                    <div className="p-col-9">
                        <label>ประเภทแลกเปลี่ยน<span style={{ color: "red" }}>*</span></label>
                        <SelectButton
                            value={formObject.department_type}
                            options={depTypeName}
                            onChange={(e) => setformObject({ ...formObject, department_type: e.target.value })}
                            optionLabel="label" optionValue="value"
                        />
                        {submitted && formObject.department_type === null && validateInputText('department_type', 'ประเภทแลกเปลี่ยน')}
                    </div>
                    <div className="p-col-6">
                        <label>สถานะ<span style={{ color: "red" }}>*</span></label>
                        <SelectButton
                            value={formObject.record_status}
                            options={statusOption}
                            onChange={(e) => setformObject({ ...formObject, record_status: e.target.value })}
                            optionLabel="label" optionValue="value"
                        />
                        {submitted && formObject.record_status === null && validateInputText('record_status', 'สถานะ')}
                    </div>
                    <div className="p-col-6"></div>
                </div>
            </Dialog>
        )
    }

    //เพิ่ม
    const dialogAdd = () => {

        const renderFooter = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setDialog(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label="บันทึก" icon="pi pi-check" onClick={() => submitForm(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }

        return (
            <Dialog
                header={"เพิ่มข้อมูลหน่วยงานแลกเปลี่ยน"}
                visible={dialog.dialogAdd}
                style={{ width: '40vw' }}
                footer={renderFooter()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid" style={{ marginBottom: 30 }}>
                    <div className="p-col-12">
                        <label>หน่วยงาน (ภาษาไทย)<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.department_name_th} onChange={(e) => setformObject({ ...formObject, department_name_th: e.target.value })} />
                        {submitted && !formObject.department_name_th && validateInputText('department_name_th', 'หน่วยงาน (ภาษาไทย)')}
                    </div>
                    <div className="p-col-12">
                        <label>หน่วยงาน (ภาษาอังกฤษ)<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.department_name_en} onChange={(e) => setformObject({ ...formObject, department_name_en: e.target.value })} />
                        {submitted && !formObject.department_name_en && validateInputText('department_name_en', 'หน่วยงาน (ภาษาอังกฤษ)')}
                    </div>
                    <div className="p-col-12">
                        <label>หมายเหตุ<span style={{ color: "red" }}>*</span></label>
                        <InputTextarea rows={3} value={formObject.remark} onChange={(e) => setformObject({ ...formObject, remark: e.target.value })}
                        style={{ resize: 'none' }} />
                        {submitted && !formObject.remark && validateInputText('remark', 'วัตถุประสงค์')}
                    </div>
                    <div className="p-col-9">
                        <label>ประเภทแลกเปลี่ยน<span style={{ color: "red" }}>*</span></label>
                        <SelectButton
                            value={formObject.department_type}
                            options={depTypeName}
                            onChange={(e) => setformObject({ ...formObject, department_type: e.target.value })}
                            optionLabel="label" optionValue="value"
                        />
                        {submitted && formObject.department_type === null && validateInputText('department_type', 'ประเภทแลกเปลี่ยน')}
                    </div>
                    <div className="p-col-6">
                        <label>สถานะ<span style={{ color: "red" }}>*</span></label>
                        <SelectButton
                            value={formObject.record_status}
                            options={statusOption}
                            onChange={(e) => setformObject({ ...formObject, record_status: e.target.value })}
                            optionLabel="label" optionValue="value"
                        />
                        {submitted && formObject.record_status === null && validateInputText('record_status', 'สถานะ')}
                    </div>
                    <div className="p-col-6"></div>

                    {/* <div className="p-col-6">
                        <label>Consumer Username<span style={{ color: "red" }}>*</span></label>
                        <div className="p-inputgroup">
                            <InputText value={formObject.consumer_username} onChange={(e) => setformObject({ ...formObject, consumer_username: e.target.value })} maxLength="50" />
                            <Button label="ค้นหา" icon="pi pi-search" onClick={() => onDEA01GetJWTKong(formObject.consumer_username)} />
                        </div>
                        {submitted && !formObject.consumer_username && validateInputText('consumer_username', 'Consumer Username')}
                    </div>
                    <div className="p-col-6">
                        <label>Custom Id<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.custom_id} onChange={(e) => setformObject({ ...formObject, custom_id: e.target.value })} maxLength="50" />
                        {submitted && !formObject.custom_id && validateInputText('custom_id', 'Custom  id')}
                    </div>
                    <div className="p-col-6">
                        <label>Consumer Id<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.consumer_id} onChange={(e) => setformObject({ ...formObject, consumer_id: e.target.value })} maxLength="50" />
                        {submitted && !formObject.consumer_id && validateInputText('consumer_id', 'Consumer id')}
                    </div>
                    <div className="p-col-6">
                        <label>JWT Key<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.jwt_key} onChange={(e) => setformObject({ ...formObject, jwt_key: e.target.value })} maxLength="50" />
                        {submitted && !formObject.jwt_key && validateInputText('jwt_key', 'JWT Key')}
                    </div>
                    <div className="p-col-6">
                        <label>JWT Secret<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.jwt_secret} onChange={(e) => setformObject({ ...formObject, jwt_secret: e.target.value })} maxLength="200" />
                        {submitted && !formObject.jwt_secret && validateInputText('jwt_secret', 'JWT Secret')}
                    </div>
                    <div className="p-col-6">
                        <label>JWT Algorithm<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.jwt_algorithm} onChange={(e) => setformObject({ ...formObject, jwt_algorithm: e.target.value })} maxLength="50" />
                        {submitted && !formObject.jwt_algorithm && validateInputText('jwt_algorithm', 'JWT Algorithm')}
                    </div> */}

                </div>
            </Dialog>
        )
    }

    // กำหนด Service
    const dialogConfigService = () => {
        if (dialog.data === undefined) return;

        const header = (
            <div className="table-header">
                <div>
                </div>
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="ค้นหา"
                            style={{ width: '300px' }} />
                    </span>
                </div>
            </div>
        );

        const footer = () => {
            return (
                <div style={{ textAlignLast: 'end' }}>
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setDialog(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label="บันทึก" icon="pi pi-check" onClick={() => submitFormConfigService(dialog.data, selectedTable)} autoFocus className="p-button-rounded" />
                </div>
            );
        }

        return (
            <Dialog
                header={"กำหนด Service [ " + dialog.data.department_name_th + " ]"}
                visible={dialog.dialogConfigService}
                style={{ width: '75vw' }}
                footer={footer()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid" style={{ marginBottom: 30 }}>
                    <div className="p-col-12">
                        <DataTable
                            header={header}
                            globalFilter={globalFilter} emptyMessage="ไม่พบข้อมูล"
                            selection={selectedTable}
                            onSelectionChange={e => setSelectedTable(e.value)}
                            value={dataConfig}
                            paginator
                            rows={10}
                            rowsPerPageOptions={rowsPerPageOptions()}
                            currentPageReportTemplate={currentPageReportTemplate()}
                            autoLayout
                            rowHover
                        >
                            <Column selectionMode="multiple" headerStyle={{ textAlign: 'center', width: '3.5rem' }} bodyStyle={{ textAlign: 'center' }} />
                            <Column field="index" header="ลำดับ" headerStyle={{ width: '4.5rem', wordWrap: 'break-word' }} bodyStyle={{ textAlign: 'center' }}></Column>
                            <Column field="service_name" header="Name" style={{ width: '20rem', wordWrap: 'break-word' }}></Column>
                            <Column field="service_url" header="URL" style={{ wordWrap: 'break-word' }}></Column>
                            <Column field="service_method" header="Method" style={{ width: '8em', textAlign: 'center', wordWrap: 'break-word' }}></Column>
                            <Column field="service_data_type" header="Data Type" style={{ width: '8em', textAlign: 'center', wordWrap: 'break-word' }}></Column>
                            <Column field="service_type" header="Type" style={{ width: '8em', textAlign: 'center', wordWrap: 'break-word' }}></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        )
    }

    // กำหนด Token
    const dialogConfigToken = () => {
        if (dialog.data === undefined) return;
        const header = (
            <div className="table-header">
                <div>
                    <Button label="เพิ่ม Token" icon="pi pi-plus" onClick={() => setDialogToken({ dialog: true, action: 'บันทึก' })} className="p-button-rounded" />
                </div>
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="ค้นหา"
                            style={{ width: '300px' }} />
                    </span>
                </div>
            </div>
        );

        const actionEdit = (rowData) => {
            return (
                <div style={{ textAlign: 'center' }}>
                    <Button onClick={() => setDialogToken({ dialog: true, action: 'แก้ไข', data: rowData })} icon="pi pi-pencil" className="p-button-rounded p-button-warning" tooltip="คลิกเพื่อ แก้ไข" tooltipOptions={{ position: 'top' }} />
                </div>
            );
        }

        const formatDate = (data, key) => {
            return (
                <>
                    {formatDateTH(data[key], true)}
                </>
            )
        }
        const footer = () => {
            return (
                <div style={{ textAlignLast: 'end' }}>
                    <Button label="ปิดหน้าต่าง" icon="pi pi-times" onClick={() => setDialog(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                </div>
            );
        }

        return (
            <Dialog
                header={"กำหนด Token [ " + dialog.data.department_name_th + " ]"}
                visible={dialog.dialogConfigToken}
                style={{ width: '75vw', height: '100%' }}
                contentStyle={{ height: '100%' }}
                footer={footer()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid" style={{ marginBottom: 30 }}>
                    <div className="p-col-12">
                        <DataTable
                            value={dataToken}
                            header={header}
                            globalFilter={globalFilter}
                            emptyMessage="ไม่พบข้อมูล"
                            paginator
                            rows={5}
                            rowsPerPageOptions={rowsPerPageOptions()}
                            paginatorTemplate={paginatorTemplate()}
                            currentPageReportTemplate={currentPageReportTemplate()}
                            autoLayout
                            rowHover
                            paginatorDropdownAppendTo={document.body} >
                            {/* <Column selectionMode="multiple" style={{ width: '3em', textAlign: 'center' }} /> */}
                            <Column field="order_no" header="ลำดับ" style={{ width: '3rem', textAlign: 'center' }}></Column>
                            <Column sortable field="access_token" header="Token" style={{ wordWrap: 'break-word' }}></Column>
                            <Column sortable field="token_expires_dtm" header="วันเวลาหมดอายุ" body={(e) => formatDate(e, "token_expires_dtm")} style={{ width: '10em', textAlign: 'center' }}></Column>
                            <Column sortable field="record_status" header="สถานะ" body={(e) => returnStatus(e, "record_status")} style={{ width: '6em', textAlign: 'center' }}></Column>
                            <Column sortable field="last_upd_dtm" header="วันเวลาแก้ไข" body={(e) => formatDate(e, "last_upd_dtm")} style={{ width: '10em', textAlign: 'center' }}></Column>
                            <Column header="แก้ไข" body={actionEdit} style={{ width: '4em', textAlign: 'center' }}></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        )


    }
    //form เพิ่ม/แก้ไข Token
    const dialogDataToken = () => {
        const footer = () => {
            return (
                <div style={{ textAlignLast: 'end' }}>
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setDialogToken(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label={dialogToken.action} icon="pi pi-check" onClick={() => submitFormConfigToken(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }
        return (
            <Dialog
                header={dialogToken.action === 'บันทึก' ? "เพิ่ม Token" : "แก้ไข Token"}
                visible={dialogToken.dialog}
                style={{ width: '40vw' }}
                footer={footer()}
                onHide={() => setDialogToken(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid" style={{ marginBottom: 30 }}>
                    <div className="p-col-12">
                        <label>วันเวลาหมดอายุ<span style={{ color: "red" }}>*</span></label>
                        <Calendars
                            value={new Date(formObject.token_expires_dtm)}
                            dateFormat={"dd/mm/yy"}
                            showTime
                            minDate={new Date()}
                            onChange={(e) => setformObject({ ...formObject, token_expires_dtm: e.target.value })}
                            disabled={dialogToken.action === 'แก้ไข' ? true : false} />
                    </div>


                    <div className="p-col-12">
                        <label>หมายเหตุ</label>
                        <InputText value={formObject.remark} onChange={(e) => setformObject({ ...formObject, remark: e.target.value })} maxLength="255" />
                    </div>

                    {dialogToken.action === 'แก้ไข' ?
                        <div className="p-col-6">
                            <label>สถานะ<span style={{ color: "red" }}>*</span></label>
                            <SelectButton
                                value={formObject.record_status}
                                options={statusOption}
                                onChange={(e) => setformObject({ ...formObject, record_status: e.target.value })}
                                optionLabel="label" optionValue="value"
                            />
                            {submitted && formObject.record_status === null && validateInputText('record_status', 'สถานะ')}
                        </div>
                        : ""}

                </div>
            </Dialog>
        )
    }

    return (
        <>
            {dialogUpdate()}
            {dialogAdd()}
            {dialogConfigService()}
            {dialogConfigToken()}
            {dialogDataToken()}
        </>
    )
}
