import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendars } from "../../../components/Calendar/Calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { validateInputText } from "../../../utils/ValidateUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function DBT07Dialog({
  dialog,
  setDialog,
  submitForm,
  optionPattern,
  submitted,
  setSubmitted,
  onUpdateNextTime,
}) {
  const [formObject, setFormObject] = useState({
    SCHEDULE_TYPE: 1,
    SOURCE: 0,
    start_dtm: new Date(),
  });
  const [selectTotalM, setSelectTotalM] = useState(0);
  const [selectTotal, setSelectTotal] = useState(0);
  const [selectedTable, setSelectedTable] = useState([]);

  const optionSCHEDULE_TYPE = [
    { label: "One Time", value: "One Time" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const day = [
    { label: "Sunday", value: 1 },
    { label: "Monday", value: 2 },
    { label: "Tuesday", value: 3 },
    { label: "Wednesday", value: 4 },
    { label: "Thursday", value: 5 },
    { label: "Firday", value: 6 },
    { label: "Saturday", value: 7 },
  ];

  const month = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const optionSCHEDULE_MODE = [
    { label: "กรุณาเลือก Schedule Mode", value: "0" },
    { label: "AUTO SCHEDULE", value: "1" },
    // { label: "MANUAL (ALL)", value: "2" },
    // { label: "MANUAL (INCREMENT)", value: "3" },
    // { label: "MANUAL (CONDITION)", value: "4" },
  ];

  const [globalFilter, setGlobalFilter] = useState(null);

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const header = (
    <div className="table-header" style={{ marginBottom: "1rem" }}>
      <div className="header-left">
        <p className="title" style={{ fontSize: "1rem" }}>
          Job Pattern
        </p>
        <p className="description">
          {"เลือก" + " " + selectTotal + " " + "รายการ"}
        </p>
      </div>
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
    if (dialog.dialog === true && dialog.action === "แก้ไข") {
      let intervalmonth = [];
      if (dialog.data.job_pattern != null) {
        let jobPattern = dialog.data.job_pattern.split(",");

        const selectedJobPattern = jobPattern.map((pattern, idx) => {
          let selectedItem = optionPattern.find(
            ({ transfer_data_seq }) => transfer_data_seq === parseInt(pattern)
          );

          if (selectedItem) return selectedItem;
        });

        setSelectedTable(selectedJobPattern);
        setSelectTotal(selectedJobPattern.length);
      }

      if (dialog.data.interval_month != null) {
        intervalmonth = dialog.data.interval_month.split(",");
        setSelectTotalM(intervalmonth.length);
      }

      setFormObject({
        transfer_job_seq: dialog.data.transfer_job_seq,
        transfer_ord: dialog.data.transfer_ord,
        job_detail: dialog.data.job_detail,
        schedule_mode: dialog.data.schedule_mode,
        schedule_type: dialog.data.schedule_type,
        start_dtm: !dialog.data.start_dtm
          ? ""
          : new Date(dialog.data.start_dtm),
        next_run_time: dialog.data.next_run_time,
        last_run_time: dialog.data.last_run_time,
        interval_minute: dialog.data.interval_minute,
        interval_day_of_week: dialog.data.interval_day_of_week,
        interval_day_of_month: dialog.data.interval_day_of_month,
        interval_month: intervalmonth,
        recode_status: dialog.data.recode_status,
      });
    } else {
      setFormObject({
        transfer_ord: 0,
        job_pattern: "",
        job_detail: "",
        schedule_mode: "0",
        schedule_type: "One Time",
        start_dtm: new Date(),
        next_run_time: new Date(),
        last_run_time: new Date(),
        interval_minute: 1,
        interval_day_of_week: 1,
        interval_day_of_month: "",
        interval_month: "",
      });
    }
    if (dialog.dialogTime === true) {
      setFormObject({
        ...dialog.data,
        next_run_time:
          dialog.data.next_run_time === null
            ? ""
            : new Date(dialog.data.next_run_time),
      });
    }
  }, [dialog]);

  const onInputChange = (e, key) => {
    setFormObject({
      ...formObject,
      [`${key}`]: e.target.value,
    });

    if (key == "interval_month") {
      setSelectTotalM(e.target.value.length);
    }
  };

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => (setDialog(false), setSubmitted(false))}
          className="p-button-secondary p-button-rounded"
          // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
        <Button
          // label={dialog.action}
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => submitForm(formObject, selectedTable)}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const onSelectedTable = (e) => {
    // if (dialog.action === "บันทึก") {
    setSelectedTable(e.value);
    setSelectTotal(e.value.length);
    // }
  };

  const renderDialog = () => {
    const checkChedule_Type = (type) => {
      if (type == "One Time") {
        return (
          <div className="p-col-6">
            <div>
              {/* <label>start_dtm</label> */}
              <label>
                Start Date<span style={{ color: "red" }}>*</span>
              </label>
              <Calendars
                id="icon"
                showIcon
                value={formObject.start_dtm}
                showTime
              />
              {submitted &&
                (formObject.start_dtm === null ||
                  formObject.start_dtm === "") &&
                validateInputText("start_dtm", "Start Date")}
            </div>
          </div>
        );
      } else if (type == "Daily") {
        return (
          <div className="p-col-6">
            <div>
              <label>
                Start Date<span style={{ color: "red" }}>*</span>
              </label>
              <Calendars
                id="icon"
                showIcon
                value={formObject.start_dtm}
                onChange={(e) => onInputChange(e, "start_dtm")}
                showTime
              />
              {submitted &&
                (formObject.start_dtm === null ||
                  formObject.start_dtm === "") &&
                validateInputText("start_dtm", "Start Date")}
            </div>
            <div style={{ marginTop: 12 }}>
              <label>Interval (Minute)</label>
              <InputNumber
                value={formObject.interval_minute}
                onValueChange={(e) => onInputChange(e, "interval_minute")}
                mode="decimal"
                min={1}
                max={60}
                showButtons
                inputStyle={{
                  textAlign: "right",
                }}
                incrementButtonClassName="p-button-prefix p-button-info"
                decrementButtonClassName="p-button-info"
                // incrementButtonClassName="p-prefix-input"
              />
            </div>
          </div>
        );
      } else if (type == "Weekly") {
        return (
          <div className="p-col-6">
            <div>
              <label>
                Start Date<span style={{ color: "red" }}>*</span>
              </label>
              <Calendars
                id="icon"
                showIcon
                value={formObject.start_dtm}
                onChange={(e) => onInputChange(e, "start_dtm")}
                showTime
              />
              {submitted &&
                (formObject.start_dtm === null ||
                  formObject.start_dtm === "") &&
                validateInputText("start_dtm", "Start Date")}
            </div>
            <div style={{ marginTop: 12 }}>
              <label>Interval (Day Of Week)</label>
              <SelectButton
                appendTo={document.body}
                value={formObject.interval_day_of_week}
                options={day}
                onChange={(e) => onInputChange(e, "interval_day_of_week")}
                style={{ fontSize: 14 }}
              ></SelectButton>
            </div>
          </div>
        );
      } else if (type == "Monthly") {
        return (
          <div className="p-col-6">
            <div>
              <label>
                Start Date<span style={{ color: "red" }}>*</span>
              </label>
              <Calendars
                id="icon"
                showIcon
                value={formObject.start_dtm}
                onChange={(e) => onInputChange(e, "start_dtm")}
                showTime
              />
              {submitted &&
                (formObject.start_dtm === null ||
                  formObject.start_dtm === "") &&
                validateInputText("start_dtm", "Start Date")}
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ marginTop: 12, width: "49%" }}>
                <label>Interval (Day Of Month)</label>
                <InputNumber
                  value={formObject.interval_day_of_month}
                  onValueChange={(e) =>
                    onInputChange(e, "interval_day_of_month")
                  }
                  mode="decimal"
                  min={1}
                  max={31}
                  showButtons
                  inputStyle={{ textAlign: "right" }}
                  incrementButtonClassName="p-button-info"
                  decrementButtonClassName="p-button-info"
                />
              </div>
              <div style={{ marginTop: 12, width: "51%", marginLeft: 10 }}>
                <label>Interval (Month)</label>
                <MultiSelect
                  appendTo={document.body}
                  className="___full-content"
                  value={formObject.interval_month}
                  options={month}
                  onChange={(e) => onInputChange(e, "interval_month")}
                  maxSelectedLabels={5}
                  selectedItemsLabel={
                    "เลือก" + " " + selectTotalM + " " + "รายการ"
                  }
                  filter={true}
                  panelStyle={{ padding: "0.7em", fontSize: "14px" }}
                />
              </div>
            </div>
          </div>
        );
      }
    };
    return (
      <Dialog
        header={dialog.title}
        visible={dialog.dialog}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        style={{ width: "90%" }}
        contentStyle={{ marginTop: 0 }}
        // maximized
        maximizable
      >
        <div className="p-grid">
          <div className="p-col-12">
            <label>
              Job Detail<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.job_detail}
              onChange={(e) => onInputChange(e, "job_detail")}
            />
            {submitted &&
              formObject.job_detail === "" &&
              validateInputText("job_detail", "Job Detail")}
          </div>

          <div className="p-col-6">
            <div>
              <label>
                Schedule Mode<span style={{ color: "red" }}>*</span>
              </label>
              <Dropdown
                appendTo={document.body}
                value={formObject.schedule_mode}
                options={optionSCHEDULE_MODE}
                onChange={(e) => onInputChange(e, "schedule_mode")}
                placeholder=""
              />
              {submitted &&
                formObject.schedule_mode === "0" &&
                validateInputText("schedule_mode", "Schedule Mode")}
            </div>
            <div style={{ marginTop: 12 }}>
              <label>
                Schedule Type<span style={{ color: "red" }}>*</span>
              </label>
              <SelectButton
                appendTo={document.body}
                value={formObject.schedule_type}
                options={optionSCHEDULE_TYPE}
                onChange={(e) => onInputChange(e, "schedule_type")}
              />
              {submitted &&
                formObject.schedule_type === null &&
                validateInputText("schedule_type", "Schedule Type")}
            </div>
          </div>

          {checkChedule_Type(formObject.schedule_type)}
        </div>

        <div className="p-grid">
          <div className="p-col-12" style={{ marginTop: 6 }}>
            {/* <div className="table-header">
              <span>Job Pattern</span>
              <span className="p-input-icon-right" style={{ width: "7%" }}>
                {"เลือก" + " " + selectTotal + " " + "รายการ"}
              </span>
            </div> */}
            <DataTable
              header={header}
              globalFilter={globalFilter}
              selection={selectedTable}
              onSelectionChange={onSelectedTable}
              value={optionPattern}
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
              paginatorDropdownAppendTo={document.body}
            >
              <Column
                selectionMode="multiple"
                style={{ width: "3em", textAlign: "center" }}
              />
              <Column
                field="index"
                header="ลำดับ"
                style={{ width: "4em", textAlign: "center" }}
              ></Column>
              {/* <Column field="source_name" header="แหล่งข้อมูล" style={{ wordWrap: 'break-word' }}></Column> */}
              <Column
                field="source_process"
                header="แหล่งข้อมูลต้นทาง"
                style={{ wordWrap: "break-word" }}
              ></Column>
              {/* <Column field="source_schema" header="Schema ต้นทาง" style={{ wordWrap: 'break-word' }}></Column> */}
              <Column
                field="source_table"
                header="ตารางต้นทาง"
                style={{ wordWrap: "break-word" }}
              ></Column>
              <Column
                field="target_process"
                header="แหล่งข้อมูลปลายทาง"
                style={{ wordWrap: "break-word" }}
              ></Column>
              <Column
                field="target_schema"
                header="Schema ปลายทาง"
                style={{ wordWrap: "break-word" }}
              ></Column>
              <Column
                field="target_table"
                header="ตารางปลายทาง"
                style={{ wordWrap: "break-word" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </Dialog>
    );
  };

  //แก้ไข Next Run Time
  const dialogEditNextTime = () => {
    const footer = () => {
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
            onClick={() => onUpdateNextTime(formObject)}
            autoFocus
            className="p-button-rounded p-button-info"
          />
        </div>
      );
    };
    return (
      <Dialog
        header={dialog.title}
        visible={dialog.dialogTime}
        style={{ width: "30vw" }}
        footer={footer()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid">
          <div className="p-col-12">
            <label>
              วันเวลา Next Run Time<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={formObject.next_run_time}
              dateFormat={"dd/mm/yy"}
              showTime
              minDate={new Date()}
              onChange={(e) =>
                setFormObject({ ...formObject, next_run_time: e.target.value })
              }
            />
            {submitted &&
              (formObject.next_run_time === null ||
                formObject.next_run_time === "") &&
              validateInputText("next_run_time", "วันเวลา Next Run Time")}
          </div>
        </div>
      </Dialog>
    );
  };

  return (
    <>
      {renderDialog()}
      {dialogEditNextTime()}
    </>
  );
}
