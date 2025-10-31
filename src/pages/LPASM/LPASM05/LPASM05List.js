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
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPASM05List({
  dataTable,
  // onRowReorder,
  onEdit,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const header = (
    <div className="table-header">
      <div className="header-left"></div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหาข้อมูล..."
            // className="modern-search-input"
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    </div>
  );

  const actionBodyEdit = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() => onEdit(rowData.department_seq)}
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อ แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const renderStatus = (rowData) => {
    if (rowData.record_status !== undefined) {
      let record_status = rowData.record_status;
      return (
        <div className="status-badge">
          <span
            className={`status-indicator ${
              record_status === "N" ? "status-active" : "status-inactive"
            }`}
          >
            {record_status === "N" ? "ใช้งาน" : "ไม่ใช้งาน"}
          </span>
        </div>
      );
    }
  };

  return (
    <DataTable
      value={dataTable}
      dataKey="department_seq"
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
      // onRowReorder={onRowReorder}
      emptyMessage="ไม่พบข้อมูลที่ค้นหา"
      // autoLayout
      rowHover
      // className="modern-datatable"
      scrollable
      scrollDirection="horizontal"
      // style={{ minWidth: "100%" }}
    >
      {/* <Column rowReorder style={{ width: 56, textAlign: "center" }} /> */}
      <Column
        field="department_ord"
        header="ลำดับ"
        className="order-column"
        style={{ width: 80 }}
      />
      <Column
        field="department_name_th"
        header="หน่วยงาน (ภาษาไทย)"
        className="name-column"
        style={{ width: 300 }}
      />
      <Column
        field="department_name_en"
        header="หน่วยงาน (ภาษาอังกฤษ)"
        className="name-column"
        style={{ width: 300 }}
      />
      <Column
        header="สถานะ"
        body={renderStatus}
        className="status-column"
        style={{ width: 100 }}
      />
      <Column
        header="แก้ไข"
        body={actionBodyEdit}
        className="action-column"
        style={{ width: 80 }}
      />
    </DataTable>
  );
}
