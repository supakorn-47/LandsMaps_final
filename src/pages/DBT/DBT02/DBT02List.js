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

export default function DBT02List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onTransferStatusChange,
  onGetJobFileDataList,
}) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-plus" />
        <Button
          label="เพิ่มตารางข้อมูลถ่ายโอน"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialogAdd: true, action: "บันทึก" })}
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
          tooltip="คลิกเพื่อ ลบ"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  // แสดง Job File
  const actionViewJob = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-list"
          className="p-button-rounded p-button-info p-mr-2 "
          onClick={() => setDialog({ dialogView: true, data: rowData })}
          tooltip="คลิกเพื่อ แสดง job file"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  // สถานะ
  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: datavalue === "N" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue === "N" ? "#256029" : "#c63737",
            ...styleSpan,
          }}
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
          onChange={(e) => onTransferStatusChange(rowData, e.value)}
          tooltip="คลิกเพื่อ เปิด/ปิด ถ่ายโอน"
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
          field="index"
          header="ลำดับ"
          sortable
          style={{ width: "3%", textAlign: "center" }}
        ></Column>
        <Column
          field="source_name"
          header="แหล่งข้อมูล"
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="transfer_data_group_name"
          header="กลุ่มตาราง"
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="transfer_data_group_seq"
          header="ลำดับภายในกลุ่มตาราง"
          style={{ width: "5%", textAlign: "center" }}
          sortable
        ></Column>
        <Column
          field="source_process"
          header="แหล่งข้อมูลต้นทาง"
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="source_schema"
          header="Schema ต้นทาง"
          style={{ width: "5%" }}
          sortable
        ></Column>
        <Column
          field="source_table"
          header="ตารางต้นทาง"
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="target_process"
          header="แหล่งข้อมูลปลายทาง"
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="target_schema"
          header="Schema ปลายทาง"
          style={{ wordWrap: "break-word", width: "5%" }}
          sortable
        ></Column>
        <Column
          field="target_table"
          header="ตารางปลายทาง"
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="transfer_type"
          header="ประเภทการถ่ายโอน"
          style={{ textAlign: "center", width: "4.5%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="record_status"
          header="สถานะ"
          body={(e) => returnStatus(e, "record_status")}
          style={{ textAlign: "center", width: "5.4%" }}
        ></Column>
        <Column
          field="transfer_status"
          header="เปิด-ปิด ถ่ายโอน"
          body={actionOpenClose}
          style={{ textAlign: "center", width: "4%" }}
        ></Column>
        <Column
          field=""
          header="แสดง Job File"
          body={actionViewJob}
          style={{ textAlign: "center", width: "4%" }}
        ></Column>
        <Column
          field=""
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: "4%" }}
        ></Column>
        {/* <Column field="" header="ยกเลิก" body={actionBodyDelete} style={{ textAlign: 'center', width: '4rem' }} ></Column> */}
      </DataTable>
    </div>
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
