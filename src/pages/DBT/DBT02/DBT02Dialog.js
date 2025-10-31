import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { validateInputText } from '../../../utils/ValidateUtil';

export default function DBT02Dialog({ dialog, setDialog, submitForm, setSubmitted, submitted, msFormDataSource, msFormDataSourceProcess,
    msFormDataTransferProcess, msFormDataTransferGroup, onGetJobFileDataList, jobFileDataList }) {
    const [formObject, setformObject] = useState({});

    // Schema ต้นทาง
    const [sourceSchema, setSourceSchema] = useState([
        { label: 'กรุณาเลือก Schema ต้นทาง', value: '' },
        { label: 'REG', value: 'REG' },
        { label: 'SVO', value: 'SVO' },
        { label: 'MAPDOL', value: 'MAPDOL' },
        { label: 'INDIAN', value: 'INDIAN' },
        { label: 'INDIAN47', value: 'INDIAN47' },
        { label: 'INDIAN48', value: 'INDIAN48' },
        { label: 'MASINDIAN', value: 'MASINDIAN' },
        { label: 'CENTRAL', value: 'CENTRAL' },
    ]);
    // --------
    // แหล่งข้อมูลปลายทาง
    const [targetProcess, setTargetProcess] = useState([
        { label: 'กรุณาเลือก แหล่งข้อมูลปลายทาง', value: '' },
        { label: 'Oracle LandsMaps', value: 'Oracle LandsMaps' },
        { label: 'Postgres1', value: 'Postgres1' },
        { label: 'Postgres2', value: 'Postgres2' },
        { label: 'Postgres4', value: 'Postgres4' },
        { label: 'Postgres5', value: 'Postgres5' },
        { label: 'Postgres6', value: 'Postgres6' },
    ]);
    // Schema ปลายทาง
    const [targetSchema, setTargetSchema] = useState([
        { label: 'กรุณาเลือก Schema ปลายทาง', value: '' },
        { label: 'REG', value: 'REG' },
        { label: 'MAPDOL', value: 'MAPDOL' },
        { label: 'INDIAN', value: 'INDIAN' },
        { label: 'INDIAN47', value: 'INDIAN47' },
        { label: 'INDIAN48', value: 'INDIAN48' },
        { label: 'MAS', value: 'MAS' },
    ]);

    useEffect(() => {
        if (dialog.dialog === true) {
            setformObject(dialog.data);
        } else {
            setformObject({
                "transfer_data_ord": 0,
                "source_seq": 0, //แหล่งข้อมูล
                "transfer_data_group_seq": 0,
                "transfer_data_group_process_seq": 0,

                "source_process_seq": 0,
                "source_schema": "",//Schema ต้นทาง
                "source_table": "", //ตารางต้นทาง

                "target_process_seq": 0,
                "target_process": "",
                "target_schema": "", //Schema ปลายทาง
                "target_table": "", //ตารางปลายทาง

                "transfer_status": 0,
                "record_status": "N"
            })
        }
        if (dialog.dialogView == true) {
            onGetJobFileDataList(dialog.data)
        }
    }, [dialog.data])


    const dialogUpdate = () => {

        const renderFooter = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => (setDialog(false), setSubmitted(false))} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label={dialog.action} icon="pi pi-check" onClick={() => submitForm(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }

        return (
            <Dialog
                header={"แก้ไขตารางข้อมูลถ่ายโอน"}
                visible={dialog.dialog}
                style={{ width: '75vw' }}
                footer={renderFooter()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid" >
                    <div className="p-col-6">
                        <label>ลำดับภายในกลุ่มตาราง</label>
                        <InputNumber value={formObject.transfer_data_group_seq} onValueChange={(e) => setformObject({ ...formObject, transfer_data_group_seq: e.value })} mode="decimal" min={0} max={1000000} showButtons />
                    </div>
                    <div className="p-col-6"></div>
                    <div className="p-col-6">
                        <label>แหล่งข้อมูล<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.source_seq + ""}
                            options={msFormDataSource}
                            onChange={(e) => setformObject({ ...formObject, source_seq: e.value })}
                            placeholder="กรุณาเลือกกลุ่มตาราง"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.source_seq && validateInputText('source_name', 'แหล่งข้อมูล')}
                    </div>
                    <div className="p-col-6">
                        <label>กลุ่มตาราง<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.transfer_data_group_seq + ""}
                            options={msFormDataTransferGroup}
                            onChange={(e) => setformObject({ ...formObject, transfer_data_group_seq: e.value })}
                            placeholder="กรุณาเลือกกลุ่มตาราง"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.transfer_data_group_seq && validateInputText('transfer_data_group_seq', 'กลุ่มตาราง')}
                    </div>
                    <div className="p-col-12"><br /></div>

                    <div className="p-col-12" style={{ display: 'flex' }}>
                        <div style={{ width: '46%' }}>
                            <div className="p-grid card" style={{ marginLeft: 2, marginRight: '-20px' }}>
                                <label>ต้นทาง</label>
                                <div className="p-col-12">
                                    <label>แหล่งข้อมูลต้นทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.source_process_seq + ""}
                                        options={msFormDataSourceProcess}
                                        onChange={(e) => setformObject({ ...formObject, source_process_seq: e.value })}
                                        placeholder="กรุณาเลือกกลุ่มตาราง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.source_process_seq && validateInputText('source_process_seq', 'แหล่งข้อมูลต้นทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>Schema ต้นทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.source_schema + ""}
                                        options={sourceSchema}
                                        onChange={(e) => setformObject({ ...formObject, source_schema: e.value })}
                                        placeholder="กรุณาเลือก Schema ต้นทาง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.source_schema && validateInputText('source_schema', 'Schema ต้นทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>ตารางต้นทาง<span style={{ color: "red" }}>*</span></label>
                                    <InputText value={formObject.source_table} onChange={(e) => setformObject({ ...formObject, source_table: e.target.value })} />
                                    {submitted && !formObject.source_table && validateInputText('source_table', 'ตารางต้นทาง')}
                                </div>
                            </div>
                        </div>
                        {/* ----------------------- */}
                        <div className="p-col-12" style={{ display: 'flex', justifyContent: 'center', width: '5%', marginLeft: '15px', alignSelf: 'center' }}><Button icon="pi pi-arrow-right" className="p-button-rounded p-button-text" style={{ marginTop: '-20px' }} /></div>
                        {/* ----------------------- */}

                        <div style={{ width: '46%' }}>
                            <div className="p-grid card" style={{ marginLeft: '-5px', marginRight: '-14px' }} >
                                <label>ปลายทาง</label>
                                <div className="p-col-12">
                                    <label>แหล่งข้อมูลปลายทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.target_process_seq + ""}
                                        options={msFormDataTransferProcess}
                                        onChange={(e) => setformObject({ ...formObject, target_process_seq: e.value })}
                                        // placeholder="กรุณาเลือก Schema ต้นทาง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.target_process_seq && validateInputText('target_process_seq', 'แหล่งข้อมูลปลายทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>Schema ปลายทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.target_schema + ""}
                                        options={targetSchema}
                                        onChange={(e) => setformObject({ ...formObject, target_schema: e.value })}
                                        placeholder="กรุณาเลือก Schema ต้นทาง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.target_schema && validateInputText('target_schema', 'Schema ปลายทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>ตารางปลายทาง<span style={{ color: "red" }}>*</span></label>
                                    <InputText value={formObject.target_table} onChange={(e) => setformObject({ ...formObject, target_table: e.target.value })} />
                                    {submitted && !formObject.target_table && validateInputText('target_table', 'ตารางปลายทาง')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }

    const dialogAdd = () => {
        const renderFooter = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ยกเลิก" icon="pi pi-times" onClick={() => (setDialog(false), setSubmitted(false))} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                    <Button label="บันทึก" icon="pi pi-check" onClick={() => submitForm(formObject)} autoFocus className="p-button-rounded" />
                </div>
            );
        }
        return (
            <Dialog
                header={"เพิ่มตารางข้อมูลถ่ายโอน"}
                visible={dialog.dialogAdd}
                style={{ width: '75vw' }}
                footer={renderFooter()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="p-fluid"
                maximizable
            >
                <div className="p-grid">
                    <div className="p-col-6">
                        <label>ลำดับภายในกลุ่มตาราง</label>
                        <InputNumber value={formObject.transfer_data_group_seq} onValueChange={(e) => setformObject({ ...formObject, transfer_data_group_seq: e.value })} mode="decimal" min={0} max={1000000} showButtons />
                        {/* {submitted && !formObject.transfer_data_ord && validateInputText('transfer_data_ord', 'ลำดับภายในกลุ่มตาราง')} */}
                    </div>
                    <div className="p-col-6"></div>
                    <div className="p-col-6">
                        <label>แหล่งข้อมูล<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.source_seq + ""}
                            options={msFormDataSource}
                            onChange={(e) => setformObject({ ...formObject, source_seq: e.value })}
                            placeholder="กรุณาเลือกกลุ่มตาราง"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.source_seq && validateInputText('source_name', 'แหล่งข้อมูล')}
                    </div>
                    <div className="p-col-6">
                        <label>กลุ่มตาราง<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.transfer_data_group_seq + ""}
                            options={msFormDataTransferGroup}
                            onChange={(e) => setformObject({ ...formObject, transfer_data_group_seq: e.value })}
                            placeholder="กรุณาเลือกกลุ่มตาราง"
                            appendTo={document.body}
                        />
                        {submitted && !formObject.transfer_data_group_seq && validateInputText('transfer_data_group_seq', 'กลุ่มตาราง')}
                    </div>
                    <div className="p-col-12"><br /></div>

                    <div className="p-col-12" style={{ display: 'flex' }}>
                        <div style={{ width: '46%' }}>
                            <div className="p-grid card" style={{ marginLeft: 2, marginRight: '-20px' }}>
                                <label>ต้นทาง</label>
                                <div className="p-col-12">
                                    <label>แหล่งข้อมูลต้นทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.source_process_seq + ""}
                                        options={msFormDataSourceProcess}
                                        onChange={(e) => setformObject({ ...formObject, source_process_seq: e.value })}
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.source_process_seq && validateInputText('source_process_seq', 'แหล่งข้อมูลต้นทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>Schema ต้นทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.source_schema + ""}
                                        options={sourceSchema}
                                        onChange={(e) => setformObject({ ...formObject, source_schema: e.value })}
                                        placeholder="กรุณาเลือก Schema ต้นทาง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.source_schema && validateInputText('source_schema', 'Schema ต้นทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>ตารางต้นทาง<span style={{ color: "red" }}>*</span></label>
                                    <InputText value={formObject.source_table} onChange={(e) => setformObject({ ...formObject, source_table: e.target.value })} />
                                    {submitted && !formObject.source_table && validateInputText('source_table', 'ตารางต้นทาง')}
                                </div>
                            </div>
                        </div>
                        {/* ----------------------- */}
                        <div style={{ display: 'flex', justifyContent: 'center', width: '5%', marginLeft: '15px', alignSelf: 'center' }}><Button icon="pi pi-arrow-right" className="p-button-rounded p-button-text" style={{ marginTop: '-20px' }} /></div>
                        {/* ----------------------- */}

                        <div style={{ width: '46%' }}>
                            <div className="p-grid card" style={{ marginLeft: '-5px', marginRight: '-14px' }} >
                                <label>ปลายทาง</label>
                                <div className="p-col-12">
                                    <label>แหล่งข้อมูลปลายทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.target_process_seq + ""}
                                        options={msFormDataTransferProcess}
                                        onChange={(e) => setformObject({ ...formObject, target_process_seq: e.value })}
                                        // placeholder="กรุณาเลือก Schema ต้นทาง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.target_process_seq && validateInputText('target_process_seq', 'แหล่งข้อมูลปลายทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>Schema ปลายทาง<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.target_schema + ""}
                                        options={targetSchema}
                                        onChange={(e) => setformObject({ ...formObject, target_schema: e.value })}
                                        placeholder="กรุณาเลือก Schema ต้นทาง"
                                        appendTo={document.body}
                                    />
                                    {submitted && !formObject.target_schema && validateInputText('target_schema', 'Schema ปลายทาง')}
                                </div>
                                <div className="p-col-6">
                                    <label>ตารางปลายทาง<span style={{ color: "red" }}>*</span></label>
                                    <InputText value={formObject.target_table} onChange={(e) => setformObject({ ...formObject, target_table: e.target.value })} />
                                    {submitted && !formObject.target_table && validateInputText('target_table', 'ตารางปลายทาง')}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Dialog>
        )
    }

    const dialogViewJobFile = () => {

        const footer = () => {
            return (
                <div style={{ textAlign: 'right' }}>
                    <Button label="ปิดหน้าต่าง" icon="pi pi-times" onClick={() => setDialog(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                </div>
            );
        }
        if (dialog.data !== undefined) {
            return (
                <Dialog
                    header={"แสดง Job File [ " + dialog.data.source_name + " ]"}
                    visible={dialog.dialogView}
                    style={{ width: '50vw' }}
                    footer={footer()}
                    onHide={() => setDialog(false)}
                    blockScroll={true}
                    className="p-fluid"
                    maximizable={true}
                >
                    <div className="p-grid">
                        <div className="p-col-12">
                            <DataTable
                                value={jobFileDataList}>
                                <Column field="order_no" header="ลำดับ" style={{ width: '7%', textAlign: 'center' }}></Column>
                                <Column field="job_file" header="Job File" style={{ wordWrap: 'break-word' }}></Column>
                                <Column field="job_type" header="Job Type" style={{ width: '18%', wordWrap: 'break-word' }}></Column>
                                <Column field="schedule_mode" header="Schedule Mode" style={{ width: '18%', wordWrap: 'break-word' }}></Column>
                            </DataTable>
                        </div>
                    </div>
                </Dialog>
            )
        }
    }

    return (
        <>
            {dialogUpdate()}
            {dialogAdd()}
            {dialogViewJobFile()}
        </>
    )
}
