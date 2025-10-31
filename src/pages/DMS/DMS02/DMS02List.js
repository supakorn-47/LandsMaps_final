import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
// import {
//   currentPageReportTemplate,
//   paginatorTemplate,
//   rowsPerPageOptions,
// } from "../../../utils/TableUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function DMS02List(props) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const headerList = () => {
    const onClick = () => {
      props.onGetMaster(1);
      props.setDialog({ dialog: true, action: "บันทึก" });
    };
    return (
      <div className="table-header">
        <div className="header-left">
          <Button
            label="เพิ่มตารางข้อมูลถ่ายโอน"
            icon="pi pi-plus"
            onClick={() => onClick()}
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
  };

  const actionBodyEdit = (rowData) => {
    const onClick = () => {
      props.onGetMaster(1);
      props.setDialog({ dialog: true, action: "แก้ไข", data: rowData });
    };
    return (
      <div className="action-buttons">
        <Button
          onClick={() => onClick()}
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
          onClick={() => props.setDeleteDialog({ open: true, data: rowData })}
          icon="pi pi-ban"
          className="modern-delete-button"
          tooltip="คลิกเพื่อ ลบ"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  // แสดง Job File
  const actionViewJob = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-list"
          className="modern-service-button"
          onClick={() => props.setDialog({ dialogView: true, data: rowData })}
          tooltip="คลิกเพื่อ แสดง job file"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  // สถานะ
  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <div className="status-badge">
        <span
          className={`status-indicator ${
            datavalue === "N" ? "status-active" : "status-inactive"
          }`}
        >
          {datavalue === "N" ? "ใช้งาน" : "ไม่ใช้งาน"}
        </span>
      </div>
    );
  };

  // เปิด-ปิด ถ่ายโอน
  const actionOpenClose = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <InputSwitch
          checked={rowData.transfer_status === 0 ? false : true}
          onChange={(e) => props.onTransferStatusChange(rowData, e.value)}
          tooltip="คลิกเพื่อ เปิด/ปิด ถ่ายโอน"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={props.dataTable}
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
      header={headerList()}
      globalFilter={globalFilter}
      emptyMessage="ไม่พบข้อมูลที่ค้นหา"
      autoLayout
      rowHover
      className="p-datatable-responsive-demo"
      paginatorClassName="modern-paginator"
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
        header="แหล่งข้อมูลต้นทาง"
        className="name-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field="source_schema"
        header="Schema ต้นทาง"
        className="name-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field="source_table"
        header="ตารางต้นทาง"
        className="name-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field="target_process"
        header="แหล่งข้อมูลปลายทาง"
        className="name-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field="target_schema"
        header="Schema ปลายทาง"
        className="name-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field="target_table"
        header="ตารางปลายทาง"
        className="name-column"
        style={{ width: 200 }}
      ></Column>
      <Column
        field="transfer_type"
        header="ประเภทการถ่ายโอน"
        className="type-column"
        style={{ textAlign: "center", width: 200 }}
      ></Column>
      <Column
        field="record_status"
        header="สถานะ"
        body={(e) => returnStatus(e, "record_status")}
        style={{ textAlign: "center", width: 150 }}
      ></Column>
      <Column
        field="transfer_status"
        header="เปิด-ปิด ถ่ายโอน"
        body={actionOpenClose}
        style={{ textAlign: "center", width: 150 }}
      ></Column>
      <Column
        field=""
        header="แก้ไข"
        body={actionBodyEdit}
        style={{ textAlign: "center", width: 80 }}
      ></Column>
    </DataTable>
  );
}

function useStyleSpan() {
  return {
    borderRadius: "10px",
    padding: ".25em .5rem",
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: ".3px",
  };
}
