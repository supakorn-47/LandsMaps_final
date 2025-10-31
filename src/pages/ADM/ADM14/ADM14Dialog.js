import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

export const ADM14Dialog = (props) => {

    const renderFooter = () => {
        return (
            <div style={{ textAlign: 'right' }}>
                <Button label="ยกเลิก" icon="pi pi-times" onClick={() => props.setPopup(false)} className="p-button-secondary p-button-rounded" style={{ backgroundColor: 'rgb(167 172 175)', color: '#ffffff' }} />
                {/* <Button label="บันทึก" icon="pi pi-check" onClick={() => props.submitForm()} autoFocus className="p-button-rounded" /> */}
            </div>
        );
    }

    return (
        <div>
            <Dialog
                header="ตรวจสอบข้อมูลตอบกลับ"
                visible={props.popUp.open}
                style={{ width: '65vw' }}
                footer={renderFooter('displayBasic')}
                onHide={() => props.setPopup({ open: false })}
            >
                <>
                    <Panel header="เเจ้งข้อผิดพลาด" toggleable style={{ backgroundColor: 'red' }}>
                        <div className="p-fluid p-grid">
                            <div className="p-col-12 p-md-4">
                                <label>วันที่แจ้ง</label>
                                <InputText value={props.popUp.rowData.error_question_date} />
                            </div>
                            <div className="p-col-12 p-md-4">
                                <label>ชื่อ-สกุลผู้เเจ้ง</label>
                                <InputText value={props.popUp.rowData.register_name} />
                            </div>
                            <div className="p-col-12 p-md-4">
                                <label>หน่วยงาน/จังหวัด</label>
                                <InputText value={(props.popUp.rowData.agency_name === null ? "-" : props.popUp.rowData.agency_name) + "/" + (props.popUp.rowData.province_name === null ? "-" : props.popUp.rowData.province_name)} />
                            </div>
                            <div className="p-col-12 p-md-4">
                                <label>ประเภทข้อผิดพลาด </label>
                                <InputText value={props.popUp.rowData.error_type_name} />
                            </div>
                            <div className="p-col-12 p-md-4">
                                <label>หัวข้อข้อผิดพลาด</label>
                                <InputText value={props.popUp.rowData.error_question_subject} />
                            </div>
                            <div className="p-col-12 p-md-12">
                                <label>รายละเอียดข้อมูลผิดพลาด</label>
                                <InputTextarea value={props.popUp.rowData.error_question_desc} rows={8} />
                            </div>
                            <div className="p-col-12 p-md-12">
                                <label>ไฟล์แนบ</label><br />
                                {
                                    props.popUp.rowData.error_files.length > 0 ? props.popUp.rowData.error_files.map((value, index) => {
                                        return (
                                            <>
                                                <a href={`https://pipr.dol.go.th/apiWebPortal/Upload/${value.error_file_path.replace("/dolvolume/Files/", "")}`} target="_blank">
                                                    {`https://pipr.dol.go.th/apiWebPortal/Upload/${value.error_file_path.replace("/dolvolume/Files/", "")}`}
                                                </a><br />
                                            </>
                                        )
                                    }) : '-'
                                }
                            </div>
                        </div>
                    </Panel><br />
                    {
                        props.popUp.rowData.error_answers.map((value, index) => {
                            return (
                                <>
                                    <Panel header={`ตอบกลับ ลำดับที่ ${(index + 1)}`} toggleable>
                                        <div className="p-fluid p-grid">
                                            <div className="p-col-12 p-md-4">
                                                <label>วันที่ตอบกลับ</label>
                                                <InputText value={value.error_answer_date} />
                                            </div>
                                            <div className="p-col-12 p-md-4">
                                                <label>ชื่อ-สกุลผู้ตอบกลับ</label>
                                                <InputText value={value.answer_name} />
                                            </div>
                                            <div className="p-col-12 p-md-4">
                                                <label>หน่วยงาน/จังหวัด</label>
                                                <InputText value={(value.agency_name === null ? "-" : value.agency_name) + "/" + (value.province_name === null ? "-" : value.province_name)} />
                                            </div>
                                            <div className="p-col-12 p-md-12">
                                                <label>รายละเอียดการตอบกลับ</label>
                                                <InputTextarea value={value.error_answer_desc} rows={8} />
                                            </div>
                                            <div className="p-col-12 p-md-12">
                                                <label>ไฟล์แนบ</label><br />
                                                {
                                                    value.error_files.length > 0 ? value.error_files.map((list, index) => {
                                                        return (
                                                            <>
                                                                <a href={`https://pipr.dol.go.th/apiWebPortal/Upload/${list.error_file_path.replace("/dolvolume/Files/", "")}`} target="_blank">
                                                                    {`https://pipr.dol.go.th/apiWebPortal/Upload/${list.error_file_path.replace("/dolvolume/Files/", "")}`}
                                                                </a><br />
                                                            </>
                                                        )
                                                    }) : '-'
                                                }
                                            </div>
                                        </div>
                                    </Panel>
                                    <br />
                                </>
                            )
                        })
                    }
                </>
            </Dialog>
        </div>
    )
}
