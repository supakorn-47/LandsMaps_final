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

export default function DBT04List({ dataTable, onRunProcessClick }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <div></div>
      <span className="p-input-icon-left  ">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="ค้นหา"
          style={{ height: "38px", width: 400 }}
        />
      </span>
    </div>
  );

  const actionRunAll = (rowData) => {
    return (
      <>
        <Button
          onClick={() => onRunProcessClick(rowData, 1)}
          icon="pi pi-play"
          className="p-button-rounded"
          tooltip="คลิกเพื่อ ดึงข้อมูลทั้งหมด"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  const actionRunIncremental = (rowData) => {
    if (rowData["source_seq"] === 1) return "";

    return (
      <>
        <Button
          onClick={() => onRunProcessClick(rowData, 2)}
          icon="pi pi-play"
          className="p-button-rounded"
          tooltip="คลิกเพื่อ ดึงข้อมูลเปลี่ยนแปลง"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  return (
    <div>
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
      >
        <Column
          field="index"
          header="ลำดับ"
          sortable
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        <Column field="source_name" header="แหล่งข้อมูล"></Column>
        <Column
          field=""
          header="ดึงข้อมูลทั้งหมด"
          body={actionRunAll}
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
        <Column
          field=""
          header="ดึงข้อมูลเปลี่ยนแปลง"
          body={actionRunIncremental}
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
