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

export default function DMS06List({ dataTable }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <div className="header-left"></div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา"
            className="modern-search-input"
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
          className={datavalue == "สำเร็จ" ? "status-success" : "status-error"}
        >
          {datavalue == "สำเร็จ" ? "สำเร็จ" : "ไม่สำเร็จ"}
        </span>
      </>
    );
  };

  const formatDate = (data, key) => {
    return <>{formatDateTH2(data[key], false)}</>;
  };

  const numberWithCommas = (rowData) => {
    return (
      <div style={{ textAlign: "right" }}>
        {rowData.total_record.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    );
  };

  const hoverText = (rowData) => {
    return (
      <Button
        label={rowData.order_no}
        tooltip={`JOB ID : ${rowData.transfer_job_seq}`}
        className="p-button-link"
      />
    );
  };

  return (
    <div className="modern-table-container">
      <DataTable
        value={dataTable}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "4%" }}
        ></Column>
        <Column
          field="log_start_dtm"
          header="วันที่"
          body={(e) => formatDate(e, "log_start_dtm")}
          style={{ width: "10%", textAlign: "center" }}
        ></Column>
        <Column
          field="source_name"
          header="แหล่งข้อมูล"
          style={{ wordWrap: "break-word" }}
        ></Column>
        <Column
          field="source_schema"
          header="Schema"
          style={{ wordWrap: "break-word" }}
        ></Column>
        <Column
          field="transfer_data_group_name"
          header="กลุ่มตาราง"
          style={{ width: "13%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="source_record"
          header="จำนวนข้อมูลต้นทาง"
          body={(e) => numberWithCommas(e, "source_record")}
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="total_record"
          header="จำนวนข้อมูลปลายทาง"
          body={(e) => numberWithCommas(e, "total_record")}
          style={{ width: "10%", wordWrap: "break-word" }}
        ></Column>
        <Column
          field="schedule_mode"
          header="ประเภทการถ่ายโอน"
          headerStyle={{ width: "10%", wordWrap: "break-word" }}
          bodyStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="transfer_process_status"
          header="สถานะการถ่ายโอน"
          body={(e) => returnStatus(e, "transfer_process_status")}
          style={{ width: "10%", textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
}
