import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { validateInputText } from "../../../utils/ValidateUtil";
import { InputSwitch } from "primereact/inputswitch";
import { Calendars } from "../../../components/Calendar/Calendar";
import { InputTextarea } from "primereact/inputtextarea";

let formDefault = {
  gdg_document_seq: 0,
  gdg_version: "1",
  gdg_public_flag: "0",
  gdg_version_date: new Date(),
  gdg_document_name: "",
  gdg_organizer: "",
  gdg_approver: "",
  gdg_document_desc: "",
  record_status: "N",
};
const DGR02Dialog = (props) => {
  const [formObject, setformObject] = useState({});

  useEffect(() => {
    if (props.dialog.dialog) {
      if (props.dialog.action == "ADD") {
        setformObject(formDefault);
      } else {
        setformObject(props.dialog.data);
      }
    }
  }, [props.dialog.dialog]);

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => props.setDialog(false)}
          className="p-button-secondary p-button-rounded"
          //   style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => props.submitForm(formObject)}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const onChangeFile = (e) => {
    if (e.target.files[0].type !== "application/pdf") {
      props.showMessages(
        "error",
        `กรุณาตรวจสอบ`,
        "ไฟล์ภาพเฉพาะนามสกุล .pdf เท่านั้น"
      );
      document.getElementById("filelogo").value = "";
      return;
    } else {
      setformObject({ ...formObject, file: e.target.files[0] });
    }
  };

  return (
    <>
      <Dialog
        header={props.dialog.action == "ADD" ? "เพิ่มเอกสาร" : "แก้ไขเอกสาร"}
        visible={props.dialog.dialog}
        style={{ width: "40vw" }}
        footer={renderFooter()}
        onHide={() => props.setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-6">
            <label>
              เวอร์ชันเอกสาร<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.gdg_version}
              onChange={(e) =>
                setformObject({ ...formObject, gdg_version: e.target.value })
              }
            />
            {props.submitted &&
              !formObject.gdg_version &&
              validateInputText("gdg_version", "เวอร์ชันเอกสาร")}
          </div>
          <div className="p-col-6">
            <label>
              วันที่ปรับปรุงเอกสาร<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={new Date(formObject.gdg_version_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  gdg_version_date: e.target.value,
                })
              }
            />
            {props.submitted &&
              !formObject.gdg_version_date &&
              validateInputText("gdg_version_date", "วันที่ปรับปรุงเอกสาร")}
          </div>
          <div className="p-col-12">
            <label>
              แผยแพร่ / ไม่แผยแพร่<span style={{ color: "red" }}>*</span>
            </label>
            <InputSwitch
              checked={formObject.gdg_public_flag === "1" ? true : false}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  gdg_public_flag: e.value === true ? "1" : "0",
                })
              }
              tooltip="คลิกเพื่อ เปิด/ปิด เผยแพร่"
              tooltipOptions={{ position: "top" }}
              style={{ marginTop: "10px" }}
            />
          </div>
          <div className="p-col-12">
            <label>
              ชื่อเอกสาร<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.gdg_document_name}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  gdg_document_name: e.target.value,
                })
              }
            />
            {props.submitted &&
              !formObject.gdg_document_name &&
              validateInputText("gdg_document_name", "ชื่อเอกสาร")}
          </div>
          <div className="p-col-12">
            <label>
              ผู้จัดทำ<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.gdg_organizer}
              onChange={(e) =>
                setformObject({ ...formObject, gdg_organizer: e.target.value })
              }
            />
            {props.submitted &&
              !formObject.gdg_organizer &&
              validateInputText("gdg_organizer", "ผู้จัดทำ")}
          </div>
          <div className="p-col-12">
            <label>
              ผู้อนุมัติ<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.gdg_approver}
              onChange={(e) =>
                setformObject({ ...formObject, gdg_approver: e.target.value })
              }
            />
            {props.submitted &&
              !formObject.gdg_approver &&
              validateInputText("gdg_approver", "ผู้อนุมัติ")}
          </div>
          <div className="p-col-12">
            <label>รายละเอียดการแก้ไขเอกสาร</label>
            <InputTextarea
              rows={4}
              value={formObject.gdg_document_desc}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  gdg_document_desc: e.target.value,
                })
              }
              style={{ resize: "none" }}
            />
          </div>
          <div className="p-col-12">
            <label>แนบไฟล์</label>
            <div style={{ display: "flex" }}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => onChangeFile(e)}
                name="filelogo"
                id="filelogo"
                style={{
                  border: "1px solid #E0E0E0",
                  width: "100%",
                  height: "33px",
                  padding: "7px",
                }}
              />
            </div>
            <small style={{ color: "red" }}>
              *ไฟล์ภาพเฉพาะนามสกุล .pdf เท่านั้น
            </small>
            {formObject.department_logo_path !== undefined ? (
              <div className="p-col-12" style={{ textAlign: "center" }}>
                <img src={formObject.department_logo_path} width="40%" />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DGR02Dialog;
