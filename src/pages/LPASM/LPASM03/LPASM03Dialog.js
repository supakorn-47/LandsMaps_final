import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { validateInputText } from "../../../utils/ValidateUtil";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Message } from "primereact/message";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPASM03Dialog({
  setDialogPDF,
  onDeleteServiceReqAndRes,
  onUpdateServiceReqAndRes,
  onAddServiceReqAndRes,
  reqAndResList,
  dataTable,
  dialog,
  setDialog,
  submitForm,
  submitted,
  setSubmitted,
  methodOption,
  serviceOption,
  dataOption,
  onRowReorder,
  typeRequestResponse,
  optionDepartment,
  deletePopup,
  setDeletePopup,
  showMessages,
}) {
  const [formObject, setformObject] = useState({});
  const [statusOption, setStatusOption] = useState([
    { label: "ใช้งาน", value: "N" },
    { label: "ไม่ใช้งาน", value: "C" },
  ]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [actionReqAndRes, setActionReqAndRes] = useState("บันทึก");
  const [collapsedReq, setCollapsedReq] = useState(true);
  const [collapsedRes, setCollapsedRes] = useState(true);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const header = (
    <div className="table-header" style={{ marginBottom: "1rem" }}>
      <div className="header-left"></div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหา"
            // className="modern-search-input"
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    </div>
  );

  useEffect(() => {
    if (dialog.dialog === true) {
      setformObject(dialog.data);
    } else {
      setformObject({
        service_name: "",
        service_id: "",
        service_protocol: "",
        service_host: "",
        service_port: "",
        service_path: "",
        service_method: "GET",
        service_param: "",
        service_type: "REST",
        service_data_type: "TEXT",
        service_desc: "",
        record_status: "N",
        service_url: "",
        department_seq: -1,
        public_flag: "0",
        request_require: "1",
      });
    }

    return () => {
      setActionReqAndRes("บันทึก");
    };
  }, [dialog.data]);

  useEffect(() => {
    setSubmitted(false);
  }, [dialog]);

  const dialogUpdate = () => {
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
            icon="pi pi-check"
            onClick={() => submitForm(formObject)}
            autoFocus
            className="p-button-rounded p-button-info"
          />
        </div>
      );
    };

    const onChangefile = (e) => {
      if (e.target.files[0].type !== "application/json") {
        showMessages(
          "error",
          `กรุณาตรวจสอบ`,
          "ไฟล์ภาพเฉพาะนามสกุล .json เท่านั้น"
        );
        document.getElementById(`_jsonFile`).value = "";
        return;
      } else {
        setformObject({ ...formObject, file: e.target.files[0] });
      }
    };

    return (
      <Dialog
        header={"แก้ไขข้อมูลการให้บริการ Service"}
        visible={dialog.dialog}
        style={{ width: "47vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="modern-dialog p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 20 }}>
          <div className="p-col-9">
            <label>
              Service name<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_name}
              onChange={(e) =>
                setformObject({ ...formObject, service_name: e.target.value })
              }
              className="p-inputtext"
            />
            {submitted &&
              !formObject.service_name &&
              validateInputText("service_name", "Service name")}
          </div>
          <div className="p-col-3">
            <label>
              Service Id<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_id}
              onChange={(e) =>
                setformObject({ ...formObject, service_id: e.target.value })
              }
              className="p-inputtext"
            />
            {submitted &&
              !formObject.service_id &&
              validateInputText("service_id", "Service Id")}
          </div>
          <div className="p-col-3">
            <label>
              Protocol<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.service_protocol}
              options={[
                { label: "http", value: "http" },
                { label: "https", value: "https" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, service_protocol: e.value })
              }
              appendTo={document.body}
              className="p-dropdown"
              style={{ minWidth: "auto" }}
            />
            {submitted &&
              formObject.service_protocol === "" &&
              validateInputText("service_protocol", "Protocol")}
          </div>
          <div className="p-col-6">
            <label>
              Host<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_host}
              onChange={(e) =>
                setformObject({ ...formObject, service_host: e.target.value })
              }
              className="p-inputtext"
            />
            {submitted &&
              !formObject.service_host &&
              validateInputText("service_host", "Host")}
          </div>
          <div className="p-col-3">
            <label>Port</label>
            <InputText
              value={
                formObject.service_port === null ? "" : formObject.service_port
              }
              onChange={(e) =>
                setformObject({ ...formObject, service_port: e.target.value })
              }
              keyfilter={/[\d]/}
              className="p-inputtext"
            />
          </div>
          <div className="p-col-12">
            <label>
              Path<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_path}
              onChange={(e) =>
                setformObject({ ...formObject, service_path: e.target.value })
              }
              className="p-inputtext"
            />
            {submitted &&
              !formObject.service_path &&
              validateInputText("service_path", "Path")}
          </div>
          <div className="p-col-12">
            <label>Parameter</label>
            <InputText
              value={
                formObject.service_param === null
                  ? ""
                  : formObject.service_param
              }
              onChange={(e) =>
                setformObject({ ...formObject, service_param: e.target.value })
              }
              className="p-inputtext"
            />
          </div>
          <div className="p-col-12">
            <label>
              Service url<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_url}
              onChange={(e) =>
                setformObject({ ...formObject, service_url: e.target.value })
              }
              className="p-inputtext"
            />
            {submitted &&
              !formObject.service_url &&
              validateInputText("service_host", "Service url")}
          </div>

          <div className="p-col-6">
            <label>
              หน่วยงาน<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.department_seq + ""}
              options={optionDepartment}
              onChange={(e) =>
                setformObject({ ...formObject, department_seq: e.value })
              }
              appendTo={document.body}
              className="p-dropdown"
            />
            {submitted &&
              formObject.department_seq === "-1" &&
              validateInputText("department_seq", "หน่วยงาน")}
          </div>
          <div className="p-col-6">
            <label>
              Method<span style={{ color: "red" }}>*</span>
            </label>
            {/* <br /> */}
            <SelectButton
              value={formObject.service_method}
              options={[
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, service_method: e.target.value })
              }
              className="p-selectbutton"
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.service_method === null &&
              validateInputText("service_method", "Method")}
          </div>
          <div className="p-col-6">
            <label>
              ประเภท Service<span style={{ color: "red" }}>*</span>
            </label>
            {/* <br /> */}
            <SelectButton
              value={formObject.service_type}
              options={serviceOption}
              onChange={(e) =>
                setformObject({ ...formObject, service_type: e.target.value })
              }
              className="p-selectbutton"
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.service_type === null &&
              validateInputText("service_type", "ประเภท Service")}
          </div>
          <div className="p-col-6">
            <label>
              ประเภทข้อมูล<span style={{ color: "red" }}>*</span>
            </label>
            {/* <br /> */}
            <SelectButton
              value={formObject.service_data_type}
              options={dataOption}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  service_data_type: e.target.value,
                })
              }
              className="p-selectbutton"
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.service_data_type === null &&
              validateInputText("service_data_type", "ประเภทข้อมูล")}
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
              className="p-selectbutton"
            />
            {submitted &&
              formObject.record_status === null &&
              validateInputText("record_status", "สถานะ")}
          </div>

          <div className="p-col-6">
            <label>
              เผยแพร่<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.public_flag}
              options={[
                { label: "เผยแพร่", value: "1" },
                { label: "ไม่เผยแพร่", value: "0" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, public_flag: e.target.value })
              }
              optionLabel="label"
              optionValue="value"
              className="p-selectbutton"
            />
            {submitted &&
              formObject.public_flag === null &&
              validateInputText("public_flag", "สถานะ")}
          </div>

          <div className="p-col-12">
            <label>รายละเอียด api</label>
            <InputTextarea
              value={
                formObject.service_desc === null ? "" : formObject.service_desc
              }
              onChange={(e) =>
                setformObject({ ...formObject, service_desc: e.target.value })
              }
              rows={4}
              maxLength="500"
              style={{ resize: "none" }}
              className="p-inputtext"
            />
          </div>

          <div className="p-col-12">
            <label>Upload JSON File</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => onChangefile(e)}
              id={`_jsonFile`}
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
          {formObject.service_file_name && (
            <div className="p-col-12">
              <div
                className="file-item"
                tooltip={"คลิกที่นี่เพื่อดูไฟล์ JSON"}
                onClick={() =>
                  setDialogPDF({
                    open: true,
                    pdfURL: formObject.service_file,
                    formObject: formObject,
                  })
                }
              >
                <span className="pi pi-file file-icon" />
                <span className="file-name">
                  {formObject.service_file_name}
                </span>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    );
  };

  const dialogAdd = () => {
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
            label="บันทึก"
            icon="pi pi-check"
            onClick={() => submitForm(formObject)}
            autoFocus
            className="p-button-rounded p-button-info"
          />
        </div>
      );
    };

    const onChangefile = (e) => {
      if (e.target.files[0].type !== "application/json") {
        showMessages(
          "error",
          `กรุณาตรวจสอบ`,
          "ไฟล์ภาพเฉพาะนามสกุล .json เท่านั้น"
        );
        document.getElementById(`_jsonFile`).value = "";
        return;
      } else {
        setformObject({ ...formObject, file: e.target.files[0] });
      }
    };

    return (
      <Dialog
        header={"เพิ่มข้อมูลการให้บริการ Service"}
        visible={dialog.dialogAdd}
        style={{ width: "47vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 20 }}>
          <div className="p-col-9">
            <label>
              Service name<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_name}
              onChange={(e) =>
                setformObject({ ...formObject, service_name: e.target.value })
              }
            />
            {submitted &&
              !formObject.service_name &&
              validateInputText("service_name", "Service name")}
          </div>
          <div className="p-col-3">
            <label>
              Service Id<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_id}
              onChange={(e) =>
                setformObject({ ...formObject, service_id: e.target.value })
              }
            />
            {submitted &&
              !formObject.service_id &&
              validateInputText("service_id", "Service Id")}
          </div>
          <div className="p-col-3">
            <label>
              Protocol<span style={{ color: "red" }}>*</span>
            </label>
            {/* <InputText value={formObject.service_protocol} onChange={(e) => setformObject({ ...formObject, service_protocol: e.target.value })} keyfilter="alpha"/> */}
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.service_protocol}
              options={[
                { label: "http", value: "http" },
                { label: "https", value: "https" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, service_protocol: e.value })
              }
              // placeholder="Protocol"
              appendTo={document.body}
              style={{ minWidth: "auto" }}
            />
            {submitted &&
              formObject.service_protocol === "" &&
              validateInputText("service_protocol", "Protocol")}
          </div>
          <div className="p-col-6">
            <label>
              Host<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_host}
              onChange={(e) =>
                setformObject({ ...formObject, service_host: e.target.value })
              }
              keyfilter={/[0-9a-z._-]/i}
            />
            {submitted &&
              !formObject.service_host &&
              validateInputText("service_host", "Host")}
          </div>
          <div className="p-col-3">
            <label>Port</label>
            <InputText
              value={formObject.service_port}
              onChange={(e) =>
                setformObject({ ...formObject, service_port: e.target.value })
              }
              keyfilter="money"
            />
          </div>
          <div className="p-col-12">
            <label>
              Path<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_path}
              onChange={(e) =>
                setformObject({ ...formObject, service_path: e.target.value })
              }
              keyfilter={/[0-9a-z/]/i}
            />
            {submitted &&
              !formObject.service_path &&
              validateInputText("service_path", "Path")}
          </div>
          <div className="p-col-12">
            <label>Parameter</label>
            <InputText
              value={formObject.service_param}
              onChange={(e) =>
                setformObject({ ...formObject, service_param: e.target.value })
              }
            />
          </div>
          <div className="p-col-12">
            <label>
              Service url<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.service_url}
              onChange={(e) =>
                setformObject({ ...formObject, service_url: e.target.value })
              }
            />
            {submitted &&
              !formObject.service_url &&
              validateInputText("service_url", "Service url")}
          </div>

          <div className="p-col-6">
            <label>
              หน่วยงาน<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.department_seq + ""}
              options={optionDepartment}
              onChange={(e) =>
                setformObject({ ...formObject, department_seq: e.value })
              }
              appendTo={document.body}
            />
            {submitted &&
              parseInt(formObject.department_seq) === -1 &&
              validateInputText("department_seq", "หน่วยงาน")}
          </div>

          <div className="p-col-6">
            <label>
              Method<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.service_method}
              options={[
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, service_method: e.target.value })
              }
              style={{ marginTop: "5px" }}
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.service_method === null &&
              validateInputText("service_method", "Method")}
          </div>
          <div className="p-col-6">
            <label>
              ประเภท Service<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.service_type}
              options={serviceOption}
              onChange={(e) =>
                setformObject({ ...formObject, service_type: e.target.value })
              }
              style={{ marginTop: "5px" }}
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.service_type === null &&
              validateInputText("service_type", "ประเภท Service")}
          </div>
          <div className="p-col-6">
            <label>
              ประเภทข้อมูล<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.service_data_type}
              options={dataOption}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  service_data_type: e.target.value,
                })
              }
              style={{ marginTop: "5px" }}
              optionLabel="label"
              optionValue="value"
            />
            {submitted &&
              formObject.service_data_type === null &&
              validateInputText("service_data_type", "ประเภทข้อมูล")}
          </div>
          {/* <div className="p-col-12"></div> */}
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
              style={{ marginTop: "5px" }}
            />
            {submitted &&
              formObject.record_status === null &&
              validateInputText("record_status", "สถานะ")}
          </div>
          <div className="p-col-6">
            <label>
              เผยแพร่<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={formObject.public_flag}
              options={[
                { label: "เผยแพร่", value: "1" },
                { label: "ไม่เผยแพร่", value: "0" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, public_flag: e.target.value })
              }
              optionLabel="label"
              optionValue="value"
              style={{ marginTop: "5px" }}
            />
            {submitted &&
              formObject.public_flag === null &&
              validateInputText("public_flag", "สถานะ")}
          </div>

          <div className="p-col-12">
            <label>รายละเอียด api</label>
            <InputTextarea
              value={formObject.service_desc}
              onChange={(e) =>
                setformObject({ ...formObject, service_desc: e.target.value })
              }
              rows={4}
              maxLength="500"
              style={{ resize: "none" }}
            />
          </div>

          <div className="p-col-12">
            <label>Upload JSON File</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => onChangefile(e)}
              id={`_jsonFile`}
              style={{
                border: "1px solid #E0E0E0",
                width: "100%",
                height: "33px",
                padding: "7px",
              }}
            />
          </div>
        </div>
      </Dialog>
    );
  };

  const fnCancleForm = (Collapsed = false) => {
    setformObject({
      ...formObject,

      request_ord: 0,
      request_key: "",
      request_data_type: "",
      request_data_length: "",
      request_require: "1",
      request_desc: "",
      remark: "",

      response_ord: 0,
      response_key: "",
      response_data_type: "",
      response_data_length: "",
      response_desc: "",
      remark: "",
    });
    setActionReqAndRes("บันทึก");
    setSubmitted(false);
    if (Collapsed) {
      setCollapsedReq(true);
      setCollapsedRes(true);
    }
  };

  const onSubmitReqAndRes = (type) => {
    if (type === "Request") {
      let showerror = false;
      if (
        // formObject.request_ord === "" || formObject.request_ord === undefined ||
        formObject.request_key === "" ||
        formObject.request_key === undefined ||
        formObject.request_data_type === "" ||
        formObject.request_data_type === undefined ||
        formObject.request_data_length === "" ||
        formObject.request_data_length === undefined ||
        formObject.request_require === null
      ) {
        showerror = true;
      }
      if (showerror) {
        setSubmitted(true);
        return false;
      }
      if (actionReqAndRes === "บันทึก") {
        // setCollapsedReq(true);
        onAddServiceReqAndRes(type, {
          service_seq: dialog.data.service_seq,
          request_ord: 0,
          request_key: formObject.request_key,
          request_data_type: formObject.request_data_type,
          request_data_length: formObject.request_data_length,
          request_require: formObject.request_require,
          request_desc: formObject.request_desc,
          remark: formObject.remark,
        });
      } else {
        setCollapsedReq(true);
        onUpdateServiceReqAndRes(type, {
          request_seq: formObject.request_seq,
          service_seq: formObject.service_seq,
          request_ord: formObject.request_ord,
          request_key: formObject.request_key,
          request_data_type: formObject.request_data_type,
          request_data_length: formObject.request_data_length,
          request_require: formObject.request_require,
          request_desc: formObject.request_desc,
          remark: formObject.remark === null ? "" : formObject.remark,
        });
      }
    } else if (type === "Response") {
      let showerror = false;
      if (
        // formObject.response_ord === "" || formObject.response_ord === undefined ||
        formObject.response_key === "" ||
        formObject.response_key === undefined ||
        formObject.response_data_type === "" ||
        formObject.response_data_type === "-1" ||
        formObject.response_data_type === undefined ||
        formObject.response_data_length === "" ||
        formObject.response_data_length === undefined
      ) {
        showerror = true;
      }
      if (showerror) {
        setSubmitted(true);
        return false;
      }
      if (actionReqAndRes === "บันทึก") {
        // setCollapsedRes(true)
        onAddServiceReqAndRes(type, {
          service_seq: dialog.data.service_seq,
          response_ord: 0,
          response_key: formObject.response_key,
          response_data_type: formObject.response_data_type,
          response_data_length: formObject.response_data_length,
          response_desc:
            formObject.response_desc === undefined
              ? " "
              : formObject.response_desc,
          remark: formObject.remark === undefined ? " " : formObject.remark,
        });
      } else {
        setCollapsedRes(true);
        onUpdateServiceReqAndRes(type, {
          response_seq: formObject.response_seq,
          service_seq: formObject.service_seq,
          response_ord: formObject.response_ord,
          response_key: formObject.response_key,
          response_data_type: formObject.response_data_type,
          response_data_length: formObject.response_data_length,
          response_desc: formObject.response_desc,
          remark: formObject.remark,
        });
      }
    }
    fnCancleForm();
  };

  const dialogRequest = () => {
    if (dialog.data === undefined) return;

    const headerReq = () => {
      return (
        <div className="table-header" style={{ marginBottom: "1rem" }}>
          <div className="header-left"></div>
          <div className="header-right">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                placeholder="ค้นหา"
                onInput={(e) => setGlobalFilter(e.target.value)}
              />
            </span>
          </div>
        </div>
      );
    };

    const renderFooter = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ปิดหน้าต่าง"
            icon="pi pi-times"
            onClick={() => setDialog(false)}
            className="p-button-secondary p-button-rounded"
            // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
          />
          {/* <Button label="บันทึก" icon="pi pi-check" onClick={() => setDialog(false)} autoFocus className="p-button-rounded" /> */}
        </div>
      );
    };

    const btnEdit = (rowData) => {
      const fnClick = () => {
        setCollapsedReq(false);
        setformObject(rowData);
        setActionReqAndRes("แก้ไข");
      };
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => fnClick()}
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning"
            tooltip="คลิกเพื่อ แก้ไข"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    };

    const btnDelete = (rowData) => {
      const onClick = () => {
        setDeletePopup({ open: true, rowData: rowData, action: "Request" });
        //onDeleteServiceReqAndRes('Request', rowData)
      };

      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => onClick()}
            style={{ marginLeft: 5 }}
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            tooltip="คลิกเพื่อ ยกเลิก"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    };

    const renderStatus = (rowData) => {
      if (rowData.request_require !== undefined) {
        let _text = rowData.request_require;
        return (
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                background: _text === "1" ? "#c8e6c9" : "#ffcdd2",
                color: _text === "1" ? "#256029" : "#c63737",
                borderRadius: "10px",
                padding: ".25em .5rem",
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: "13px",
                letterSpacing: ".3px",
              }}
            >
              {_text === "1" ? "YES" : "NO"}
            </span>
          </div>
        );
      }
    };

    return (
      <Dialog
        header={`พจนานุกรมข้อมูลคำขอ (Request) - ${dialog.data.service_name}`}
        visible={dialog.dialogRequest}
        style={{ width: "80vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div>
          <Panel
            header={`${
              actionReqAndRes === "บันทึก" ? "เพิ่ม Request" : "แก้ไข Request"
            }`}
            collapsed={collapsedReq}
            toggleable
            onToggle={(e) => setCollapsedReq(e.value)}
          >
            <div className="p-grid" style={{ marginBottom: 20 }}>
              <div className="p-col-4">
                <label>
                  Key<span style={{ color: "red" }}>*</span>
                </label>
                <InputText
                  value={formObject.request_key}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      request_key: e.target.value,
                    })
                  }
                  keyfilter={/[0-9a-z_]/i}
                />
                {submitted &&
                  !formObject.request_key &&
                  validateInputText("request_key", "Key")}
              </div>
              <div className="p-col-4">
                <label>
                  Type<span style={{ color: "red" }}>*</span>
                </label>
                <Dropdown
                  value={formObject.request_data_type || "-1"}
                  options={typeRequestResponse}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      request_data_type: e.target.value,
                    })
                  }
                />
                {submitted &&
                  !formObject.request_data_type &&
                  validateInputText("request_data_type", "Type")}
              </div>
              <div className="p-col-4">
                <label>
                  Length<span style={{ color: "red" }}>*</span>
                </label>
                <InputText
                  value={formObject.request_data_length}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      request_data_length: e.target.value,
                    })
                  }
                  keyfilter="money"
                  maxLength={5}
                />
                {submitted &&
                  !formObject.request_data_length &&
                  validateInputText("request_data_length", "Length")}
              </div>

              <div className="p-col-6">
                <label>รายละเอียด</label>
                <InputText
                  value={formObject.request_desc}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      request_desc: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-col-6">
                <label>หมายเหตุ (ตัวอย่างข้อมูล)</label>
                <InputText
                  value={formObject.remark}
                  onChange={(e) =>
                    setformObject({ ...formObject, remark: e.target.value })
                  }
                />
              </div>
              <div className="p-col-2">
                <label>
                  Require<span style={{ color: "red" }}>*</span>
                </label>
                <SelectButton
                  value={formObject.request_require}
                  options={[
                    { label: "Yes", value: "1" },
                    { label: "NO", value: "0" },
                  ]}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      request_require: e.target.value,
                    })
                  }
                  style={{ marginTop: "5px" }}
                  optionLabel="label"
                  optionValue="value"
                />
                {submitted &&
                  (formObject.request_require === null ||
                    formObject.request_require === undefined ||
                    formObject.request_require === "") &&
                  validateInputText("request_require", "Require")}
              </div>
            </div>
            {/* ปุ่ม */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              <Button
                onClick={() => fnCancleForm(true)}
                className="p-button-secondary p-button-rounded"
                icon="pi pi-times"
                label="ยกเลิก"
                style={{
                  width: "auto",
                }}
              />
              <Button
                onClick={() => onSubmitReqAndRes("Request")}
                className="p-button-rounded p-button-info"
                // icon={
                //   actionReqAndRes === "แก้ไข" ? "pi pi-check" : "pi pi-check"
                // }
                // label={actionReqAndRes}
                icon={"pi pi-check"}
                label={"บันทึก"}
                style={{ width: "auto" }}
              />
            </div>
          </Panel>
        </div>
        <br />
        <div className="p-grid">
          <div className="p-col-12">
            <DataTable
              value={reqAndResList}
              dataKey="id"
              paginator
              // rows={10}
              // rowsPerPageOptions={rowsPerPageOptions()}
              // paginatorTemplate={paginatorTemplate()}
              // currentPageReportTemplate={currentPageReportTemplate()}
              pageLinkSize={pageLinkSize}
              rows={rows}
              rowsPerPageOptions={rowsPerPageOptions}
              paginatorTemplate={paginatorTemplate}
              currentPageReportTemplate={currentPageReportTemplate}
              header={headerReq()}
              globalFilter={globalFilter}
              emptyMessage="ไม่พบข้อมูลที่ค้นหา"
              onRowReorder={(e) => onRowReorder(e, "UpdateOrderRequest")}
              autoLayout
              rowHover
              className="modern-datatable"
            >
              <Column rowReorder style={{ width: "5%", textAlign: "center" }} />
              <Column
                field="index"
                header="ลำดับ"
                sortable
                style={{ textAlign: "center", width: "5%" }}
              ></Column>
              <Column
                field="request_key"
                header="คอลัมน์"
                headerStyle={{ textAlign: "left", width: "14%" }}
                bodyStyle={{ wordWrap: "break-word" }}
              ></Column>
              <Column
                field="request_data_type"
                header="ประเภท"
                style={{ width: "5%", textAlign: "center" }}
              ></Column>
              <Column
                field="request_data_length"
                header="ความยาว"
                style={{ width: "5%", textAlign: "center" }}
              ></Column>
              <Column
                field="request_require"
                header="ต้องระบุ"
                body={renderStatus}
                style={{ width: "5%", textAlign: "center" }}
              ></Column>
              <Column
                field="request_desc"
                header="รายละเอียด"
                style={{ width: "10%", textAlign: "left" }}
              ></Column>
              <Column
                field="remark"
                header="หมายเหตุ(ตัวอย่างข้อมูล)"
                style={{ width: "20%", textAlign: "left" }}
              ></Column>
              <Column
                header="แก้ไข"
                body={btnEdit}
                style={{ textAlign: "center", width: "6%" }}
              ></Column>
              <Column
                header="ลบ"
                body={btnDelete}
                style={{ textAlign: "center", width: "6%" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </Dialog>
    );
  };

  const dialogResponse = () => {
    if (dialog.data === undefined) return;

    const renderFooter = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ปิดหน้าต่าง"
            icon="pi pi-times"
            onClick={() => setDialog(false)}
            className="p-button-secondary p-button-rounded"
            // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
          />
          {/* <Button label="บันทึก" icon="pi pi-check" onClick={() => setDialog(false)} autoFocus className="p-button-rounded" /> */}
        </div>
      );
    };

    const btnEdit = (rowData) => {
      const fnClick = () => {
        setCollapsedRes(false);
        setformObject(rowData);
        setActionReqAndRes("แก้ไข");
        const element = document.getElementById("_panelResponse");
        element.scrollIntoView();
      };
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => fnClick()}
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning"
            tooltip="คลิกเพื่อ แก้ไข"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    };

    const btnDelete = (rowData) => {
      const onClick = () => {
        setDeletePopup({ open: true, rowData: rowData, action: "Response" });
        //onDeleteServiceReqAndRes('Response', rowData)
      };

      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => onClick()}
            style={{ marginLeft: 5 }}
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            tooltip="คลิกเพื่อลบ"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    };

    return (
      <Dialog
        header={`พจนานุกรมข้อมูลที่ตอบกลับ (Response) - ${dialog.data.service_name}`}
        visible={dialog.dialogResponse}
        style={{ width: "80vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
        // id="_popupResponse"
      >
        <div className="">
          <Panel
            id="_panelResponse"
            header={`${
              actionReqAndRes === "บันทึก" ? "เพิ่ม Response" : "แก้ไข Response"
            }`}
            collapsed={collapsedRes}
            toggleable
            onToggle={(e) => setCollapsedRes(e.value)}
          >
            <div className="p-grid" style={{ marginBottom: 20 }}>
              <div className="p-col-4">
                <label>
                  Key<span style={{ color: "red" }}>*</span>
                </label>
                <InputText
                  value={formObject.response_key}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      response_key: e.target.value,
                    })
                  }
                />
                {submitted &&
                  !formObject.response_key &&
                  validateInputText("response_key", "Key")}
              </div>
              <div className="p-col-4">
                <label>
                  Type<span style={{ color: "red" }}>*</span>
                </label>
                <Dropdown
                  value={formObject.response_data_type || "-1"}
                  options={typeRequestResponse}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      response_data_type: e.target.value,
                    })
                  }
                />
                {submitted &&
                  (!formObject.response_data_type ||
                    formObject.response_data_type === "-1") &&
                  validateInputText("response_data_type", "Type")}
              </div>
              <div className="p-col-4">
                <label>
                  Length<span style={{ color: "red" }}>*</span>
                </label>
                <InputText
                  value={formObject.response_data_length}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      response_data_length: e.target.value,
                    })
                  }
                />
                {submitted &&
                  !formObject.response_data_length &&
                  validateInputText("response_data_length", "Length")}
              </div>
              <div className="p-col-6">
                <label>รายละเอียด</label>
                <InputText
                  value={formObject.response_desc}
                  onChange={(e) =>
                    setformObject({
                      ...formObject,
                      response_desc: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-col-6">
                <label>หมายเหตุ (ตัวอย่างข้อมูล)</label>
                <InputText
                  value={formObject.remark}
                  onChange={(e) =>
                    setformObject({ ...formObject, remark: e.target.value })
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              <Button
                onClick={() => fnCancleForm(true)}
                className="p-button-secondary p-button-rounded"
                icon="pi pi-times"
                label="ยกเลิก"
                style={{
                  width: "auto",
                }}
              />
              <Button
                onClick={() => onSubmitReqAndRes("Response")}
                className="p-button-rounded p-button-info"
                // icon={
                //   actionReqAndRes === "แก้ไข" ? "pi pi-check" : "pi pi-check"
                // }
                // label={actionReqAndRes}
                icon={"pi pi-check"}
                label={"บันทึก"}
                style={{ width: "auto" }}
              />
            </div>
          </Panel>
          <br />
          <div className="p-col-12">
            <DataTable
              value={reqAndResList}
              dataKey="id"
              paginator
              // rows={10}
              // rowsPerPageOptions={rowsPerPageOptions()}
              // paginatorTemplate={paginatorTemplate()}
              // currentPageReportTemplate={currentPageReportTemplate()}
              pageLinkSize={pageLinkSize}
              rows={rows}
              rowsPerPageOptions={rowsPerPageOptions}
              paginatorTemplate={paginatorTemplate}
              currentPageReportTemplate={currentPageReportTemplate}
              header={header}
              globalFilter={globalFilter}
              emptyMessage="ไม่พบข้อมูลที่ค้นหา"
              onRowReorder={(e) => onRowReorder(e, "UpdateOrderResponse")}
              autoLayout
              rowHover
              className="modern-datatable"
            >
              <Column rowReorder style={{ width: "5%", textAlign: "center" }} />
              <Column
                field="index"
                header="ลำดับ"
                sortable
                style={{ textAlign: "center", width: "6%" }}
              ></Column>
              <Column
                field="response_key"
                header="คอลัมน์"
                headerStyle={{ width: "15%", textAlign: "left" }}
                bodyStyle={{ wordWrap: "break-word" }}
              ></Column>
              <Column
                field="response_data_type"
                header="ประเภท"
                style={{ width: "8%" }}
              ></Column>
              <Column
                field="response_data_length"
                header="ความยาว"
                style={{
                  width: "7%",
                  wordWrap: "break-word",
                  textAlign: "center",
                }}
              ></Column>
              <Column
                field="response_desc"
                header="รายละเอียด"
                bodyStyle={{ width: "10%", textAlign: "left" }}
                headerStyle={{ textAlign: "left" }}
              ></Column>
              <Column
                field="remark"
                header="หมายเหตุ(ตัวอย่างข้อมูล)"
                bodyStyle={{
                  width: "10%",
                  textAlign: "left",
                  wordWrap: "break-word",
                }}
                headerStyle={{ textAlign: "left" }}
              ></Column>
              <Column
                header="แก้ไข"
                body={btnEdit}
                style={{ textAlign: "center", width: "6%" }}
              ></Column>
              <Column
                header="ลบ"
                body={btnDelete}
                style={{ textAlign: "center", width: "6%" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </Dialog>
    );
  };

  const footerButtonDelete = () => {
    const onConfirmClick = () => {
      onDeleteServiceReqAndRes(deletePopup.action, deletePopup.rowData);
    };

    return (
      <FooterButtonCenter
        onClickOk={() => onConfirmClick()}
        onClickCancle={() => setDeletePopup(false)}
      />
    );
  };

  return (
    <>
      {dialogUpdate()}
      {dialogAdd()}
      {dialogRequest()}
      {dialogResponse()}

      <DialogDelete
        visible={deletePopup.open}
        header="การยืนยัน"
        modal
        footer={footerButtonDelete()}
        onHide={() => setDeletePopup(false)}
        textContent="คุณต้องการลบข้อมูล ใช่หรือไม่ ?"
        className="modern-dialog"
      />
    </>
  );
}
