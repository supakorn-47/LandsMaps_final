import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { validateInputText } from "../../../utils/ValidateUtil";
import { InputTextarea } from "primereact/inputtextarea";

export default function ADM05Dialog({
  dialog,
  setDialog,
  submitForm,
  submitted,
}) {
  const [formObject, setformObject] = useState({});

  useEffect(() => {
    if (dialog.data !== undefined) {
      setformObject(dialog.data);
    } else {
      setformObject({
        error_type_ord: 0,
        error_type_name: "",
        error_type_desc: "",
        record_status: "N",
      });
    }
  }, [dialog.formDialog]);

  const FormDialog = () => {
    const renderFooter = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => setDialog(false)}
            className="p-button-secondary p-button-rounded"
            style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
          />
          <Button
            label="บันทึก"
            icon="pi pi-check"
            onClick={() => submitForm(formObject)}
            autoFocus
            className="p-button-rounded"
          />
        </div>
      );
    };
    return (
      <Dialog
        header={
          dialog.data !== undefined
            ? "แก้ไขข้อมูลประเภทข้อผิดพลาด"
            : "เพิ่มข้อมูลประเภทข้อผิดพลาด"
        }
        visible={dialog.formDialog}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-12">
            <label>
              ข้อผิดพลาด<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.error_type_name}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  error_type_name: e.target.value,
                })
              }
            />
            {submitted &&
              !formObject.error_type_name &&
              validateInputText("error_type_name", "ข้อผิดพลาด")}
          </div>
          <div className="p-col-12">
            <label>รายละเอียดข้อมูลประเภทข้อผิดพลาด</label>
            <InputTextarea
              style={{ resize: "none" }}
              rows={4}
              value={formObject.error_type_desc}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  error_type_desc: e.target.value,
                })
              }
            />
          </div>
          <div className="p-col-6">
            <label>
              สถานะ<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.record_status}
              options={[
                { label: "ใช้งาน", value: "N" },
                { label: "ไม่ใช้งาน", value: "C" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, record_status: e.target.value })
              }
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.record_status === null &&
              validateInputText("record_status", "สถานะ")}
          </div>
        </div>
      </Dialog>
    );
  };

  return <>{FormDialog()}</>;
}
