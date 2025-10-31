import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH2 } from "../../../utils/DateUtil";

export default function LPSMS02List({ dataTable, setDialog }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left"></span>
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

  const actionBodyApprove = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => setDialog({ dialog: true, data: rowData })}
          icon="pi pi-info"
          className="p-button-rounded p-button-info"
          tooltip="คลิกเพื่อ ดูรายละเอียด"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

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

  const stringComma = (text) => {
    if (text === null || text === undefined) return "";
    return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        className="modern-datatable"
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
        // autoLayout
        rowHover
      >
        {/* <Column field="orderNo" header="ลำดับ" style={{ textAlign: 'center', width: '5%' }}/> */}
        {/* <Column field="transfer_job_seq" header="JOB ID" style={{ textAlign: 'center', width: '5%' }}/> */}
        <Column
          field="logStartDtm"
          header="เวลาเริ่ม"
          body={(e) => formatDateTH2(e.logStartDtm, true)}
        />
        <Column
          field="logEndDtm"
          header="เวลาสิ้นสุด"
          body={(e) => formatDateTH2(e.logEndDtm, true)}
        />
        <Column field="sourceName" header="แหล่งข้อมูล" />
        <Column field="sourceSchema" header="Schema"></Column>
        <Column field="transferDataGroupName" header="กลุ่มตาราง" />
        <Column
          field="sourceRecord"
          header="จำนวนข้อมูลต้นทาง"
          bodyStyle={{ textAlign: "right" }}
          body={(e) => stringComma(e.sourceRecord)}
        ></Column>
        <Column
          field="totalRecord"
          header="จำนวนข้อมูลปลายทาง"
          bodyStyle={{ textAlign: "right" }}
          body={(e) => stringComma(e.totalRecord)}
        ></Column>
        <Column
          field="scheduleMode"
          header="ประเภทการถ่ายโอน"
          bodyStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          field="transferProcessStatus"
          header="สภานะ"
          body={(e) => returnStatus(e, "transferProcessStatus")}
        ></Column>
        <Column header="รายละเอียด" body={actionBodyApprove}></Column>
      </DataTable>
    </div>
  );
}
