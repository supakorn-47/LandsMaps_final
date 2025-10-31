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

export default function DMS03List(props) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [displayBasic, setDisplayBasic] = useState(false);

  const header = (
    <div className="modern-table-header">
      <div className="header-left">
        {/* Empty for now, can add buttons if needed */}
      </div>
      <div className="header-right">
        <div className="modern-search">
          <i
            className="pi pi-search"
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              color: "#6c757d",
            }}
          />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา"
            className="modern-search-input"
          />
        </div>
      </div>
    </div>
  );

  const actionRun = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() => props.onRunProcessClick(rowData)}
          icon="pi pi-play"
          className="modern-add-button"
          tooltip="คลิกเพื่อ RUN"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionDetail = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-info"
          className="modern-service-button"
          onClick={() => props.onDMS03GetDetailClick(rowData)}
          tooltip="คลิกเพื่อ ดูรายละเอียด"
          tooltipOptions={{ position: "top" }}
        />
      </div>
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
    <div className="modern-table-container">
      <DataTable
        value={props.dataTable}
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
        paginatorClassName="modern-paginator"
      >
        <Column
          field="order_no"
          header="ลำดับ"
          className="order-column"
          style={{ width: "5%" }}
        ></Column>
        {/* <Column field="transfer_job_seq" header="Job ID" style={{ textAlign: 'center', width: '8%' }}></Column> */}
        <Column
          field="log_start_dtm"
          header="วันเวลาเริ่มต้น"
          body={(e) => formatDate(e, "log_start_dtm")}
          className="date-column"
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="log_end_dtm"
          header="วันเวลาสิ้นสุด"
          body={(e) => formatDate(e, "log_end_dtm")}
          className="date-column"
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="source_name"
          header="แหล่งข้อมูล"
          className="name-column"
        ></Column>
        <Column
          field="source_schema"
          header="Schema"
          className="name-column"
        ></Column>
        <Column
          field="transfer_data_group_name"
          header="กลุ่มตาราง"
          className="name-column"
          style={{ width: "13%" }}
        ></Column>
        {/* <Column field="target_name" header="แหล่งข้อมูลปลายทาง" style={{ width: '13%', wordWrap: 'break-word' }}></Column> */}
        <Column
          field="source_record"
          header="จำนวนข้อมูลต้นทาง"
          body={(e) => numberWithCommas(e, "source_record")}
          className="order-column"
          style={{ width: "8%" }}
        ></Column>
        <Column
          field="total_record"
          header="จำนวนข้อมูลปลายทาง"
          body={(e) => numberWithCommas(e, "total_record")}
          className="order-column"
          style={{ width: "8%" }}
        ></Column>
        <Column
          field="schedule_mode"
          header="ประเภทการถ่ายโอน"
          className="type-column"
          style={{ width: "8%" }}
        ></Column>
        <Column
          field="transfer_process_status"
          header="สถานะการถ่ายโอน"
          body={(e) => props.returnStatus(e, "transfer_process_status")}
          style={{ width: "8%" }}
        ></Column>
        <Column
          field="log_desc"
          header="ข้อผิดพลาด"
          style={{ width: "8rem" }}
          body={longText}
        ></Column>
        {/* <Column header="รายละเอียด" body={actionDetail} style={{ width: '6%', textAlign: 'center' }}></Column> */}
      </DataTable>
      {displayBasic.rowData !== undefined ? (
        <Dialog
          header={`${displayBasic.rowData.transfer_data_group_name}`}
          dismissableMask
          visible={displayBasic}
          style={{ width: "50vw" }}
          onHide={() => setDisplayBasic(false)}
          className="modern-dialog"
        >
          <p>{displayBasic.rowData.log_desc}</p>
        </Dialog>
      ) : (
        ""
      )}
    </div>
  );
}
