import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { formatDateTH } from "../../../utils/DateUtil";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";

export default function DMS05List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onRunProcessCkick,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <div className="header-left" style={{ marginBottom: "20px" }}>
        <Button
          label="เพิ่มเงื่อนไขการดึงข้อมูลแปลงที่ดิน"
          icon="pi pi-plus"
          onClick={() =>
            setDialog({ dialog: true, action: "SAVE", count: dataTable.length })
          }
          className="p-button-info p-button-rounded"
        />
      </div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหา"
            className="modern-search-input"
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    </div>
  );

  // แก้ไข
  const actionBodyEdit = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({ dialog: true, action: "UPDATE", data: rowData })
          }
          icon="pi pi-pencil"
          className="modern-edit-button"
          tooltip="คลิกเพื่อ แก้ไข"
          tooltipOptions={{ position: "top" }}
          disabled={rowData["process_status"] === 1 ? true : false}
        />
      </div>
    );
  };

  // run
  const actionRun = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-play"
          className="modern-add-button"
          onClick={() => onRunProcessCkick(rowData)}
          tooltip="คลิกเพื่อ Run"
          tooltipOptions={{ position: "top" }}
          disabled={rowData["process_status"] !== 0 ? true : false}
        />
      </>
    );
  };

  // สถานะ
  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          className={datavalue == "N" ? "status-active" : "status-inactive"}
        >
          {datavalue == "N" ? "ใช้งาน" : "ยกเลิก"}
        </span>
      </>
    );
  };

  const formatDate = (data, key) => {
    return <>{formatDateTH(data[key], true)}</>;
  };

  return (
    <div className="modern-table-container">
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
        className="modern-datatable"
      >
        <Column
          field="order_no"
          header="ลำดับ"
          style={{ width: "4rem", textAlign: "center" }}
        ></Column>
        <Column
          field="transfer_condition_dtm"
          header="วันเวลา"
          body={(e) => formatDate(e, "transfer_condition_dtm")}
          style={{ width: "6rem", textAlign: "center" }}
        ></Column>
        <Column
          field="source_name"
          header="แหล่งข้อมูล"
          headerStyle={{ width: 270 }}
        ></Column>
        <Column
          field="source_schema"
          header="Schema"
          headerStyle={{ width: 100 }}
        ></Column>
        <Column
          field="source_table"
          header="Table"
          headerStyle={{ width: 150 }}
        ></Column>
        <Column field="condition" header="เงื่อนไข"></Column>
        <Column
          field="record_status"
          header="สถานะ"
          headerStyle={{ width: "6rem" }}
          style={{ textAlign: "center" }}
          body={(e) => returnStatus(e, "record_status")}
        ></Column>
        <Column
          header="Run"
          body={actionRun}
          style={{ textAlign: "center", width: "4rem" }}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: "4rem" }}
        ></Column>
      </DataTable>
    </div>
  );
}
