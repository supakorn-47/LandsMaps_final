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

export default function MSM02List({ dataTable, setDialog }) {
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
    if (text === null || text === undefined) return;
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
    <div>
      <DataTable
        // ref={(el) => dt = el}
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
        className="p-datatable-responsive-demo"
        // autoLayout
        rowHover
      >
        <Column
          field="order_no"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
        />
        {/* <Column field="transfer_job_seq" header="JOB ID" style={{ textAlign: 'center', width: '5%' }}/> */}
        <Column
          field="log_start_dtm"
          header="เวลาเริ่ม"
          style={{ textAlign: "center", width: "8%" }}
          body={(e) => formatDateTH2(e.log_start_dtm, true)}
        />
        <Column
          field="log_end_dtm"
          header="เวลาสิ้นสุด"
          style={{ textAlign: "center", width: "8%" }}
          body={(e) => formatDateTH2(e.log_end_dtm, true)}
        />
        <Column
          field="schedule_mode"
          header="ประเภทการถ่ายโอน"
          headerStyle={{ textAlign: "center", width: "7%" }}
          bodyStyle={{ textAlign: "center" }}
          sortable
        ></Column>
        <Column
          field="source_name"
          header="แหล่งข้อมูลต้นทาง"
          style={{ wordWrap: "break-word", width: "15%" }}
        />
        <Column
          field="transfer_source_schema"
          header="Schema"
          style={{ wordWrap: "break-word" }}
        ></Column>
        <Column
          field="transfer_source_table"
          header="กลุ่มตาราง"
          style={{ wordWrap: "break-word", width: "15%" }}
          sortable
        />
        <Column
          field="target_name"
          header="แหล่งข้อมูลปลายทาง"
          style={{ wordWrap: "break-word", width: "15%" }}
        ></Column>
        <Column
          field="source_record_num"
          header="จำนวนข้อมูล"
          headerStyle={{ width: "6%" }}
          bodyStyle={{ textAlign: "right" }}
          body={(e) => stringComma(e.source_record_num)}
        ></Column>
        <Column
          field="transfer_status"
          header="สภานะ"
          style={{ textAlign: "center", width: "5%" }}
          body={(e) => returnStatus(e, "transfer_status")}
        ></Column>
        <Column
          header="รายละเอียด"
          body={actionBodyApprove}
          style={{ width: "6%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
