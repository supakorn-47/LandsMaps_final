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
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function DBT05List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onRunProcessCkick,
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

  // const header = (
  //     <div className="table-header">
  //         <span className="p-input-icon-left">
  //             <i className="pi pi-search" />
  //             <Button label="เพิ่มเงื่อนไขการดึงข้อมูลแปลงที่ดิน" icon="pi pi-plus" onClick={() => setDialog({ dialog: true, action: 'SAVE', count: dataTable.length })} className="p-button-rounded p-button-info" />
  //         </span>
  //         <span className="p-input-icon-left">
  //             <i className="pi pi-search" />
  //             <InputText type="search" placeholder="ค้นหา" style={{ height: '38px', width: 400 }} onInput={(e) => setGlobalFilter(e.target.value)} />
  //         </span>
  //     </div>
  // );

  const header = (
    <div className="table-header">
      <div className="header-left">
        <Button
          label="เพิ่มแหล่งข้อมูลถ่ายโอน"
          icon="pi pi-plus"
          onClick={() =>
            setDialog({
              dialog: true,
              action: "SAVE",
              title: "เพิ่มเงื่อนไขการดึงข้อมูลแปลงที่ดิน",
            })
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
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({ dialog: true, action: "UPDATE", data: rowData })
          }
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
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
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => onRunProcessCkick(rowData)}
          tooltip="คลิกเพื่อ Run"
          tooltipOptions={{ position: "top" }}
          disabled={rowData["process_status"] === 1 ? true : false}
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
          style={{
            background: datavalue == "N" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == "N" ? "#256029" : "#c63737",
            ...styleSpan,
          }}
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
      className="p-datatable-responsive-demo"
      scrollable
      scrollDirection="horizontal"
    >
      <Column
        sortable
        field="order_no"
        header="ลำดับ"
        style={{ width: 100, textAlign: "center" }}
      ></Column>
      <Column
        sortable
        field="transfer_condition_dtm"
        header="วันเวลา"
        body={(e) => formatDate(e, "transfer_condition_dtm")}
        style={{ width: 150, textAlign: "center" }}
      ></Column>
      <Column
        sortable
        field="source_name"
        header="แหล่งข้อมูล"
        style={{ width: 270 }}
      ></Column>
      <Column
        sortable
        field="source_schema"
        header="Schema"
        style={{ width: 200 }}
      ></Column>
      <Column
        sortable
        field="source_table"
        header="Table"
        style={{ width: 150 }}
      ></Column>
      <Column
        sortable
        field="condition"
        header="เงื่อนไข"
        style={{ width: 300 }}
      ></Column>
      <Column
        sortable
        field="record_status"
        header="สถานะ"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => returnStatus(e, "record_status")}
      ></Column>
      <Column
        header="Run"
        body={actionRun}
        style={{ textAlign: "center", width: 80 }}
      ></Column>
      <Column
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
