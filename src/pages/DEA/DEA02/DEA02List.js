import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { formatDateTH } from "../../../utils/DateUtil";
import { Button } from "primereact/button";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";

export default function DEA02List({ dataTable, setDialog }) {
  const [globalFilter, setGlobalFilter] = useState(null);
  let styleSpan = useStyleSpan();

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

  const actionBodyRespon = (rowData) => {
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

  const actionBodyStatus = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: rowData.data_status === 1 ? "#c8e6c9" : "#ffcdd2",
            color: rowData.data_status === 1 ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {rowData.data_status === 1 ? "ได้ข้อมูล" : "ไม่ได้ข้อมูล"}
        </span>
      </div>
    );
  };

  const actionBodyType = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background:
              rowData.service_method == "POST" ? "#008b0a" : "#0099FF",
            color: "#FFF",
            ...styleSpan,
          }}
        >
          {rowData.service_method}
        </span>
      </div>
    );
  };

  const bodyNumber = (data_size) => {
    return (
      <div style={{ textAlign: "right" }}>
        {data_size === null
          ? "-"
          : data_size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    );
  };

  const formatDateString = (data, key) => {
    return <>{data[key] === null ? "" : data[key].substring(16, 0)}</>;
  };

  const actionBodyView = (rowData) => {
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

  return (
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
      //   className="p-datatable-responsive-demo"
      //   autoLayout
      //   rowHover
      scrollable
      scrollDirection="horizontal"
    >
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 100 }}
      />
      <Column
        sortable
        field="create_dtm"
        header="วันเวลาจัดเก็บประวัติ"
        body={(e) => formatDateTH(e.create_dtm, true)}
        style={{ textAlign: "center", width: 200 }}
      />
      <Column
        sortable
        field="ip_address"
        header="หมายเลขเครื่อง"
        style={{ textAlign: "center", width: 300 }}
      />
      <Column
        sortable
        field="department_name_th"
        header="หน่วยงาน"
        style={{ width: 300 }}
      />
      <Column
        sortable
        field="service_name"
        header="ชื่อ Service"
        style={{ width: 400 }}
      />
      <Column
        sortable
        field="request_dtm"
        header="วันเวลา request"
        body={(e) => formatDateTH(e.request_dtm, true)}
        style={{ textAlign: "center", width: 200 }}
      />
      <Column
        sortable
        field="response_dtm"
        header="วันเวลา response"
        body={(e) => formatDateTH(e.response_dtm, true)}
        style={{ textAlign: "center", width: 200 }}
      />
      <Column
        sortable
        field="service_method"
        header="ประเภท Service"
        body={actionBodyType}
        style={{ width: 200 }}
      />
      <Column
        sortable
        field="response_status"
        header="สถานะติดต่อ"
        body={actionBodyRespon}
        style={{ width: 200 }}
      />
      <Column
        sortable
        field="data_status"
        header="สถานะ"
        body={actionBodyStatus}
        style={{ width: 150 }}
      />
      <Column
        field="data_size"
        header="ขนาดข้อมูล(byte)"
        body={(e) => bodyNumber(e.data_size)}
        style={{ width: 200 }}
      />
      <Column
        header="รายละเอียด"
        body={actionBodyView}
        style={{ width: 100 }}
      ></Column>
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
