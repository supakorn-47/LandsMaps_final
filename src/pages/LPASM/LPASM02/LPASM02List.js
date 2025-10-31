import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import {
//   currentPageReportTemplate,
//   paginatorTemplate,
//   rowsPerPageOptions,
// } from "../../../utils/TableUtil";

import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPASM02List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onRowReorder,
  onSetRegisterLink,
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
      <div className="header-left">
        <Button
          label="เพิ่มข้อมูลหน่วยงาน"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialog: true, action: "บันทึก" })}
          className="p-button-info p-button-rounded"
        />
      </div>
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
          onClick={() =>
            setDialog({ dialog: true, action: "แก้ไข", data: rowData })
          }
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อแก้ไข"
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

  const actionBodyDelete = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          disabled={rowData.record_status === "C"}
          onClick={() =>
            setDeleteDialog({
              open: true,
              data: rowData,
              record_status: "C",
              textConfirm: "คุณต้องการยกเลิกข้อมูล ใช่หรือไม่?",
            })
          }
          icon="pi pi-ban"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อยกเลิก"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyDeleteRow = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() =>
            setDeleteDialog({
              open: true,
              data: rowData,
              record_status: "D",
              textConfirm: "คุณต้องการลบข้อมูล ใช่หรือไม่?",
            })
          }
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อลบ"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };
  const actionBodyLinkRow = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() => {
            onSetRegisterLink(rowData.department_seq);
          }}
          className="p-button-rounded"
          icon="pi pi-link"
          style={{ color: "white" }}
          tooltip="คลิกเพื่อคัดลอกลิงก์"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
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
      rows={rows}
      pageLinkSize={pageLinkSize}
      rowsPerPageOptions={rowsPerPageOptions}
      paginatorTemplate={paginatorTemplate}
      currentPageReportTemplate={currentPageReportTemplate}
      header={header}
      globalFilter={globalFilter}
      onRowReorder={onRowReorder}
      emptyMessage="ไม่พบข้อมูลที่ค้นหา"
      // autoLayout
      rowHover
      // className="modern-datatable"
      scrollable
      // scrollDirection="horizontal"
      // style={{ minWidth: "100%" }}
      // responsiveLayout="scroll"
    >
      <Column rowReorder style={{ width: 56, textAlign: "center" }} />
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
        header="ลิงก์"
        body={actionBodyLinkRow}
        className="action-column"
        style={{ width: 80 }}
      />
      <Column
        header="แก้ไข"
        body={actionBodyEdit}
        className="action-column"
        style={{ width: 80 }}
      />
      <Column
        header="ยกเลิก"
        body={actionBodyDelete}
        className="action-column"
        style={{ width: 80 }}
      />
      <Column
        header="ลบ"
        body={actionBodyDeleteRow}
        className="action-column"
        style={{ width: 80 }}
      />
    </DataTable>
  );
}
