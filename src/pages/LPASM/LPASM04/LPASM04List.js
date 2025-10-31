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

export default function LPASM04List({
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
          label="เพิ่ม Status Code"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialog: true, action: "บันทึก" })}
          className="p-button-rounded p-button-info"
        />
        {/* <Button label="Manage API Gateway (Exchange)" icon="pi pi-cog" onClick={() => onClickAPI()} className="p-button-info p-button-rounded" style={{ marginLeft: 5 }} /> */}
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

  const actionBodyEdit = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({ dialog: true, action: "แก้ไข", data: rowData })
          }
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
        <div style={{ textAlign: "center", textWrap: "nowrap" }}>
          <span
            style={{
              background: record_status === "N" ? "#c8e6c9" : "#ffcdd2",
              color: record_status === "N" ? "#256029" : "#c63737",
              borderRadius: "10px",
              padding: ".25em .5rem",
              textTransform: "uppercase",
              fontWeight: "700",
              fontSize: "13px",
              letterSpacing: ".3px",
            }}
          >
            {record_status === "N" ? "ใช้งาน" : "ไม่ใช้งาน"}
          </span>
        </div>
      );
    }
  };

  const actionBodyDelete = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
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
          style={{ marginLeft: 5 }}
          icon="pi pi-ban"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อ ยกเลิก"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyDeleteRow = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDeleteDialog({
              open: true,
              data: rowData,
              record_status: "D",
              textConfirm: "คุณต้องการลบข้อมูล ใช่หรือไม่?",
            })
          }
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
    <DataTable
      value={dataTable}
      dataKey="status_code_seq"
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
      onRowReorder={onRowReorder}
      // autoLayout
      rowHover
      // className="modern-datatable"
      scrollable
      scrollDirection="horizontal"
      // style={{ minWidth: "100%" }}
    >
      <Column rowReorder style={{ width: 56, textAlign: "center" }} />
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 100 }}
      ></Column>
      <Column
        field="status_code"
        header="รหัส Status Code"
        headerStyle={{ width: 150, textAlign: "left" }}
      ></Column>
      <Column
        field="status_name_th"
        header=" ชื่อสถานะข้อมูลตอบกลับ (ภาษาไทย)"
        headerStyle={{ textAlign: "left", width: 300 }}
      ></Column>
      <Column
        field="status_name_en"
        header="ชื่อสถานะข้อมูลตอบกลับ (ภาษาอังกฤษ)"
        headerStyle={{ textAlign: "left", width: 300 }}
      ></Column>
      <Column
        sortable
        header="สถานะ"
        body={renderStatus}
        style={{ textAlign: "center", width: 150 }}
      ></Column>
      <Column
        header="แก้ไข"
        body={actionBodyEdit}
        style={{ textAlign: "center", width: 80 }}
      ></Column>
      <Column
        header="ยกเลิก"
        body={actionBodyDelete}
        style={{ textAlign: "center", width: 80 }}
      ></Column>
      <Column header="ลบ" body={actionBodyDeleteRow} style={{ width: 80 }} />
    </DataTable>
  );
}
