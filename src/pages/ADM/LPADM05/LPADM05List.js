import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { formatDateTH, formatDateTH2 } from "../../../utils/DateUtil";
//Paginator
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { Paginator } from "primereact/paginator";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPADM05List(props) {
  let styleSpan = useStyleSpan();

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
        {" "}
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

  const actionBodyStatus = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: rowData.response_status === 1 ? "#c8e6c9" : "#ffcdd2",
            color: rowData.response_status === 1 ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {rowData.response_status === 1 ? "ติดต่อได้" : "ติดต่อไม่ได้"}
        </span>
      </div>
    );
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
  };

  const formatNumber = (rowData) => {
    return rowData.data_size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <DataTable
        // className="modern-datatable"
        value={props.dataTable}
        dataKey="row_num"
        // rows={10} //{props.Rows}
        // onPage={(e) => props.onPageChange(e)}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        rowHover
        // rowsPerPageOptions={rowsPerPageOptions()}
        // paginatorTemplate={paginatorTemplate()}
        // currentPageReportTemplate={currentPageReportTemplate()}
        scrollable
        scrollDirection="horizontal"
        paginator
        pageLinkSize={pageLinkSize}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
      >
        <Column
          field="row_num"
          header="ลำดับ"
          style={{ textAlign: "center", width: 80 }}
        />
        <Column
          field="log_user_dtm"
          header="วันเวลาประวัติ"
          style={{ textAlign: "center", width: 150 }}
          body={(e) => formatDate(e, true, "log_user_dtm")}
          sortable
        />
        <Column
          field="ip_address"
          header="IP Address"
          style={{ textAlign: "left", width: 150 }}
          sortable
        />
        <Column
          field="personal_nameth"
          header="ผู้ใช้งาน"
          sortable
          style={{ width: 300, wordWrap: "break-word" }}
        />
        <Column
          field="register_type_name"
          header="กลุ่มผู้ใช้งาน"
          sortable
          style={{ wordWrap: "break-word", width: 300 }}
        />
        <Column
          field="department_name"
          header="หน่วยงาน"
          sortable
          style={{ wordWrap: "break-word", width: 300 }}
        />
        <Column
          field="response_status"
          header="สถานะ"
          style={{ textAlign: "center", width: 150 }}
          body={actionBodyStatus}
          sortable
        />
      </DataTable>

      {/* <Paginator
        className="modern-paginator"
        paginator
        first={props.First}
        rows={props.Rows}
        totalRecords={props.dataTable.length === 0 ? 0 : props.totalRecords}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(e) => props.onPageChange(e)}
        template={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
      ></Paginator> */}
    </>
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
