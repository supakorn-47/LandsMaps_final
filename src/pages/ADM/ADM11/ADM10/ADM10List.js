import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { formatDateTH, formatDateTH2 } from "../../../utils/DateUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function ADM10List({ dataTable }) {
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
        <span className="p-input-icon-left  ">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา"
          />
        </span>
      </div>
    </div>
  );


  const formatDate = (data, key) => {
    return <>{formatDateTH2(data[key], true)}</>;
  };

  const numberWithCommas = (rowData) => {
    return (
      <div style={{ textAlign: "right" }}>
        {rowData.total_record.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    );
  };

  return (
    // <div className="modern-table-container">
    <DataTable
      value={dataTable}
      dataKey="id"
      paginator
      // rows={10}
      // rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
      responsiveLayout="scroll"
      autoLayout
    >
      
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 80 }}
      />
      <Column
        field="otp_dtm"
        header="วันเวลาสร้าง OTP"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => formatDate(e, true, "otp_dtm")}
        sortable
      />
      <Column
        field="otp_expire"
        header="วันเวลาหมดอายุ OTP"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => formatDate(e, true, "otp_expire")}
        sortable
      />
      <Column
        field="ref_code"
        header="REF CODE"
        sortable
        style={{ textAlign: "center", width: 300 }}
      />
       <Column
        field="otp"
        header="OTP"
        sortable
        style={{ textAlign: "center", width: 300 }}
      />
      <Column
        field="to_email"
        header="EMAIL"
        sortable
        style={{ textAlign: "center", width: 300 }}
      />
      <Column
        field="otp_status"
        header="สถานะยืนยันตัวตน"
        // body={actionBodyStatus}
        style={{ textAlign: "center", width: 200 }}
        sortable
      />
    </DataTable>
    // </div>
  );
}
