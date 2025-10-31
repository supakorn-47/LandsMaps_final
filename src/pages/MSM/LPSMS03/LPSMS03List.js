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
import { Dialog } from "primereact/dialog";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPSMS03List(props) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [displayBasic, setDisplayBasic] = useState(false);

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
          onClick={() => props.onRunProcessClick(rowData)}
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
          onClick={() => props.onDMS03GetDetailClick(rowData)}
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
    try {
      if (rowData[key] === undefined || rowData[key] === null) {
        return <div style={{ textAlign: "right" }}>-</div>;
      } else {
        return (
          <div style={{ textAlign: "right" }}>
            {rowData[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        );
      }
    } catch (error) {}
  };

  const longText = (rowData) => {
    if (rowData.log_desc === "N/A") {
      return rowData.log_desc;
    } else {
      return (
        <>
          <Button
            label={`${rowData.log_desc.substring(0, 13)}....`}
            tooltip="คลิกที่นี่ เพื่อแสดงเพิ่มเติม"
            tooltipOptions={{ position: "left" }}
            onClick={() => setDisplayBasic({ rowData: rowData, open: true })}
            className="p-button-link"
          />
        </>
      );
    }
  };

  return (
    <div>
      <DataTable
        value={props.dataTable}
        dataKey="id"
        paginator
        pageLinkSize={pageLinkSize}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        autoLayout
        rowHover
        size="small"
        scrollable
      >
        <Column
          sortable
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: 100 }}
        ></Column>
        {/* <Column sortable field="transfer_job_seq" header="Job ID" style={{ textAlign: 'center', width: '8%' }}></Column> */}
        <Column
          sortable
          field="source_schema"
          header="Service ID"
          style={{ width: 150, wordWrap: "break-word" }}
        ></Column>
        <Column
          sortable
          field="source_name"
          header="ชื่อ Service"
          style={{ wordWrap: "break-word", width: 300 }}
        ></Column>
        {/* <Column sortable field="transfer_data_group_name" header="กลุ่มตาราง" style={{ width: '13%', wordWrap: 'break-word' }}></Column> */}
        {/* <Column sortable field="target_name" header="แหล่งข้อมูลปลายทาง" style={{ width: '13%', wordWrap: 'break-word' }}></Column> */}
        {/* <Column sortable field="source_record" header="จำนวนข้อมูลต้นทาง" body={(e) => numberWithCommas(e, "source_record")} style={{ width: '8%', wordWrap: 'break-word' }}></Column> */}
        {/* <Column sortable field="total_record" header="จำนวนข้อมูลปลายทาง" body={(e) => numberWithCommas(e, "total_record")} style={{ width: '8%', wordWrap: 'break-word' }}></Column> */}
        {/* <Column sortable field="schedule_mode" header="ประเภทการถ่ายโอน" style={{ width: '8%', wordWrap: 'break-word', textAlign: 'center' }}></Column> */}
        {/* <Column sortable field="transfer_process_status" header="สถานะการถ่ายโอน" body={(e) => props.returnStatus(e, 'transfer_process_status')} style={{ width: '8%', textAlign: 'center' }}></Column> */}
        <Column
          sortable
          field="log_start_dtm"
          header="วันวลาเริ่มต้นการใช้งาน"
          body={(e) => formatDate(e, "log_start_dtm")}
          style={{ width: 200, textAlign: "center" }}
        ></Column>
        <Column
          sortable
          field="log_end_dtm"
          header="วันเวลาสิ้นสุดการใช้งาน"
          body={(e) => formatDate(e, "log_end_dtm")}
          style={{ width: 200, textAlign: "center" }}
        ></Column>
        <Column
          field="use_amount"
          header="จำนวนการใช้งาน"
          body={(e) => numberWithCommas(e, "use_amount")}
          style={{ width: 200, wordWrap: "break-word" }}
        ></Column>
        <Column
          field="use_unit"
          header="หน่วยการใช้งาน"
          style={{ width: 100, wordWrap: "break-word", textAlign: "center" }}
        ></Column>
        <Column
          sortable
          field="cost"
          header="ต้นทุน"
          body={(e) => numberWithCommas(e, "cost")}
          style={{ width: 200, wordWrap: "break-word" }}
        ></Column>

        {/* <Column sortable field="log_desc" header="ข้อผิดพลาด" style={{ width: '8rem' }} body={longText}></Column> */}
        {/* <Column header="รายละเอียด" body={actionDetail} style={{ width: '6%', textAlign: 'center' }}></Column> */}
      </DataTable>
      {displayBasic.rowData !== undefined ? (
        <Dialog
          header={`${displayBasic.rowData.transfer_data_group_name}`}
          dismissableMask
          visible={displayBasic}
          style={{ width: "50vw" }}
          onHide={() => setDisplayBasic(false)}
        >
          <p>{displayBasic.rowData.log_desc}</p>
        </Dialog>
      ) : (
        ""
      )}
    </div>
  );
}
