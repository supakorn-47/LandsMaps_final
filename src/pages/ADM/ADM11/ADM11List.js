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

export default function ADM11List(props) {
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
        value={props.dataTable}
        dataKey="row_num"
        // rows={props.Rows}
        // rows={10}
        // onPage={(e) => props.onPageChange(e)}
        // rowsPerPageOptions={rowsPerPageOptions()}
        // paginatorTemplate={paginatorTemplate()}
        // currentPageReportTemplate={currentPageReportTemplate()}
        pageLinkSize={pageLinkSize}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
        // header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        rowHover
        scrollable
        scrollDirection="horizontal"
        paginator
      >
        <Column
          field="date"
          header="วันที่"
          body={(e) => formatDate(e, true, "date")}
          style={{ textAlign: "center", width: 200 }}
        />
        <Column
          field="myLand"
          header="ที่ดินของฉัน"
          style={{ textAlign: "center", width: 200 }}
          sortable
        />
        <Column
          field="searchMyLand"
          header="ค้นหาที่ดินของฉัน"
          style={{ textAlign: "left", width: 300 }}
          sortable
        />
        <Column
          field="news"
          header="ข่าวสาร"
          sortable
          style={{ width: 150, wordWrap: "break-word" }}
        />
        <Column
          field="satisfactionSurvey"
          header="แบบความพึงพอใจ"
          sortable
          style={{ wordWrap: "break-word", width: 300 }}
        />
        <Column
          field="landDetail"
          header="ดูรายละเอียดที่ดิน"
          sortable
          style={{ wordWrap: "break-word", width: 300 }}
        />
      
      </DataTable>

      
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
