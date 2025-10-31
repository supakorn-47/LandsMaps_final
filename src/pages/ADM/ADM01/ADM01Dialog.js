import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { validateInputText } from "../../../utils/ValidateUtil";
import { InputTextarea } from "primereact/inputtextarea";
import "./ADM01Dialog.css";

export default function ADM01Dialog({
  dialog,
  setDialog,
  submitForm,
  submitFormUserGroupLayer,
  submitFormUserGroupData,
  onADM01GetDataList,
  submitted,
}) {
  const [statusOption, setStatusOption] = useState([
    { label: "ใช้งาน", value: "N" },
    { label: "ไม่ใช้งาน", value: "C" },
  ]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [formObject, setformObject] = useState({});
  const [checkBox, setCheckBox] = useState([]);
  const [bug, setBug] = useState("");

  useEffect(() => {
    if (dialog.dialog) {
      if (dialog.action == "บันทึก") {
        setformObject({
          register_type_name: "",
          remark: "",
          register_type_ord: 0,
          record_status: "N",
          user_group_name: "",
          user_group_ord: 0,
          user_group_seq: 0,
        });
      } else {
        setformObject(dialog.data);
      }
    } else {
      setformObject({
        register_type_name: "",
        register_type_ord: 0,
        remark: "",
        record_status: "N",
        user_group_name: "",
        user_group_ord: 0,
        user_group_seq: 0,
      });
    }
  }, [dialog.data]);

  useEffect(() => {
    if (dialog.dialogDetail == true) {
      setBug(0);
      setCheckBox(dialog.data.usergroupdata_list);
    }
  }, [dialog.dialogDetail]);

  useEffect(() => {
    if (dialog.dialogLayer == true) {
      let arr_Temp = [];
      dialog.data.usergrouplayer_list.forEach((element) => {
        if (element.ischecked === "1") {
          arr_Temp.push(element);
        }
      });
      setSelectedTable(arr_Temp);
    }
  }, [dialog.dialogLayer]);

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label="บันทึก"
          // label={dialog.action}
          icon="pi pi-check"
          onClick={() => submitForm(formObject)}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const renderDialog = () => {
    return (
      <Dialog
        header={
          dialog.action == "บันทึก"
            ? "เพิ่มกลุ่มผู้ใช้งาน"
            : "แก้ไขกลุ่มผู้ใช้งาน"
        }
        visible={dialog.dialog}
        style={{ width: "35vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="modern-dialog"
        maximizable
      >
        <div className="dialog-content">
          <div className="form-group">
            <label className="form-label">
              ชื่อกลุ่มผู้ใช้งาน
              <span className="required-mark">*</span>
            </label>
            <InputText
              value={formObject.register_type_name}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  register_type_name: e.target.value,
                })
              }
              className="modern-input"
              placeholder="กรอกชื่อกลุ่มผู้ใช้งาน"
            />
            {submitted && !formObject.register_type_name && (
              <div className="error-message">
                {validateInputText("register_type_name", "ชื่อกลุ่มผู้ใช้งาน")}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">หมายเหตุ</label>
            <InputTextarea
              rows={4}
              value={formObject.remark}
              onChange={(e) =>
                setformObject({ ...formObject, remark: e.target.value })
              }
              className="modern-textarea"
              placeholder="กรอกหมายเหตุ (ถ้ามี)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              สถานะ
              <span className="required-mark">*</span>
            </label>
            <div className="radio-group">
              {statusOption.map((option) => (
                <div key={option.value} className="radio-option">
                  <RadioButton
                    inputId={option.value}
                    value={option.value}
                    checked={formObject.record_status === option.value}
                    onChange={(e) =>
                      setformObject({ ...formObject, record_status: e.value })
                    }
                    className="modern-radio"
                  />
                  <label htmlFor={option.value} className="radio-label">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {submitted && !formObject.record_status && (
              <div className="error-message">
                {validateInputText("record_status", "สถานะ")}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    );
  };

  return <>{renderDialog()}</>;
}
