import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH, formatDateTH2 } from "../../../utils/DateUtil";

export default function ADM11ListSummary({ dataTableSummary, setDialog }) {
  let styleSpan = useStyleSpan();

  const [globalFilter, setGlobalFilter] = useState(null);

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
    <DataTable
      value={dataTableSummary.datalist}
      dataKey="index"
      rows={100}
      header={header}
      globalFilter={globalFilter}
      emptyMessage="ไม่พบข้อมูลที่ค้นหา"
      rowHover
      scrollable
      scrollDirection="horizontal"
    >
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 80 }}
      />
      {dataTableSummary.header.map((value, index) => {
        if (dataTableSummary.header.length === index + 1) {
          return (
            <Column
              field={`data_${index + 1}`}
              header={`${value}`}
              bodyStyle={{ textAlign: "right", width: 150 }}
              headerStyle={{ textAlign: "center", width: 150 }}
            />
          );
        } else if (value === "วันที่") {
          return (
            <Column
              field={`data_${index}`}
              header={`${value}`}
              bodyStyle={{ textAlign: "center", width: 150 }}
              headerStyle={{ textAlign: "center", width: 150 }}
            />
          );
        } else {
          return (
            <Column
              field={`data_${index}`}
              header={`${value}`}
              bodyStyle={{
                wordWrap: "break-word",
                textAlign: "right",
                width: 200,
              }}
              headerStyle={{ textAlign: "center", width: 200 }}
            />
          );
        }
      })}
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
