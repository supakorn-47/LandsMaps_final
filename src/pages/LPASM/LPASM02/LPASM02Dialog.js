import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { validateInputText } from "../../../utils/ValidateUtil";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

export default function LPASM02Dialog(props) {
  const [formObject, setformObject] = useState({});

  useEffect(() => {
    if (props.dialog.dialog) {
      if (props.dialog.action == "บันทึก") {
        setformObject({
          department_name_th: "",
          department_name_en: "",
          file: undefined,
          department_logo_path: undefined,
          record_status: "N",
          remark: "",
        });
      } else {
        setformObject(props.dialog.data);
      }
    }
  }, [props.dialog.dialog]);

  const onChangeFile = (e) => {
    if (
      e.target.files[0].type !== "image/jpeg" &&
      e.target.files[0].type !== "image/png"
    ) {
      props.showMessages(
        "error",
        `กรุณาตรวจสอบ`,
        "ไฟล์ภาพเฉพาะนามสกุล .png, .jpeg เท่านั้น"
      );
      document.getElementById("filelogo").value = "";
      return;
    } else {
      setformObject({ ...formObject, file: e.target.files[0] });
    }
  };

  const renderDialog = () => {
    const renderFooter = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => props.setDialog(false)}
            className="p-button-secondary p-button-rounded"
          />
          <Button
            label="บันทึก"
            // label={props.dialog.action}
            icon="pi pi-check"
            onClick={() => props.submitForm(formObject)}
            autoFocus
            className="p-button-rounded p-button-info"
          />
        </div>
      );
    };
    return (
      <Dialog
        header={
          props.dialog.action == "บันทึก" ? "เพิ่มหน่วยงาน" : "แก้ไขหน่วยงาน"
        }
        visible={props.dialog.dialog}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => props.setDialog(false)}
        blockScroll={true}
        className="modern-dialog p-fluid"
        maximizable
        focusOnShow={false}
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-12">
            <label>
              หน่วยงาน (ภาษาไทย)<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.department_name_th}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  department_name_th: e.target.value,
                })
              }
              className="p-inputtext"
            />
            {props.submitted &&
              !formObject.department_name_th &&
              validateInputText("department_name_th", "หน่วยงาน (ภาษาไทย)")}
          </div>
          <div className="p-col-12">
            <label>
              หน่วยงาน (ภาษาอังกฤษ)<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.department_name_en}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  department_name_en: e.target.value,
                })
              }
              className="p-inputtext"
            />
            {props.submitted &&
              !formObject.department_name_en &&
              validateInputText("department_name_en", "หน่วยงาน (ภาษาอังกฤษ)")}
          </div>
          <div className="p-col-12">
            <label>หมายเหตุ</label>
            <InputTextarea
              rows={4}
              value={formObject.remark}
              onChange={(e) =>
                setformObject({ ...formObject, remark: e.target.value })
              }
              style={{ resize: "none" }}
              className="p-inputtext"
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
              className="p-selectbutton"
              // style={{ width: "fit-content" }}
            />
            {props.submitted &&
              formObject.record_status === null &&
              validateInputText("record_status", "สถานะ")}
          </div>
          <div className="p-col-12">
            <label>ไฟล์รูปไอคอน {`${formObject.department_name_th}`}</label>
            <div style={{ display: "flex" }}>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => onChangeFile(e)}
                name="filelogo"
                id="filelogo"
                className="p-inputtext"
                style={{
                  border: "1px solid #E0E0E0",
                  width: "100%",
                  height: "44px",
                  padding: "7px",
                  borderRadius: "8px",
                }}
              />
            </div>
            <small style={{ color: "red" }}>
              *ไฟล์ภาพเฉพาะนามสกุล .png, .jpeg เท่านั้น
            </small>
            {formObject.department_logo_path !== undefined ? (
              <div
                className="p-col-12"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                <img
                  src={formObject.department_logo_path}
                  width="40%"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </Dialog>
    );
  };

  return <>{renderDialog()}</>;
}
