import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";

export default function DMS04List({ dataTable, onGetAllClick }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <div className="header-left"></div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา"
          />
        </span>
      </div>
    </div>
  );

  const actionRunAll = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          // disabled={rowData.transfer_process !== "0"}
          onClick={() => onGetAllClick(rowData, 1)}
          icon="pi pi-play"
          className="modern-add-button"
          tooltip="คลิกเพื่อ ดึงข้อมูลทั้งหมด"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionRunIncremental = (rowData) => {
    if (rowData["source_seq"] === 1) return "";

    return (
      <div className="action-buttons">
        <Button
          // disabled={rowData.transfer_process !== "0"}
          onClick={() => onGetAllClick(rowData, 2)}
          icon="pi pi-play"
          className="modern-add-button"
          tooltip="คลิกเพื่อ ดึงข้อมูลเปลี่ยนแปลง"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const returnTypeTr = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];

    let text = "";
    let statusClass = "";
    if (datavalue === "1") {
      text = "SOURCE";
      statusClass = "status-active";
    } else if (datavalue === "2") {
      text = "PROCESS";
      statusClass = "status-inactive";
    } else if (datavalue === "3") {
      text = "TARGET";
      statusClass = "status-active";
    }
    return (
      <div className="status-badge">
        <span className={`status-indicator ${statusClass}`}>{text}</span>
      </div>
    );
  };

  return (
    <DataTable
      value={dataTable}
      // paginator
      // rows={10}
      // rowsPerPageOptions={rowsPerPageOptions()}
      // paginatorTemplate={paginatorTemplate()}
      // currentPageReportTemplate={currentPageReportTemplate()}
      header={header}
      globalFilter={globalFilter}
      emptyMessage="ไม่พบข้อมูลที่ค้นหา"
      autoLayout
      rowHover
      //   className="p-datatable-responsive-demo"
      scrollable
      scrollDirection="horizontal"
    >
      <Column
        field="index"
        header="ลำดับ"
        className="order-column"
        style={{ width: 80 }}
      ></Column>
      <Column
        field="source_name"
        header="แหล่งข้อมูล"
        className="name-column"
        style={{ width: 300 }}
      ></Column>
      <Column
        field="source_process"
        header="ประเภทเเหล่งข้อมูล"
        style={{ textAlign: "center", width: 200 }}
        body={(e) => returnTypeTr(e, "source_process")}
      ></Column>
      <Column
        field="source_host"
        header="Host"
        className="name-column"
        style={{ width: 300 }}
      ></Column>
      <Column
        field="database_type"
        header="Database Type"
        className="type-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field=""
        header="ดึงข้อมูลทั้งหมด"
        body={actionRunAll}
        style={{ textAlign: "center", width: 100 }}
      ></Column>
      <Column
        field=""
        header="ดึงข้อมูลเปลี่ยนแปลง"
        body={actionRunIncremental}
        style={{ textAlign: "center", width: 100 }}
      ></Column>
    </DataTable>
  );
}
