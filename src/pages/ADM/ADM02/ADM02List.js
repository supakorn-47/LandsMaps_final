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

export default function ADM02List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onRowReorder,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-plus" />
        <Button
          label="เพิ่มข้อมูลหน่วยงาน"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialog: true, action: "บันทึก" })}
          className="p-button-rounded p-button-info"
        />
        {/* <Button label="Manage API Gateway (Exchange)" icon="pi pi-cog" onClick={() => onClickAPI()} className="p-button-info p-button-rounded" style={{ marginLeft: 5 }} /> */}
      </span>

      <span className="p-input-icon-left">
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
        <div style={{ textAlign: "center" }}>
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
          tooltip="คลิกเพื่อยกเลิก"
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
    <div>
      <DataTable
        value={dataTable}
        dataKey="department_seq"
        paginator
        rows={10}
        rowsPerPageOptions={rowsPerPageOptions()}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header}
        globalFilter={globalFilter}
        onRowReorder={onRowReorder}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        autoLayout
        rowHover
      >
        <Column rowReorder style={{ width: "3%", textAlign: "center" }} />
        <Column
          field="department_ord"
          header="ลำดับ"
          style={{ textAlign: "center", width: "6%" }}
        ></Column>
        <Column
          field="department_name_th"
          header="หน่วยงาน (ภาษาไทย)"
          headerStyle={{ width: "25%", textAlign: "left" }}
        ></Column>
        <Column
          field="department_name_en"
          header="หน่วยงาน (ภาษาอังกฤษ)"
          headerStyle={{ width: "25%", textAlign: "left" }}
        ></Column>
        {/* <Column sortable field="register_type_name" header="กลุ่มผู้ใช้" style={{ textAlign: 'center', width: '15%' }}></Column> */}
        <Column
          sortable
          header="สถานะ"
          body={renderStatus}
          style={{ textAlign: "center", width: "10%" }}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: "6%" }}
        ></Column>
        <Column
          header="ยกเลิก"
          body={actionBodyDelete}
          style={{ textAlign: "center", width: "6%" }}
        ></Column>
        <Column
          header="ลบ"
          body={actionBodyDeleteRow}
          style={{ width: "6%" }}
        />
      </DataTable>
    </div>
  );
}
