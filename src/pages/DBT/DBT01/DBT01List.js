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

export default function DBT01List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onStatusChange,
}) {
  let styleSpan = useStyleSpan();

  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <Button
          label="เพิ่มแหล่งข้อมูลถ่ายโอน"
          icon="pi pi-plus"
          onClick={() =>
            setDialog({
              dialogAdd: true,
              action: "SAVE",
              count: dataTable.length,
            })
          }
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

  // แก้ไข
  const actionBodyEdit = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({ dialogUpdate: true, action: "UPDATE", data: rowData })
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
          onClick={() => setDeleteDialog({ open: true, data: rowData })}
          style={{ marginLeft: 5 }}
          icon="pi pi-ban"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อ ยกเลิก"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const returnStatusTr = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue === "NORMAL" ? "#006400" : "#0000FF",
            color: datavalue === "NORMAL" ? "#FFF" : "#FFF",
            ...styleSpan,
          }}
        >
          {datavalue}
        </span>
      </>
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
          sortable
          field="source_ord"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        <Column
          sortable
          field="source_name"
          header="แหล่งข้อมูล"
          style={{ width: "16%", wordWrap: "break-word" }}
        ></Column>
        <Column
          sortable
          field="source_process"
          header="Source Process"
          style={{ width: "10%" }}
        ></Column>
        <Column
          sortable
          field="source_host"
          header="Host"
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
        <Column
          sortable
          field="source_port"
          header="Port"
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        <Column
          sortable
          field="database_type"
          header="Database Type"
          style={{ width: "9%" }}
        ></Column>
        <Column
          sortable
          field="source_service_name"
          header="Service Name"
          style={{ width: "9%" }}
        ></Column>
        <Column
          sortable
          field="user_name"
          header="User Name"
          style={{ width: "9%" }}
        ></Column>
        <Column
          sortable
          field="password"
          header="Password"
          style={{ width: "9%" }}
        ></Column>
        <Column
          sortable
          field="transfer_process"
          header="สถานะการถ่ายโอน"
          style={{ textAlign: "center", width: "8%" }}
          body={(e) => returnStatusTr(e, "transfer_process")}
        ></Column>
        <Column
          field="record_status"
          header="เปิด-ปิดการใช้งาน"
          style={{ textAlign: "center", width: "5%" }}
          body={(e) => actionOpenClose(e, "record_status")}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        {/* <Column header="ยกเลิก" body={actionBodyDelete} style={{ textAlign: 'center', width: '5%' }} ></Column> */}
      </DataTable>
    </div>
  );
}
function useStyleSpan() {
  return {
    borderRadius: "10px",
    padding: ".25em .5rem",
    // textTransform: 'uppercase',
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: ".3px",
  };
}
