import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { validateInputText } from "../../../utils/ValidateUtil";

const defaultForm = {
  transfer_data_ord: 0,
  source_seq: -1, //แหล่งข้อมูล
  transfer_data_group_seq: -1, //กลุ่มตาราง
  transfer_data_group_process_seq: -1,

  source_process_seq: -1, //แหล่งข้อมูลต้นทาง
  source_schema: "", //Schema ต้นทาง
  source_table: "", //ตารางต้นทาง

  target_process_seq: -1, //แหล่งข้อมูลปลายทาง
  target_process: "",
  target_schema: "", //Schema ปลายทาง
  target_table: "", //ตารางปลายทาง

  transfer_status: 0,
  record_status: "N",
};
export default function DMS02Dialog(props) {
  const [formObject, setformObject] = useState(defaultForm);

  // Schema ต้นทาง
  const sourceSchema = [
    { label: "กรุณาเลือก Schema ต้นทาง", value: "" },
    { label: "REG", value: "REG" },
    { label: "MAPDOL", value: "MAPDOL" },
    { label: "MAS", value: "MAS" },
    { label: "SVO", value: "SVO" },
    { label: "APS", value: "APS" },
  ];

  // Schema ปลายทาง
  const targetSchema = [
    { label: "กรุณาเลือก Schema ปลายทาง", value: "" },
    { label: "REG", value: "REG" },
    { label: "MAPDOL", value: "MAPDOL" },
    { label: "MAS", value: "MAS" },
    { label: "SVO", value: "SVO" },
    { label: "APS", value: "APS" },
  ];

  useEffect(() => {
    if (props.dialog.data !== undefined) {
      setformObject(props.dialog.data);
    } else {
      setformObject(defaultForm);
    }
    if (props.dialog.dialogView == true) {
      props.onGetJobFileDataList(props.dialog.data);
    }
    return () => {
      setformObject(defaultForm);
    };
  }, [props.dialog]);

  const renderDialogForm = () => {
    const renderFooter = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => (props.setDialog(false), props.setSubmitted(false))}
            className="p-button-secondary p-button-rounded"
          />
          <Button
            label="บันทึก"
            // label={props.dialog.action}
            icon="pi pi-check"
            onClick={() => props.submitForm(formObject)}
            autoFocus
            className="p-button-info p-button-rounded"
          />
        </div>
      );
    };

    return (
      <Dialog
        header={`${
          props.dialog.action === "บันทึก" ? "เพิ่ม" : props.dialog.action
        }ตารางข้อมูลถ่ายโอน`}
        visible={props.dialog.dialog}
        style={{ width: "75vw" }}
        footer={renderFooter()}
        onHide={() => props.setDialog(false)}
        blockScroll={true}
        className="modern-dialog"
        maximizable
      >
        <div className="p-grid">
          {/* <div className="p-col-3">
                        <label>ลำดับภายในกลุ่มตาราง</label>
                        <InputNumber
                            value={formObject.transfer_data_ord}
                            onValueChange={(e) => setformObject({ ...formObject, transfer_data_ord: e.value })}
                            mode="decimal"
                            min={0}
                            max={1000000}
                            showButtons
                        />
                    </div> */}
          {/* <div className="p-col-6"></div> */}
          <div className="p-col-6">
            <label>
              แหล่งข้อมูล<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.source_seq + ""}
              options={props.msDataSource}
              onChange={(e) =>
                setformObject({ ...formObject, source_seq: e.value })
              }
              placeholder="กรุณาเลือกกลุ่มตาราง"
              appendTo={document.body}
            />
            {props.submitted &&
              formObject.source_seq + "" === "-1" &&
              validateInputText("source_name", "แหล่งข้อมูล")}
          </div>
          <div className="p-col-6">
            <label>
              กลุ่มตาราง<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.transfer_data_group_seq + ""}
              options={props.msDataTransferGroup}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  transfer_data_group_seq: e.value,
                })
              }
              placeholder="กรุณาเลือกกลุ่มตาราง"
              appendTo={document.body}
              filter
            />
            {props.submitted &&
              formObject.transfer_data_group_seq + "" === "-1" &&
              validateInputText("transfer_data_group_seq", "กลุ่มตาราง")}
          </div>
          <div className="p-col-12">
            <br />
          </div>

          <div className="p-col-12" style={{ display: "flex" }}>
            <div style={{ width: "46%" }}>
              <div
                className="p-grid card"
                style={{ marginLeft: 2, marginRight: "-20px" }}
              >
                <label>ต้นทาง</label>
                <div className="p-col-12">
                  <label>
                    แหล่งข้อมูลต้นทาง<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.source_process_seq + ""}
                    options={props.msDataSourceProcess}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        source_process_seq: e.value,
                      })
                    }
                    placeholder="กรุณาเลือกกลุ่มตาราง"
                    appendTo={document.body}
                  />
                  {props.submitted &&
                    formObject.source_process_seq + "" === "-1" &&
                    validateInputText(
                      "source_process_seq",
                      "แหล่งข้อมูลต้นทาง"
                    )}
                </div>
                <div className="p-col-6">
                  <label>
                    Schema ต้นทาง<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.source_schema + ""}
                    options={sourceSchema}
                    onChange={(e) =>
                      setformObject({ ...formObject, source_schema: e.value })
                    }
                    placeholder="กรุณาเลือก Schema ต้นทาง"
                    appendTo={document.body}
                  />
                  {props.submitted &&
                    formObject.source_schema + "" === "-1" &&
                    validateInputText("source_schema", "Schema ต้นทาง")}
                </div>
                <div className="p-col-6">
                  <label>
                    ตารางต้นทาง<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputText
                    value={formObject.source_table}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        source_table: e.target.value,
                      })
                    }
                  />
                  {props.submitted &&
                    !formObject.source_table &&
                    validateInputText("source_table", "ตารางต้นทาง")}
                </div>
              </div>
            </div>
            {/* ----------------------- */}
            <div
              className="p-col-12"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "5%",
                marginLeft: "15px",
                alignSelf: "center",
              }}
            >
              <Button
                icon="pi pi-arrow-right"
                className="p-button-text"
                style={{ marginTop: "-20px" }}
              />
            </div>
            {/* ----------------------- */}

            <div style={{ width: "46%" }}>
              <div
                className="p-grid card"
                style={{ marginLeft: "-5px", marginRight: "-14px" }}
              >
                <label>ปลายทาง</label>
                <div className="p-col-12">
                  <label>
                    แหล่งข้อมูลปลายทาง<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.target_process_seq + ""}
                    options={props.msDataTransferProcess}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        target_process_seq: e.value,
                      })
                    }
                    placeholder="กรุณาเลือก Schema ต้นทาง"
                    appendTo={document.body}
                  />
                  {props.submitted &&
                    formObject.target_process_seq + "" === "-1" &&
                    validateInputText(
                      "target_process_seq",
                      "แหล่งข้อมูลปลายทาง"
                    )}
                </div>
                <div className="p-col-6">
                  <label>
                    Schema ปลายทาง<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.target_schema + ""}
                    options={targetSchema}
                    onChange={(e) =>
                      setformObject({ ...formObject, target_schema: e.value })
                    }
                    placeholder="กรุณาเลือก Schema ต้นทาง"
                    appendTo={document.body}
                  />
                  {props.submitted &&
                    formObject.target_schema + "" === "-1" &&
                    validateInputText("target_schema", "Schema ปลายทาง")}
                </div>
                <div className="p-col-6">
                  <label>
                    ตารางปลายทาง<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputText
                    value={formObject.target_table}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        target_table: e.target.value,
                      })
                    }
                  />
                  {props.submitted &&
                    !formObject.target_table &&
                    validateInputText("target_table", "ตารางปลายทาง")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

  const renderDialogViewJobFile = () => {
    const footer = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ปิดหน้าต่าง"
            icon="pi pi-times"
            onClick={() => props.setDialog(false)}
            className="p-button-secondary p-button-rounded"
          />
        </div>
      );
    };
    if (props.dialog.data !== undefined) {
      return (
        <Dialog
          header={"แสดง Job File [ " + props.dialog.data.source_name + " ]"}
          visible={props.dialog.dialogView}
          style={{ width: "50vw" }}
          footer={footer()}
          onHide={() => props.setDialog(false)}
          blockScroll={true}
          className="modern-dialog"
          maximizable={true}
        >
          <div className="p-grid">
            <div className="p-col-12">
              <DataTable
                value={props.jobFileDataList}
                className="modern-datatable"
              >
                <Column
                  field="order_no"
                  header="ลำดับ"
                  className="order-column"
                  style={{ width: "7%" }}
                ></Column>
                <Column
                  field="job_file"
                  header="Job File"
                  className="name-column"
                ></Column>
                <Column
                  field="job_type"
                  header="Job Type"
                  className="type-column"
                  style={{ width: "18%" }}
                ></Column>
                <Column
                  field="schedule_mode"
                  header="Schedule Mode"
                  className="type-column"
                  style={{ width: "18%" }}
                ></Column>
              </DataTable>
            </div>
          </div>
        </Dialog>
      );
    }
  };

  return (
    <>
      {renderDialogForm()}
      {renderDialogViewJobFile()}
    </>
  );
}
