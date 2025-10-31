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
import { formatDateTH, formatDateTH2 } from "../../../utils/DateUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function DBT06List({ dataTable }) {
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
      <div className="header-left"></div>
      <div className="header-right">
        <span className="p-input-icon-left  ">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา"
          />
        </span>
      </div>
    </div>
  );

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue == "สำเร็จ" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == "สำเร็จ" ? "#256029" : "#c63737",
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {datavalue == "สำเร็จ" ? "สำเร็จ" : "ไม่สำเร็จ"}
        </span>
      </>
    );
  };

  const formatDate = (data, key) => {
    return <>{formatDateTH2(data[key], true)}</>;
  };

  const numberWithCommas = (rowData) => {
    return (
      <div style={{ textAlign: "right" }}>
        {rowData.total_record.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    );
  };

  return (
    // <div className="modern-table-container">
    <DataTable
      value={dataTable}
      dataKey="id"
      paginator
      // rows={10}
      // rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
      responsiveLayout="scroll"
      autoLayout
    >
      <Column
        field="order_no"
        header="ลำดับ"
        style={{ minWidth: 80, maxWidth: 80, textAlign: "center" }}
      ></Column>
      <Column
        field="log_start_dtm"
        header="วันเวลาเริ่มต้น"
        body={(e) => formatDate(e, "log_start_dtm")}
        style={{ textAlign: "center", minWidth: 200, maxWidth: 200 }}
      ></Column>
      <Column
        field="log_end_dtm"
        header="วันเวลาสิ้นสุด"
        body={(e) => formatDate(e, "log_end_dtm")}
        style={{ textAlign: "center", minWidth: 200, maxWidth: 200 }}
      ></Column>
      <Column
        sortable
        field="source_name"
        header="แหล่งข้อมูล"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="transfer_data_group_name"
        header="ตาราง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="transfer_data_group_process_seq"
        header="ลำดับการทำงาน"
        style={{ minWidth: 150, maxWidth: 150, textAlign: "center" }}
      ></Column>
      {/* <Column
        sortable
        field="source_process"
        header="แหล่งข้อมูลต้นทาง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column> */}
      {/* <Column
        sortable
        field="source_schema"
        header="Schema ต้นทาง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column> */}
      {/* <Column
        sortable
        field="source_table"
        header="ตารางต้นทาง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column> */}
      <Column
        sortable
        field="target_process"
        header="แหล่งข้อมูลปลายทาง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column>
      {/* <Column
        sortable
        field="target_schema"
        header="Schema ปลายทาง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column> */}
      <Column
        sortable
        field="target_table"
        header="ตารางปลายทาง"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="schedule_mode"
        header="Schedule Mode"
        style={{ minWidth: 200, maxWidth: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        body={numberWithCommas}
        header="จำนวนข้อมูล"
        style={{ minWidth: 150, maxWidth: 150, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="transfer_process_status"
        header="สถานะการถ่ายโอน"
        body={(e) => returnStatus(e, "transfer_process_status")}
        style={{
          textAlign: "center",
          minWidth: 150,
          maxWidth: 150,
          wordWrap: "break-word",
        }}
      ></Column>
      <Column
        field="log_desc"
        header="ข้อผิดพลาด"
        style={{
          minWidth: 200,
          maxWidth: 200,
          textAlign: "center",
          wordWrap: "break-word",
        }}
      ></Column>
      <Column
        field="log_path"
        header="Log Path"
        style={{
          minWidth: 300,
          maxWidth: 300,
          textAlign: "center",
          wordWrap: "break-word",
        }}
      ></Column>
    </DataTable>
    // </div>
  );
}
