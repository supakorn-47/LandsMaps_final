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
import { formatDateTH } from "../../../utils/DateUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function DBT03List({
  dataTable,
  onDBT03GetDetailClick,
  onRunProcessClick,
  returnStatus,
}) {
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

  const actionRun = (rowData) => {
    return (
      <>
        <Button
          onClick={() => onRunProcessClick(rowData)}
          icon="pi pi-play"
          className="p-button-rounded"
          tooltip="คลิกเพื่อ RUN"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  const actionDetail = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-info"
          className="p-button-rounded p-button-info"
          onClick={() => onDBT03GetDetailClick(rowData)}
          tooltip="คลิกเพื่อ ดูรายละเอียด"
          tooltipOptions={{ position: "top" }}
        />
      </>
    );
  };

  const formatDate = (data, key) => {
    return <>{formatDateTH(data[key], true)}</>;
  };

  const numberWithCommas = (rowData, key) => {
    return (
      <div style={{ textAlign: "right" }}>
        {rowData[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    );
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
        style={{ textAlign: "center", width: 100 }}
      ></Column>
      <Column
        sortable
        field="transfer_job_seq"
        header="Job ID"
        style={{ textAlign: "center", width: 150 }}
      ></Column>
      <Column
        sortable
        field="log_start_dtm"
        header="วันเวลาเริ่มต้น"
        body={(e) => formatDate(e, "log_start_dtm")}
        style={{ width: 200, textAlign: 200 }}
      ></Column>
      <Column
        sortable
        field="log_end_dtm"
        header="วันเวลาสิ้นสุด"
        body={(e) => formatDate(e, "log_end_dtm")}
        style={{ width: 200, textAlign: "center" }}
      ></Column>
      <Column
        sortable
        field="source_name"
        header="แหล่งข้อมูล"
        style={{ wordWrap: "break-word", width: 200 }}
      ></Column>
      <Column
        sortable
        field="transfer_data_group_name"
        header="กลุ่มตาราง"
        style={{ width: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="target_name"
        header="แหล่งข้อมูลปลายทาง"
        style={{ width: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="source_record"
        header="จำนวนข้อมูลต้นทาง"
        body={(e) => numberWithCommas(e, "source_record")}
        style={{ width: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="total_record"
        header="จำนวนข้อมูลปลายทาง"
        body={(e) => numberWithCommas(e, "total_record")}
        style={{ width: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="schedule_mode"
        header="Schedule Mode"
        style={{ width: 200, wordWrap: "break-word" }}
      ></Column>
      <Column
        sortable
        field="transfer_process_status"
        header="สถานะการถ่ายโอน"
        body={(e) => returnStatus(e, "transfer_process_status")}
        style={{ width: 150, textAlign: "center" }}
      ></Column>
      {/* <Column header="Run" body={actionRun} style={{ textAlign: 'center', width: '5rem' }}></Column> */}
      <Column
        header="รายละเอียด"
        body={actionDetail}
        style={{ width: 300, textAlign: "center" }}
      ></Column>
    </DataTable>
  );
}
