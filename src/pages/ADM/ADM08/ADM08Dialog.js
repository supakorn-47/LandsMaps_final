import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { SelectButton } from "primereact/selectbutton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Slider } from "primereact/slider";
import { validateInputText } from "../../../utils/ValidateUtil";
import { InputTextarea } from "primereact/inputtextarea";
import Iframe from "react-iframe";

export default function ADM08Dialog(props) {
  const [formObject, setformObject] = useState({});
  const [viewFileDialog, setViewFileDialog] = useState(false);
  const [size, setSize] = useState(50);

  useEffect(() => {
    if (props.dialog.openApprove === true) {
      setformObject({ ...props.dialog.data });
    }

    return () => {
      setformObject({});
    };
  }, [props.dialog.data, props.dialog]);

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => props.setDialog(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
        {/* <Button label="ตกลง" icon="pi pi-check" onClick={() => props.submitForm(formObject)} autoFocus className="p-button-rounded" /> */}
      </div>
    );
  };

  const dialogBodyApprove = () => {
    const footer = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => props.setDialog(false)}
            className="p-button-secondary p-button-rounded"
            // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
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
    return (
      <Dialog
        header={"อนุมัติผู้ใช้งาน"}
        visible={props.dialog.openApprove}
        // visible={true}
        style={{ width: "50vw" }}
        footer={footer()}
        onHide={() => props.setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid">
          <div className="p-col-12">
            <SelectButton
              value={formObject.approve_flag}
              options={[
                { label: "อนุมัติ", value: 1 },
                { label: "ไม่อนุมัติ", value: 0 },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, approve_flag: e.value })
              }
            />
            {props.submitted &&
              formObject.approve_flag === null &&
              validateInputText("approve_flag", "เลือก")}
          </div>
          <div className="p-col-12">
            <label>
              หมายเหตุ{" "}
              {formObject.approve_flag !== 1 ? (
                <span style={{ color: "red" }}>*</span>
              ) : (
                ""
              )}
            </label>
            <InputTextarea
              style={{ resize: "none" }}
              rows={8}
              value={formObject.remark}
              onChange={(e) =>
                setformObject({ ...formObject, remark: e.target.value })
              }
              maxLength="500"
            />
            {props.submitted &&
              formObject.remark === " " &&
              validateInputText("remark", "หมายเหตุ")}
          </div>
        </div>
      </Dialog>
    );
  };

  // รายการแนบไฟล์
  const dialogListUploadfile = () => {
    if (props.dialog.data === undefined) return;

    const viewDialog = () => {
      if (viewFileDialog.data === undefined) return;
      const footer = () => {
        return (
          <div className="dialog-footer-action-right">
            <Button
              label="ปิดหน้าต่าง"
              icon="pi pi-times"
              onClick={() => setViewFileDialog(false)}
              className="p-button-secondary p-button-rounded"
              style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
            />
          </div>
        );
      };

      return (
        <>
          <Dialog
            header={`ไฟล์แนบ`}
            visible={viewFileDialog.open}
            style={{ width: "70vw" }}
            footer={footer()}
            onHide={() => setViewFileDialog(false)}
            blockScroll={true}
            className="p-fluid"
            maximizable={true}
          >
            <>
              {viewFileDialog.data.register_file_path
                .toLowerCase()
                .indexOf(".pdf") !== -1 ? (
                <Iframe
                  url={viewFileDialog.data.register_file_path}
                  width="100%"
                  height={window.innerHeight - 110}
                  display="initial"
                  position="relative"
                />
              ) : (
                ""
              )}
              {viewFileDialog.data.register_file_path
                .toLowerCase()
                .indexOf(".jpg") !== -1 ||
              viewFileDialog.data.register_file_path
                .toLowerCase()
                .indexOf(".jpeg") !== -1 ||
              viewFileDialog.data.register_file_path
                .toLowerCase()
                .indexOf(".png") !== -1 ? (
                <div className="p-grid">
                  .
                  <div className="p-col-3">
                    <div className="slider-demo">
                      <label>ขนาดรูปภาพ {size} %</label>
                      <Slider
                        value={size}
                        onChange={(e) => setSize(e.value)}
                        style={{ marginTop: "8px" }}
                      />
                    </div>
                  </div>
                  {viewFileDialog.data.register_file_path === undefined ||
                  viewFileDialog.data.register_file_path === "" ||
                  viewFileDialog.data.register_file_path === null ? (
                    ""
                  ) : (
                    <div
                      className="p-col-12"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <img
                        src={viewFileDialog.data.register_file_path}
                        width={size + "%"}
                      />
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </>
          </Dialog>
        </>
      );
    };

    // col list
    const actionBodyView = (rowData) => {
      if (rowData.register_file_path.toLowerCase().indexOf(".pdf") !== -1) {
        return (
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={() =>
                setViewFileDialog({ open: true, data: rowData, type: "pdf" })
              }
              icon="pi pi-file-pdf"
              className="p-button-rounded p-button-secondary"
              tooltip="ดูไฟล์เอกสาร"
              tooltipOptions={{ position: "top" }}
            />
          </div>
        );
      } else if (
        rowData.register_file_path.toLowerCase().indexOf(".jpg") !== -1 ||
        rowData.register_file_path.toLowerCase().indexOf(".jpeg") !== -1 ||
        rowData.register_file_path.toLowerCase().indexOf(".png") !== -1
      ) {
        return (
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={() =>
                setViewFileDialog({ open: true, data: rowData, type: "img" })
              }
              icon="pi pi-image"
              className="p-button-rounded p-button-secondary"
              tooltip="ดูไฟล์รูปภาพ"
              tooltipOptions={{ position: "top" }}
            />
          </div>
        );
      }
    };

    const actionBodyDelete = (rowData) => {
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => props.setDeleteDialog({ open: true, data: rowData })}
            style={{ marginLeft: 5 }}
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            tooltip="ลบ"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    };

    const title = () => {
      if (props.dialog.data.person_fullname === undefined) {
        return "ไฟล์แนบ";
      } else {
        return `ไฟล์แนบ ${props.dialog.data.person_fullname}`;
      }
    };

    // อัพโหลดไฟล์
    const dialogBodyUploadfile = () => {
      const footerBrowseFile = () => {
        return (
          <div className="dialog-footer-action-right">
            <Button
              label="ยกเลิก"
              icon="pi pi-times"
              onClick={() => props.setUploadDialog(false)}
              className="p-button-secondary p-button-rounded"
              style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
            />
            <Button
              label={
                props.uploadDialog.typeUpload === "edit" ? "บันทึก" : "บันทึก"
              }
              icon="pi pi-check"
              // onClick={() => props.submitForm({ ...formObject, ...props.uploadDialog.data, ...props.uploadDialog }, 'ADD_FILE')}
              onClick={() =>
                props.submitForm(
                  {
                    file: formObject.file,
                    register_seq: props.uploadDialog.data.register_seq,
                    register_file_seq:
                      props.uploadDialog.data.register_file_seq,
                    typeUpload: props.uploadDialog.typeUpload,
                  },
                  "ADD_FILE"
                )
              }
              autoFocus
              className="p-button-rounded"
            />
          </div>
        );
      };

      let title = "";
      if (
        props.uploadDialog.data !== undefined &&
        props.uploadDialog.typeUpload === "edit"
      ) {
        let arr = props.uploadDialog.data.register_file_path.split("/");
        title = "[ " + arr[arr.length - 1] + " ]";
      }

      const checkSizeFile = (data) => {
        if (data.target.files.length > 1) {
          props.showMessages("warn", `แจ้งเตือน`, `จำนวนต้องไม่เกิน 1 ไฟล์)`);
          document.getElementById("myFile").value = "";
        } else if (data.target.files[0].size > 5242880) {
          props.showMessages("warn", `แจ้งเตือน`, `ขนาดไม่เกิน 5MB`);
          document.getElementById("myFile").value = "";
        } else {
          setformObject({ ...formObject, file: data.target.files[0] });
        }
      };

      return (
        <Dialog
          header={"ไฟล์แนบ " + title}
          visible={props.uploadDialog.open}
          style={{ width: "35vw" }}
          footer={footerBrowseFile()}
          onHide={() => props.setUploadDialog(false)}
          blockScroll={true}
          className="p-fluid"
          maximizable
        >
          <div className="p-grid" style={{ marginBottom: 30 }}>
            <div className="p-col-12">
              <label>
                ไฟล์แนบประเภท jpg, jpeg, png, หรือ pdf (ขนาดไม่เกิน 5MB : 1ไฟล์)
              </label>
              <br />
              <input
                type="file"
                accept=".pdf, image/jpeg, image/png, image/jpg"
                onChange={(e) => checkSizeFile(e)}
                id="myFile"
                name="filename"
                style={{
                  border: "1px solid #E0E0E0",
                  width: "100%",
                  height: "38px",
                  padding: "7px",
                }}
              />
              <br />
              <div></div>
            </div>
          </div>
        </Dialog>
      );
    };

    //แก้ไข
    const actionBodyEdit = (rowData) => {
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() =>
              props.setUploadDialog({
                open: true,
                data: rowData,
                typeUpload: "edit",
              })
            }
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning"
            tooltip="คลิกเพื่อ แก้ไข"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    };

    return (
      <>
        <div className="dialog" class="target">
          <div class="handler">
            <Dialog
              header={title()}
              visible={props.dialog.openListUpload}
              style={{ width: "50vw" }}
              footer={renderFooter()}
              onHide={() => props.setDialog(false)}
              blockScroll={true}
              className="p-fluid"
              maximizable
              // contentStyle={{ overflowY: 'visible' }}
            >
              <div className="p-grid" style={{ marginBottom: 30 }}>
                <div className="p-col-12 p-md-4" style={{ display: "flex" }}>
                  <Button
                    onClick={() =>
                      props.setUploadDialog({
                        open: true,
                        data: props.dialog.data,
                        typeUpload: "add",
                      })
                    }
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success"
                    label="เพิ่มไฟล์แนบ"
                    style={{ width: "auto" }}
                  />
                </div>
                <div className="p-col-12">
                  <DataTable
                    value={props.registerFileList}
                    emptyMessage="ไม่มีไฟล์เเนบ"
                    className="p-datatable-responsive-demo"
                    autoLayout
                    rowHover
                  >
                    <Column
                      field="index"
                      header="ลำดับ"
                      style={{ textAlign: "center", width: "6%" }}
                    ></Column>
                    <Column
                      field="register_file_name"
                      header="ชื่อไฟล์"
                      style={{ wordWrap: "break-word" }}
                    ></Column>
                    <Column
                      header="ดูไฟล์"
                      body={actionBodyView}
                      style={{ width: "7%" }}
                    ></Column>
                    <Column
                      header="แก้ไข"
                      body={actionBodyEdit}
                      style={{ textAlign: "center", width: "7%" }}
                    />
                    <Column
                      header="ลบ"
                      body={actionBodyDelete}
                      style={{ width: "7%" }}
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
        <>
          {viewDialog()}
          {dialogBodyUploadfile()}
        </>
      </>
    );
  };

  return (
    <>
      {dialogBodyApprove()}
      {dialogListUploadfile()}
    </>
  );
}
