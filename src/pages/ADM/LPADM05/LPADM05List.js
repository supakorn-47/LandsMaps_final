import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { formatDateTH } from "../../../utils/DateUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPADM05List(props) {
  const styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);

  const {
    rows: defaultRows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const rows = props.rows ?? defaultRows;
  const first = props.first ?? 0;
  const totalRecords =
    typeof props.totalRecords === "number"
      ? props.totalRecords
      : props.dataTable?.length || 0;

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
    const ok = Number(rowData.response_status) === 1;
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: ok ? "#c8e6c9" : "#ffcdd2",
            color: ok ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {ok ? "ติดต่อได้" : "ติดต่อไม่ได้"}
        </span>
      </div>
    );
  };

  const cellDate = (rowData, key, isTime = true) => {
    const val = rowData?.[key];
    return <>{formatDateTH(val, isTime)}</>;
  };

  const formatNumber = (rowData) => {
    const n = Number(rowData?.data_size ?? 0);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <DataTable
        value={props.dataTable}
        dataKey="row_num"
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        rowHover
        showGridlines
        scrollable
        scrollDirection="horizontal"
        paginator
        pageLinkSize={pageLinkSize}
        rows={rows}
        first={first}
        totalRecords={totalRecords}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
        onPage={props.onPageChange}
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
          body={(e) => cellDate(e, "log_user_dtm", true)}
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
          style={{ width: 300, wordWrap: "break-word" }}
        />
        <Column
          field="department_name_display"
          header="หน่วยงาน"
          sortable
          style={{ width: 300, wordWrap: "break-word" }}
          body={(row) => row?.department_name_th || "-"}
        />
        <Column
          field="response_status"
          header="สถานะ"
          style={{ textAlign: "center", width: 150 }}
          body={actionBodyStatus}
          sortable
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
