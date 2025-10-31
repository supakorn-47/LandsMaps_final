import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH } from "../../../utils/DateUtil";

export default function DMS07List({ dataTable, setDialog, onStatusChange }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <Button
          label="เพิ่มตารางเวลา (Schedule) การถ่ายโอนข้อมูล"
          icon="pi pi-plus"
          onClick={() =>
            setDialog({
              dialog: true,
              action: "บันทึก",
              title: "เพิ่มตารางเวลา (Schedule) การถ่ายโอนข้อมูล",
            })
          }
          className="p-button-rounded"
        />
      </span>
      <span className="p-input-icon-right">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="ค้นหา"
          style={{ height: "38px", width: 400 }}
          onInput={(e) => setGlobalFilter(e.target.value)}
        />
      </span>
    </div>
  );

  const actionBodyEdit = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({
              dialog: true,
              action: "แก้ไข",
              title: "แก้ไขตารางเวลา (Schedule) การถ่ายโอนข้อมูล",
              data: rowData,
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

  //แก้ไข NextRunTime
  const actionBodyEditNextTime = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({
              dialogTime: true,
              action: "แก้ไข",
              title: "แก้ไข Next Run Time",
              data: rowData,
            })
          }
          // onClick={() => console.log(1)}
          icon="pi pi-clock"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อ แก้ไข Next Run Time"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };
  // เปิด-ปิด การใช้งาน
  const actionOpenClose = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <InputSwitch
          checked={rowData.record_status === "N" ? true : false}
          onChange={(e) => onStatusChange(rowData, e.value)}
          tooltip="คลิกเพื่อ เปิด/ปิด การใช้งาน"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
  };

  return (
    <div>
      <DataTable
        // ref={(el) => dt = el}
        value={dataTable}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={rowsPerPageOptions()}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        width="150%"
        autoLayout
        rowHover
      >
        <Column
          field="index"
          header="ลำดับ"
          sortable
          style={{ textAlign: "center", width: "5%" }}
        />
        <Column
          field="job_detail"
          header="Job Detail"
          style={{ width: "10%", wordWrap: "break-word" }}
        />
        {/* <Column field="job_pattern" header="Job Pattern" style={{ width: '10%', wordWrap: 'break-word' }} /> */}
        {/* <Column field="schedule_mode_text" header="Schedule Mode" style={{ width: '5%', textAlign: 'center', wordWrap: 'break-word' }} /> */}
        <Column
          field="schedule_type"
          header="Schedule Type"
          style={{ width: "8%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          field="start_dtm"
          header="Start Date"
          body={(e) => formatDate(e, true, "start_dtm")}
          style={{ width: "8%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          field="next_run_time"
          header="Next Run Time"
          body={(e) => formatDate(e, true, "next_run_time")}
          style={{ width: "8%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          header="แก้ไข Next Run Time"
          body={actionBodyEditNextTime}
          style={{ width: "6%" }}
        ></Column>
        <Column
          field="last_run_time"
          header="Last Run Time"
          body={(e) => formatDate(e, true, "last_run_time")}
          style={{ width: "8%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          field="interval_minute"
          header="Interval Minute"
          style={{ width: "5%", wordWrap: "break-word", textAlign: "center" }}
        />
        <Column
          field="interval_day_of_week"
          header="Interval Day Of Week"
          style={{ width: "5%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          field="interval_day_of_month"
          header="Interval Day Of Month "
          style={{ width: "5%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          field="interval_month"
          header="Interval Month"
          style={{ width: "5%", wordWrap: "break-word" }}
        />
        <Column
          header="เปิด/ปิด การใช้งาน"
          body={actionOpenClose}
          style={{ width: "5%" }}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ width: "5%" }}
        ></Column>
        {/* <Column header="ลบ" body={actionBodyDelete} style={{ width: '3%' }}></Column> */}
      </DataTable>
    </div>
  );
}
