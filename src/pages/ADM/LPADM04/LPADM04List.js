import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH2 } from "../../../utils/DateUtil";

export default function LPADM04List({ dataTable, setDialog }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  // Header รวมปุ่ม + search
  const header = (
    <div
      className="table-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="header-left">
        <Button
          className="p-button-rounded p-button-info"
          label="เพิ่มแบบสำรวจความพึงพอใจ"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialog: true, action: "เพิ่ม", data: null })}
        />
      </div>
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

  const actionBodyApprove = (rowData) => (
    <div style={{ textAlign: "center" }}>
      <Button
        onClick={() => setDialog({ dialog: true, action: "แก้ไข", data: rowData })}
        icon="pi pi-info"
        className="p-button-rounded p-button-info"
        tooltip="คลิกเพื่อ ดูรายละเอียด"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  const returnStatus = (rowData, checkColumn) => {
    let datavalue = rowData[checkColumn];
    return (
      <span
        style={{
          background: datavalue === "สำเร็จ" ? "#c8e6c9" : "#ffcdd2",
          color: datavalue === "สำเร็จ" ? "#256029" : "#c63737",
          borderRadius: "10px",
          padding: ".25em .5rem",
          textTransform: "uppercase",
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: ".3px",
        }}
      >
        {datavalue === "สำเร็จ" ? "สำเร็จ" : "ไม่สำเร็จ"}
      </span>
    );
  };

  const stringComma = (text) => {
    if (text === null || text === undefined) return "";
    return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <DataTable
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
      rowHover
      scrollable
      scrollDirection="horizontal"
    >
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 80 }}
      />
      <Column
        field="logStartDtm"
        header="เวลาเริ่ม"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => (e.logStartDtm ? formatDateTH2(e.logStartDtm, true) : "")}
      />
      <Column
        field="logEndDtm"
        header="เวลาสิ้นสุด"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => (e.logEndDtm ? formatDateTH2(e.logEndDtm, true) : "")}
      />
      <Column
        field="scheduleMode"
        header="ประเภทการถ่ายโอน"
        headerStyle={{ textAlign: "center", width: 200 }}
        bodyStyle={{ textAlign: "center" }}
      />
      <Column
        field="sourceName"
        header="แหล่งข้อมูลต้นทาง"
        style={{ wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="sourceSchema"
        header="Schema"
        style={{ wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="transferDataGroupName"
        header="กลุ่มตาราง"
        style={{ wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="targetName"
        header="แหล่งข้อมูลปลายทาง"
        style={{ wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="totalRecord"
        header="จำนวนข้อมูล"
        style={{ textAlign: "right", width: 200 }}
        body={(e) => stringComma(e.totalRecord)}
      />
      <Column
        field="transferProcessStatus"
        header="สถานะ"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => returnStatus(e, "transferProcessStatus")}
      />
      <Column
        header="รายละเอียด"
        body={actionBodyApprove}
        style={{ width: 80 }}
      />
    </DataTable>
  );
};
