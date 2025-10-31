import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { validateInputText } from "../../../utils/ValidateUtil";
import { Password } from "primereact/password";

export default function DMS01Dialog({
  setConnectionDB,
  connectionDB,
  dialog,
  setDialog,
  submitForm,
  optionSource,
  optionDataBase,
  submitted,
  setSubmitted,
  onCheckConnectionDB,
}) {
  const [formObject, setformObject] = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (dialog.data !== undefined) {
      setformObject(dialog.data);
    } else {
      setformObject({
        source_ord: 0,
        source_seq: 0,
        source_name: "",
        source_process: -1,
        source_host: "",
        database_type: "",
        source_service_name: "",
        user_name: "",
        password: "",
        source_port: null,
        record_status: "N",
      });
    }
    return () => {
      setConnectionDB(false);
    };
  }, [dialog.data]);

  const renderFooter = () => {
    return (
      <div
        style={{
          gap: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          label="ตรวจสอบการเชื่อมต่อ"
          icon="pi pi-refresh"
          onClick={() => onCheckConnectionDB(formObject)}
          className={`p-button-rounded ${
            connectionDB ? "p-button-success" : "p-button-secondary"
          }`}
          style={{
            backgroundColor: !connectionDB && "rgb(167 172 175)",
            color: !connectionDB && "#ffffff",
          }}
        />
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => (setDialog(false), setSubmitted(false))}
            className="p-button-secondary p-button-rounded"
          />
          <Button
            label={`${dialog.action === "SAVE" ? "บันทึก" : "บันทึก"}`}
            icon="pi pi-check"
            onClick={() => submitForm(formObject)}
            autoFocus
            className="p-button-info p-button-rounded"
          />
        </div>
      </div>
    );
  };

  console.log("showPass:", showPass);

  return (
    <>
      <Dialog
        header={`${
          dialog.action === "SAVE"
            ? "เพิ่มแหล่งข้อมูลถ่ายโอน"
            : `แก้ไขแหล่งข้อมูลถ่ายโอน [ ${formObject.source_name} ]`
        }`}
        visible={dialog.dialog}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="modern-dialog"
        maximizable
      >
        <div className="p-grid">
          {/* <div className="p-col-6">
                        <label>ลำดับ</label>
                        <InputNumber
                            value={formObject.source_ord}
                            onValueChange={(e) => setformObject({ ...formObject, source_ord: e.value })}
                            mode="decimal"
                            min={1}
                            max={1000000}
                            showButtons
                        />
                    </div> */}
          {/* <div className="p-col-6"></div> */}
          <div className="p-col-6">
            <label>
              แหล่งข้อมูล<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.source_name}
              onChange={(e) =>
                setformObject({ ...formObject, source_name: e.target.value })
              }
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.source_name &&
              validateInputText("source_name", "แหล่งข้อมูล")}
          </div>
          <div className="p-col-6">
            <label>
              Source Process<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.source_process + ""}
              options={optionSource}
              onChange={(e) =>
                setformObject({ ...formObject, source_process: e.value })
              }
              appendTo={document.body}
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.source_process &&
              validateInputText("source_process", "Source Process")}
          </div>
          <div className="p-col-9">
            <label>
              Host<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.source_host}
              onChange={(e) =>
                setformObject({ ...formObject, source_host: e.target.value })
              }
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.source_host &&
              validateInputText("source_host", "Host")}
          </div>
          <div className="p-col-3">
            <label>
              Port<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.source_port}
              onChange={(e) =>
                setformObject({ ...formObject, source_port: e.target.value })
              }
              keyfilter="int"
              maxLength="20"
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.source_port &&
              validateInputText("source_port", "Port")}
          </div>
          <div className="p-col-6">
            <label>
              Database Type<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.database_type}
              options={optionDataBase}
              onChange={(e) =>
                setformObject({ ...formObject, database_type: e.value })
              }
              placeholder="Database Type"
              appendTo={document.body}
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.database_type &&
              validateInputText("database_type", "Database Type")}
          </div>
          <div className="p-col-6">
            <label>
              Service Name<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.source_service_name}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  source_service_name: e.target.value,
                })
              }
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.source_service_name &&
              validateInputText("source_service_name", "Service Name")}
          </div>
          <div className="p-col-6">
            <label>
              User ID<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.user_name}
              onChange={(e) =>
                setformObject({ ...formObject, user_name: e.target.value })
              }
              disabled={connectionDB}
            />
            {submitted &&
              !formObject.user_name &&
              validateInputText("user_name", "User ID")}
          </div>
          <div className="p-col-6">
            <label>
              Password<span style={{ color: "red" }}>*{showPass}</span>
            </label>
            {/* <InputText value={formObject.password} type="password" onChange={(e) => setformObject({ ...formObject, password: e.target.value })} /> */}
            {/* <div className="p-inputgroup"> */}
            <div className="p-inputgroup">
              {showPass ? (
                <>
                  <Password
                    feedback={false}
                    value={formObject.password}
                    onChange={(e) =>
                      setformObject({ ...formObject, password: e.target.value })
                    }
                    maxlength="20"
                    disabled={connectionDB}
                  />
                  <span
                    className="p-inputgroup-addon"
                    onClick={() => setShowPass(!showPass)}
                  >
                    <i className="pi pi-eye"></i>
                  </span>
                </>
              ) : (
                <>
                  <InputText
                    value={formObject.password}
                    onChange={(e) =>
                      setformObject({ ...formObject, password: e.target.value })
                    }
                    maxlength="20"
                    disabled={connectionDB}
                  />
                  <span
                    className="p-inputgroup-addon"
                    onClick={() => setShowPass(!showPass)}
                  >
                    <i className="pi pi-eye-slash"></i>
                  </span>
                </>
              )}
            </div>

            {submitted &&
              !formObject.password &&
              validateInputText("password", "Password")}
          </div>
        </div>
      </Dialog>
    </>
  );
}
