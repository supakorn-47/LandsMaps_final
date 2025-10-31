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
import "./ADM01List.css";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function ADM01List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onRowReorder,
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
          label="เพิ่มกลุ่มผู้ใช้งาน"
          icon="pi pi-plus"
          onClick={() =>
            setDialog({ dialog: true, action: "บันทึก", data: null })
          }
          className="p-button-rounded p-button-info"
        />
      </div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหาข้อมูล..."
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
          tooltip="แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
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
          tooltip="ยกเลิก"
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
      dataKey="register_type_seq"
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
      onRowReorder={onRowReorder}
      // className="p-datatable-responsive-demo"
      rowHover
      scrollable
      scrollDirection="horizontal"
    >
      <Column
        rowReorder
        style={{ width: 56, textAlign: "center" }}
        className="reorder-column"
      />
      <Column
        field="register_type_ord"
        header="ลำดับ"
        style={{ textAlign: "center", width: 80 }}
        className="order-column"
      />
      <Column
        field="register_type_name"
        header="ชื่อกลุ่มผู้ใช้งาน"
        headerStyle={{ textAlign: "left", width: 300 }}
        className="name-column"
      />
      <Column
        field="remark"
        header="หมายเหตุ"
        headerStyle={{ textAlign: "left", minWidth: 300 }}
        className="remark-column"
      />
      <Column
        field="record_status"
        header="สถานะ"
        body={renderStatus}
        style={{ textAlign: "center", width: 100 }}
        className="status-column"
      />
      <Column
        header="แก้ไข"
        body={actionBodyEdit}
        style={{ width: 80 }}
        className="edit-column"
      />
      <Column
        header="ยกเลิก"
        body={actionBodyDelete}
        style={{ width: 80 }}
        className="cancel-column"
      />
    </DataTable>
  );
}
