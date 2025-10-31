import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { validateInputText } from '../../../utils/ValidateUtil';

export default function DMS05Dialog({ dialog, setDialog, submitForm, submitted, msDataSource,
    msDataTable, msDataScale, msDataScalePage, onScalePage, onGetTransferDataGroup }) {

    const [formObject, setformObject] = useState({});

    useEffect(() => {
        if (dialog.action === "UPDATE") {
            const found = optionMsSchema.find(element => element.label === dialog.data.source_schema);

            if (found.value !== undefined) {
                onGetTransferDataGroup(found.value)
            }

            let data = {
                ...dialog.data,
                "source_schema": found.value,
            }

            if (dialog.data.utmscale !== null) {
                onScalePage(dialog.data.utmscale)
            } else {
                data = {
                    ...dialog.data,
                    "source_schema": found.value,
                    utmscale: '-1'
                }
            }
            setformObject(data);

        } else {
            setformObject({
                "source_seq": -1,
                "transfer_data_seq": -1,
                "source_schema": -1,
                "land_no": "",
                "utmmap1": "",
                "utmmap2": 0,
                "utmmap3": "",
                "utmmap4": "",
                "utmscale": "-1",
            })
        }
    }, [dialog.data]);

    // useEffect(() => {
    //     if (dialog.action === "UPDATE") {
    //         const resultTb = msDataTable.find(element => element.label === dialog.data.source_table);
    // setformObject({
    //     ...data,
    //     source_table: resultTb.value
    // });
    //         console.log('resultTb', resultTb)
    //     }
    // }, [msDataTable])


    const optionMsSchema = [
        { label: 'ทั้งหมด', value: "-1" },
        { label: 'REG', value: "REG" },
        { label: 'MAPDOL', value: "MAPDOL" },
        { label: 'MAS', value: "MAS" },
        { label: 'SVO', value: "SVO" },
        { label: 'APS', value: "APS" }
    ];

    const optionUMT2 = [
        { label: "-กรุณาเลือก-", value: 0 },
        { label: "I", value: 1 },
        { label: "II", value: 2 },
        { label: "III", value: 3 },
        { label: "IV", value: 4 },
    ];

    const dialogData = () => {

        const footer = () => {
            return (
                <div className="dialog-footer">
                    <Button 
                        label="ยกเลิก" 
                        icon="pi pi-times" 
                        onClick={() => setDialog(false)} 
                        className="modern-cancel-button" 
                    />
                    <Button 
                        label={dialog.action === 'SAVE' ? "บันทึก" : "แก้ไข"} 
                        icon="pi pi-check" 
                        onClick={() => submitForm(formObject)} 
                        autoFocus 
                        className="modern-save-button" 
                    />
                </div>
            );
        }

        const onChangeTransferDataGroup = (e) => {
            onGetTransferDataGroup(e.originalEvent.target.ariaLabel)
            setformObject({ ...formObject, source_schema: e.value, transfer_data_seq: "" })
        }

        return (
            <Dialog
                header={(dialog.action === 'SAVE' ? "เพิ่ม" : "แก้ไข") + ("เงื่อนไขการดึงข้อมูลแปลงที่ดิน")}
                visible={dialog.dialog}
                style={{ width: '55vw' }}
                footer={footer()}
                onHide={() => setDialog(false)}
                blockScroll={true}
                className="modern-dialog"
                maximizable
            >
                <div className="modern-form-container">
                <div className="p-grid" style={{ marginBottom: 30 }}>
                    <div className="p-col-12">
                        <label>แหล่งข้อมูล<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.source_seq + ""}
                            options={msDataSource}
                            onChange={(e) => setformObject({ ...formObject, source_seq: e.value })}
                            appendTo={document.body}
                                className="modern-dropdown"
                        />
                        {submitted && formObject.source_seq === 0 && validateInputText('source_seq', 'แหล่งข้อมูล')}
                    </div>
                    <div className="p-col-6">
                        <label>Schema<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.source_schema + ""}
                            options={optionMsSchema}
                            onChange={(e) => onChangeTransferDataGroup(e)}
                            appendTo={document.body}
                                className="modern-dropdown"
                        />
                        {submitted && formObject.source_schema === "กรุณาเลือก Schema" && validateInputText('source_schema', 'Schema')}
                    </div>
                    <div className="p-col-6">
                        <label>Table<span style={{ color: "red" }}>*</span></label>
                        <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={formObject.transfer_data_seq + ""}
                            options={msDataTable}
                            onChange={(e) => setformObject({ ...formObject, transfer_data_seq: e.value })}
                            placeholder="Table"
                            appendTo={document.body}
                            filter
                                className="modern-dropdown"
                        />
                        {submitted && formObject.transfer_data_seq === 0 && validateInputText('transfer_data_seq ', 'Table')}
                    </div>
                    <div className="p-col-4">
                        <label htmlFor="state">มาตราส่วน</label>
                        <Dropdown
                            value={formObject.utmscale}
                            options={msDataScale}
                            optionLabel="label"
                            optionValue="value"
                            appendTo={document.body}
                            onChange={(e) => (setformObject({ ...formObject, utmscale: e.value }), onScalePage(e.value))}
                                className="modern-dropdown"
                        />
                    </div>

                    <div className="p-col-2 ">
                        <label>UTMMAP1</label>
                        <InputText
                                value={formObject.utmmap1} 
                                keyfilter="int" 
                                maxLength={4}
                                className="modern-input"
                                onChange={(e) => setformObject({ ...formObject, utmmap1: e.target.value })} 
                            />
                    </div>
                    <div className="p-col-2">
                        <label htmlFor="state">UTMMAP2</label>
                        <Dropdown
                            value={formObject.utmmap2}
                            options={optionUMT2}
                            optionLabel="label"
                            optionValue="value"
                            appendTo={document.body}
                            onChange={(e) => setformObject({ ...formObject, utmmap2: e.value })}
                                className="modern-dropdown"
                        />
                    </div>
                    <div className="p-col-2">
                        <label>UTMMAP3</label>
                        <InputText
                            value={formObject.utmmap3}
                            keyfilter="int"
                            maxLength={4}
                                className="modern-input"
                                onChange={(e) => setformObject({ ...formObject, utmmap3: e.target.value })} 
                            />
                    </div>
                    <div className="p-col-2">
                        <label>UTMMAP4</label>
                        <Dropdown
                            value={formObject.utmmap4}
                            options={msDataScalePage}
                            disabled={msDataScalePage.length === 0}
                            optionValue="value"
                            optionLabel="label"
                            appendTo={document.body}
                                onChange={(e) => setformObject({ ...formObject, utmmap4: e.value })}
                                className="modern-dropdown"
                            />
                    </div>

                    <div className="p-col-12">
                        <label>เลขที่ดิน</label>
                            <InputText 
                                value={formObject.land_no} 
                                className="modern-input"
                                onChange={(e) => setformObject({ ...formObject, land_no: e.target.value })} 
                            />
                        </div>                
                    </div>
                </div>

            </Dialog>
        )
    }

    return (
        <>
            {/* {dialogUpdate()} */}
            {dialogData()}
        </>
    )
}
