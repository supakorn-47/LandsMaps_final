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
import ADM05Card from "./ADM05Card";
export default function ADM05List({
  dataTable,
  setDialog,
  setDeleteDialog,
  returnStatus,
  onRowReorder,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-plus" />
        <Button
          label="เพิ่มประเภทข้อผิดพลาด"
          icon="pi pi-plus"
          onClick={() => setDialog({ formDialog: true, action: "เพิ่ม" })}
          className="p-button-rounded"
        />
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
            setDialog({ formDialog: true, action: "แก้ไข", data: rowData })
          }
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อ แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
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
    <>
      {/* <DataTable
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
                onRowReorder={onRowReorder}
                autoLayout
                rowHover
            >
                <Column rowReorder style={{ width: '5%', textAlign: 'center' }} />
                <Column field="index" header="ลำดับ" style={{ textAlign: 'center', width: '6%' }}></Column>
                <Column field="error_type_name" header="ประเภทข้อผิดพลาด" ></Column>
                <Column field="error_type_desc" header="รายละเอียด" ></Column>
                <Column sortable header="สถานะ" body={(e) => returnStatus(e, 'record_status')} style={{ textAlign: 'center', width: '8%' }} ></Column>
                <Column header="แก้ไข" body={actionBodyEdit} style={{ textAlign: 'center', width: '6%' }} ></Column>
                <Column header="ยกเลิก" body={actionBodyDelete} style={{ textAlign: 'center', width: '6%' }} ></Column>
                <Column header="ลบ" body={actionBodyDeleteRow} style={{ width: '6%' }} />
            </DataTable> */}
      <ADM05Card />
    </>
  );
}
