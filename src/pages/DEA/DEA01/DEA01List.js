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

export default function DEA01List({
  dataTable,
  setDialog,
  setDeleteDialog,
  configService,
  configToken,
  returnStatus,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-plus" />
        <Button
          label="เพิ่มข้อมูลหน่วยงาน"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialogAdd: true, action: "บันทึก" })}
          className="p-button-info p-button-rounded"
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

  const onClickAPI = (API) => {
    let a = document.createElement("a");
    a.href = "http://172.16.43.127:31125/login";
    a.target = "_blank";
    a.click();
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
          disabled={rowData.record_status === "C"}
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

  const actionView = (rowData) => {
    return (
      <>
        <Button
          disabled={rowData.record_status === "C"}
          icon="pi pi-cog"
          className="p-button-rounded p-button-info p-mr-2 "
          onClick={() => configService(rowData)}
          tooltip="คลิกเพื่อ กำหนด Service"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  const actionToken = (rowData) => {
    return (
      <>
        <Button
          disabled={rowData.record_status === "C"}
          icon="pi pi-unlock"
          className="p-button-rounded p-button-success p-mr-2 "
          onClick={() => configToken(rowData)}
          tooltip="คลิกเพื่อ กำหนด Token"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  const renderTypeName = (rowData) => {
    if (rowData.department_type === undefined) return;
    let arr = [
      { label: "รับข้อมูล", value: "1" },
      { label: "ส่งข้อมูล", value: "2" },
      { label: "รับ-ส่งข้อมูล", value: "3" },
    ];
    let result = "";
    arr.forEach((element) => {
      if (element.value === rowData.department_type) {
        result = element.label;
      }
    });
    return result;
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
        autoLayout
        rowHover
      >
        <Column
          field="inDEA"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        <Column field="department_name_th" header="หน่วยงาน (ภาษาไทย)"></Column>
        <Column
          field="department_name_en"
          header="หน่วยงาน (ภาษาอังกฤษ)"
        ></Column>
        <Column field="remark" header="หมายเหตุ"></Column>
        {/* <Column field="consumer_username" header="Consumer Username" style={{ wordWrap: 'break-word', width: '10%' }}></Column>
                <Column field="custom_id" header="Custom Id" style={{ wordWrap: 'break-word', width: '10%' }}></Column> */}
        <Column
          field="department_type"
          header="ประเภทแลกเปลี่ยน"
          body={(e) => renderTypeName(e)}
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
        <Column
          header="สถานะ"
          body={(e) => returnStatus(e, "record_status")}
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
        {/* <Column field="department_type" header="เปิด-ปิด สถานะ" body={actionOpenClose} style={{ textAlign: 'center', width: '100px' }} ></Column> */}
        <Column
          header="กำหนด Service"
          body={actionView}
          style={{ textAlign: "center", width: "8%" }}
        ></Column>
        {/* <Column header="กำหนด Token" body={actionToken} style={{ textAlign: 'center', width: '7%' }}></Column> */}
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
      </DataTable>
    </div>
  );
}
