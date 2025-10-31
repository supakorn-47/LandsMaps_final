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

export default function ADM03List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onServiceStatusChange,
  onGetServiceReqAndRes,
  onRowReorders,
  onUpdateServicePublic,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-plus" />
        <Button
          label="เพิ่มข้อมูลการให้บริการ Service"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialogAdd: true, action: "บันทึก" })}
          className="p-button-info p-button-rounded"
        />
        {/* <Button label="Manage API Gateway" icon="pi pi-cog" onClick={() => onClickAPI()} className="p-button-info p-button-rounded" style={{ marginLeft: 5 }} /> */}
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

  const onClickAPI = (API) => {
    let a = document.createElement("a");
    a.href = "http://172.16.43.127:31125/login";
    a.target = "_blank";
    a.click();
  };

  const actionBodyRequest = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onGetServiceReqAndRes("Request", rowData, true)}
          icon="pi pi-sign-in"
          className="p-button-rounded p-button-info"
          tooltip="คลิกเพื่อดู Request"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyResponse = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onGetServiceReqAndRes("Response", rowData, true)}
          icon="pi pi-sign-out"
          className="p-button-rounded p-button-success"
          tooltip="คลิกเพื่อดู Response"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

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

  // เผยเพร่
  const actionBodyPublic = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <InputSwitch
          checked={rowData.public_flag === "0" ? false : true}
          onChange={(e) => onUpdateServicePublic(rowData, e.value)}
          tooltip="คลิกเพื่อ เปิด/ปิด เผยแพร่ Service"
          tooltipOptions={{ position: "left" }}
        />
      </div>
    );
  };

  const actionView = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-list"
          className="p-button-rounded p-button-info p-mr-2 "
          onClick={() => console.log(`object`)}
          tooltip="แสดง job file"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue == "N" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == "N" ? "#256029" : "#c63737",
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {datavalue == "N" ? "ใช้งาน" : "ไม่ใช้งาน"}
        </span>
      </>
    );
  };

  // เปิด-ปิด Service
  const actionOpenClose = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <InputSwitch
          checked={rowData.use_flag === "0" ? false : true}
          onChange={(e) => onServiceStatusChange(rowData, e.value)}
          tooltip="คลิกเพื่อ เปิด/ปิด Service"
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
        onRowReorder={onRowReorders}
        // autoLayout
        rowHover
      >
        <Column rowReorder style={{ width: "5%", textAlign: "center" }} />
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        <Column
          sortable
          field="department_name"
          header="หน่วยงาน"
          style={{ width: "8%", wordWrap: "break-word" }}
        ></Column>
        <Column
          sortable
          field="service_name"
          header="ServiceName"
          headerStyle={{ width: "16%" }}
        ></Column>
        {/* <Column field="service_protocol" header="Protocal" style={{ width: '8%', wordWrap: 'break-word' }}></Column> */}
        <Column
          field="service_path"
          header="Path"
          headerStyle={{ width: "16%" }}
          bodyStyle={{ wordWrap: "break-word" }}
        ></Column>
        {/* <Column field="service_param" header="Parameter" style={{ width: '8%' }}></Column> */}
        {/* <Column field="service_method" header="Method" style={{ textAlign: 'center', width: '5%' }}></Column> */}
        <Column
          sortable
          field="service_type"
          header="ประเภท Service"
          style={{ textAlign: "center", width: "8%", wordWrap: "break-word" }}
        ></Column>
        <Column
          sortable
          field="service_data_type"
          header="ประเภทข้อมูล"
          style={{ textAlign: "center", width: "8%", wordWrap: "break-word" }}
        ></Column>
        <Column
          sortable
          header="สถานะ"
          style={{ textAlign: "center", width: "8%" }}
          body={(e) => returnStatus(e, "record_status")}
        ></Column>
        <Column
          field="use_flag"
          header="เปิด-ปิด Service"
          body={actionOpenClose}
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
        <Column
          header="Request"
          body={actionBodyRequest}
          style={{ textAlign: "center", width: "6%" }}
        ></Column>
        <Column
          header="Response"
          body={actionBodyResponse}
          style={{ textAlign: "center", width: "7%" }}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: "6%" }}
        ></Column>
        <Column
          header="เผยแพร่"
          body={actionBodyPublic}
          style={{ textAlign: "center", width: "6%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
