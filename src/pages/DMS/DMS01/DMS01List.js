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
import { StringToStar } from "../../../utils/StringUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function DMS01List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onStatusChange,
}) {
  let styleSpan = useStyleSpan();

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
          label="เพิ่มแหล่งข้อมูลถ่ายโอน"
          icon="pi pi-plus"
          onClick={() =>
            setDialog({ dialog: true, action: "SAVE", count: dataTable.length })
          }
          className="p-button-rounded p-button-info"
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

  // แก้ไข
  const actionBodyEdit = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() =>
            setDialog({ dialog: true, action: "UPDATE", data: rowData })
          }
          icon="pi pi-pencil"
          //   className="modern-edit-button"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อ แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyDelete = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() => setDeleteDialog({ open: true, data: rowData })}
          icon="pi pi-ban"
          className="modern-delete-button"
          tooltip="คลิกเพื่อ ยกเลิก"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  // NORMAL PROCESS
  const returnStatusTr = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <div className="status-badge">
        <span
          className={`status-indicator ${
            datavalue === 1 ? "status-active" : "status-inactive"
          }`}
        >
          {datavalue === 1 ? "NORMAL" : "PROCESS"}
        </span>
      </div>
    );
  };

  // NORMAL PROCESS
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
        autoLayout
        rowHover
        className="p-datatable-responsive-demo"
        // className="p-datatable-responsive-demo"
        // paginatorClassName="modern-paginator"
        scrollable
        scrollDirection="horizontal"
      >
        <Column
          field="source_ord"
          header="ลำดับ"
          className="order-column"
          style={{ width: 80 }}
        ></Column>
        <Column
          field="source_name"
          header="แหล่งข้อมูล"
          className="name-column"
          style={{ width: 200 }}
        ></Column>
        {/* <Column  field="source_process" header="Source Process" style={{ width: '10%' }}></Column> */}
        <Column
          field="source_host"
          header="Host"
          className="name-column"
          style={{ textAlign: "left", width: 200 }}
        ></Column>
        <Column
          field="source_port"
          header="Port"
          className="order-column"
          style={{ width: 150 }}
        ></Column>
        <Column
          field="database_type"
          header="Database Type"
          className="type-column"
          style={{ textAlign: "center", width: 150 }}
        ></Column>
        <Column
          field="source_service_name"
          header="Service Name"
          className="name-column"
          style={{ width: 200 }}
        ></Column>
        <Column
          field="user_name"
          header="User Name"
          className="name-column"
          style={{ width: 200 }}
        ></Column>
        <Column
          field="password"
          header="Password"
          className="name-column"
          style={{ width: 200 }}
          body={(e) => StringToStar(e?.password)}
        ></Column>
        {/* <Column field="transfer_process" header="สถานะการถ่ายโอน" style={{ textAlign: 'center', width: '8%' }} body={(e) => returnStatusTr(e, 'transfer_process')}></Column> */}
        <Column
          field="source_process"
          header="ประเภทเเหล่งข้อมูล"
          style={{ textAlign: "center", width: 200 }}
          body={(e) => returnTypeTr(e, "source_process")}
        ></Column>
        <Column
          field="record_status"
          header="เปิด-ปิดการใช้งาน"
          style={{ textAlign: "center", width: 150 }}
          body={(e) => actionOpenClose(e, "record_status")}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: 80 }}
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
