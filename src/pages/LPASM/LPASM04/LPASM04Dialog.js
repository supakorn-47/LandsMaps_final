import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { validateInputText } from "../../../utils/ValidateUtil";
import { InputTextarea } from "primereact/inputtextarea";

export default function LPASM04Dialog({
  dialog,
  setDialog,
  submitForm,
  submitted,
  showMessages,
  setLoading,
}) {
  const [formObject, setformObject] = useState({});
  const [selectedTable, setSelectedTable] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [statusOption, setStatusOption] = useState([
    { label: "ใช้งาน", value: "N" },
    { label: "ไม่ใช้งาน", value: "C" },
  ]);

  useEffect(() => {
    if (dialog.dialog) {
      if (dialog.action == "บันทึก") {
        setformObject({
          status_code: "",
          status_name_th: "",
          status_name_en: "",
          record_status: "N",
        });
      } else {
        setformObject(dialog.data);
      }
    }
  }, [dialog.dialog]);

  const renderDialog = () => {
    const renderFooter = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => setDialog(false)}
            className="p-button-secondary p-button-rounded"
            // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
          />
          <Button
            // label={dialog.action}
            label="บันทึก"
            icon="pi pi-check"
            onClick={() => submitForm(formObject)}
            autoFocus
            className="p-button-rounded p-button-info"
          />
        </div>
      );
    };
    return (
      <Dialog
        header={
          dialog.action == "บันทึก" ? "เพิ่ม Status Code" : "แก้ไข Status Code"
        }
        visible={dialog.dialog}
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
              รหัส Status Code<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.status_code}
              maxLength="3"
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  status_code: e.target.value,
                })
              }
              keyfilter="money"
            />
            {submitted &&
              !formObject.status_code &&
              validateInputText("status_code", "รหัส Status Code")}
          </div>
          <div className="p-col-12">
            <label>
              ชื่อสถานะข้อมูลตอบกลับ (ภาษาไทย)
              <span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.status_name_th}
              onChange={(e) =>
                setformObject({ ...formObject, status_name_th: e.target.value })
              }
            />
            {submitted &&
              !formObject.status_name_th &&
              validateInputText(
                "status_name_th",
                "ชื่อสถานะข้อมูลตอบกลับ (ภาษาไทย)"
              )}
          </div>
          <div className="p-col-12">
            <label>
              ชื่อสถานะข้อมูลตอบกลับ (ภาษาอังกฤษ)
              <span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.status_name_en}
              onChange={(e) =>
                setformObject({ ...formObject, status_name_en: e.target.value })
              }
            />
            {submitted &&
              !formObject.status_name_en &&
              validateInputText(
                "status_name_en",
                "ชื่อสถานะข้อมูลตอบกลับ (ภาษาอังกฤษ)"
              )}
          </div>
          <div className="p-col-12">
            <label>หมายเหตุ</label>
            <InputTextarea
              style={{ resize: "none" }}
              rows={4}
              value={formObject.remark}
              onChange={(e) =>
                setformObject({ ...formObject, remark: e.target.value })
              }
              maxLength={1400}
            />
          </div>
          <div className="p-col-6">
            <label>
              สถานะ<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.record_status}
              options={statusOption}
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

  return <>{renderDialog()}</>;
}
