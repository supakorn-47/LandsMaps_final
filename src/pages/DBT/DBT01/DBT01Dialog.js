import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { validateInputText } from '../../../utils/ValidateUtil';

export default function DBT01Dialog({ dialog, setDialog, submitForm, optionSource, optionDataBase, submitted, setSubmitted, onCheckConnectionDB }) {
    const [formObject, setformObject] = useState({});

    useEffect(() => {
        if (dialog.dialogUpdate === true) {
            setformObject(dialog.data);
        } else {
            setformObject({
                "source_ord": 0,
                "source_seq": 0,
                "source_name": "",
                "source_process": "",
                "source_host": "",
                "database_type": "",
                "source_service_name": "",
                "user_name": "",
                "password": "",
                "source_port": null,
                "record_status": "N"
            })
        }
    }, [dialog.data]);

    // แก้ไข
    const dialogUpdate = () => {
        const renderFooterUpdate = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ตรวจสอบการเชื่อมต่อ" icon="pi pi-refresh" onClick={() => onCheckConnectionDB(formObject)} className="p-button-info p-button-rounded" />
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => (setDialog(false), setSubmitted(false))} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label="แก้ไข" icon="pi pi-check" onClick={() => submitForm(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }

        return (
            <Dialog
                header={"แก้ไขแหล่งข้อมูลถ่ายโอน"}
                visible={dialog.dialogUpdate}
                style={{ width: '50vw' }}
                footer={renderFooterUpdate()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                {/* <div className="p-grid" style={{ marginBottom: 30 }}> */}
                <div className="p-grid" >
                    <div className="p-col-6">
                        <label>ลำดับ</label>
                        <InputNumber value={formObject.source_ord} onValueChange={(e) => setformObject({ ...formObject, source_ord: e.value })} mode="decimal" min={1} max={1000000} showButtons />
                    </div>
                    <div className="p-col-6"></div>
                    <div className="p-col-12">
                        <label>แหล่งข้อมูล<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_name} onChange={(e) => setformObject({ ...formObject, source_name: e.target.value })} />
                        {submitted && !formObject.source_name && validateInputText('source_name', 'แหล่งข้อมูล')}
                    </div>
                    <div className="p-col-12">
                        <label>Source Process<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.source_process}
                            options={optionSource}
                            onChange={(e) => setformObject({ ...formObject, source_process: e.value })}
                            placeholder="Source Process"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.source_process && validateInputText('source_process', 'Source Process')}
                    </div>
                    <div className="p-col-9">
                        <label>Host<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_host} onChange={(e) => setformObject({ ...formObject, source_host: e.target.value })} />
                        {submitted && !formObject.source_host && validateInputText('source_host', 'Host')}
                    </div>
                    <div className="p-col-3">
                        <label>Port<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_port} onChange={(e) => setformObject({ ...formObject, source_port: e.target.value })} keyfilter="int" maxLength="20" />
                        {submitted && !formObject.source_port && validateInputText('source_port', 'Port')}
                    </div>
                    <div className="p-col-6">
                        <label>Database Type<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.database_type}
                            options={optionDataBase}
                            onChange={(e) => setformObject({ ...formObject, database_type: e.value })}
                            placeholder="Database Type"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.database_type && validateInputText('database_type', 'Database Type')}
                    </div>
                    <div className="p-col-6">
                        <label>Service Name<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_service_name} onChange={(e) => setformObject({ ...formObject, source_service_name: e.target.value })} />
                        {submitted && !formObject.source_service_name && validateInputText('source_service_name', 'Service Name')}
                    </div>
                    <div className="p-col-6">
                        <label>User ID<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.user_name} onChange={(e) => setformObject({ ...formObject, user_name: e.target.value })} />
                        {submitted && !formObject.user_name && validateInputText('user_name', 'User ID')}
                    </div>
                    <div className="p-col-6">
                        <label>Password<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.password} onChange={(e) => setformObject({ ...formObject, password: e.target.value })} />
                        {submitted && !formObject.password && validateInputText('password', 'Password')}
                    </div>
                </div>
                {/* </div> */}
            </Dialog>
        )
    }

    const dialogAdd = () => {

        const renderFooterAdd = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ตรวจสอบการเชื่อมต่อ" icon="pi pi-refresh" onClick={() => console.log(1)} className="p-button-info p-button-rounded" />
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => (setDialog(false), setSubmitted(false))} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label="บันทึก" icon="pi pi-check" onClick={() => submitForm(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }

        return (
            <Dialog
                header={"เพิ่มแหล่งข้อมูลถ่ายโอน"}
                visible={dialog.dialogAdd}
                style={{ width: '50vw' }}
                footer={renderFooterAdd()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                {/* <div className="p-grid" style={{ marginBottom: 30 }}> */}
                <div className="p-grid">
                    <div className="p-col-6">
                        <label>ลำดับ</label>
                        <InputNumber value={formObject.source_ord} onValueChange={(e) => setformObject({ ...formObject, source_ord: e.value })} mode="decimal" min={0} max={1000000} showButtons />
                    </div>
                    <div className="p-col-6"></div>
                    <div className="p-col-12">
                        <label>แหล่งข้อมูล<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_name} onChange={(e) => setformObject({ ...formObject, source_name: e.target.value })} />
                        {submitted && !formObject.source_name && validateInputText('source_name', 'แหล่งข้อมูล')}
                    </div>
                    <div className="p-col-12">
                        <label>Source Process<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.source_process}
                            options={optionSource}
                            onChange={(e) => setformObject({ ...formObject, source_process: e.value })}
                            placeholder="Source Process"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.source_process && validateInputText('source_process', 'Source Process')}
                    </div>
                    <div className="p-col-9">
                        <label>Host<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_host} onChange={(e) => setformObject({ ...formObject, source_host: e.target.value })} />
                        {submitted && !formObject.source_host && validateInputText('source_host', 'Host')}
                    </div>
                    <div className="p-col-3">
                        <label>Port<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_port} onChange={(e) => setformObject({ ...formObject, source_port: e.target.value })} keyfilter="int" maxLength="20" />
                        {submitted && !formObject.source_port && validateInputText('source_port', 'Port')}
                    </div>
                    <div className="p-col-6">
                        <label>Database Type<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.database_type}
                            options={optionDataBase}
                            onChange={(e) => setformObject({ ...formObject, database_type: e.value })}
                            placeholder="Database Type"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.database_type && validateInputText('database_type', 'Database Type')}
                    </div>
                    <div className="p-col-6">
                        <label>Service Name<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.source_service_name} onChange={(e) => setformObject({ ...formObject, source_service_name: e.target.value })} />
                        {submitted && !formObject.source_service_name && validateInputText('source_service_name', 'Service Name')}
                    </div>
                    <div className="p-col-6">
                        <label>User ID<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.user_name} onChange={(e) => setformObject({ ...formObject, user_name: e.target.value })} />
                        {submitted && !formObject.user_name && validateInputText('user_name', 'User ID')}
                    </div>
                    <div className="p-col-6">
                        <label>Password<span style={{ color: "red" }}>*</span></label>
                        <InputText value={formObject.password} onChange={(e) => setformObject({ ...formObject, password: e.target.value })} />
                        {submitted && !formObject.password && validateInputText('password', 'Password')}
                    </div>
                </div>
                {/* </div> */}
            </Dialog>
        )
    }

    return (
        <>
            {dialogUpdate()}
            {dialogAdd()}
        </>
    )
}
