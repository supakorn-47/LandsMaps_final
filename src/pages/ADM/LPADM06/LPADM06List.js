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

export default function LPADM06List({ dataTable }) {
  let styleSpan = useStyleSpan();
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

  const actionBodyStatus = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: rowData.otp_status == "1" ? "#c8e6c9" : "#ffcdd2",
            color: rowData.otp_status == "1" ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {rowData.otp_status == "1" ? "สำเร็จ" : "ไม่สำเร็จ"}
        </span>
      </div>
    );
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
  };

  return (
    <div className="modern-table-container">
      <DataTable
        className="modern-datatable"
        // ref={(el) => dt = el}
        value={dataTable}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        rowHover
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "6%" }}
        />
        <Column
          field="otp_dtm"
          header="วันเวลาสร้าง OTP"
          style={{ textAlign: "center", width: "13%" }}
          body={(e) => formatDate(e, true, "otp_dtm")}
        />
        <Column
          field="otp_expire"
          header="วันเวลาหมดอายุ OTP"
          style={{ textAlign: "center", width: "14%" }}
          body={(e) => formatDate(e, true, "otp_expire")}
        />
        <Column
          field="ref_code"
          header="REF CODE"
          style={{ textAlign: "center", width: "14%" }}
        />
        <Column
          field="otp"
          header="OTP"
          style={{ textAlign: "center", width: "14%" }}
        />
        <Column field="to_email" header="EMAIL" />
        <Column
          field="otp_status"
          header="สถานะยืนยันตัวตน"
          body={actionBodyStatus}
          style={{ textAlign: "center", width: "14%" }}
        />
        {/* <Column header="แก้ไข" body={actionBodyEdit} style={{ width: '8%' }}></Column> */}
        {/* <Column header="ลบ" body={actionBodyDelete}style={{ width: '8%' }}></Column> */}
      </DataTable>
    </div>
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
