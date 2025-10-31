import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { formatDateTH2 } from "../../../utils/DateUtil";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function MSM03List({ dataTable, setDialog }) {
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

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue == 1 ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == 1 ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {datavalue == 1 ? "สำเร็จ" : "ไม่สำเร็จ"}
        </span>
      </>
    );
  };

  const formatDate = (data, key) => {
    return <>{formatDateTH2(data[key], true)}</>;
  };

  const personalFormat = (rowData) => {
    if (rowData.personal_id === null || rowData.personal_id === undefined)
      return "-";
    let str = rowData.personal_id.toString();
    if (str.length < 13) return "-";
    return (
      <>
        {str.substring(0, 1) +
          "-" +
          str.substring(1, 5) +
          "-" +
          str.substring(5, 10) +
          "-" +
          str.substring(10, 12) +
          "-" +
          str.substring(12)}
      </>
    );
  };

  const bodyTxt = (data_size) => {
    return (
      <div style={{ textAlign: "right" }}>
        {data_size === null
          ? "-"
          : data_size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    );
  };

  return (
    <DataTable
      // ref={(el) => dt = el}
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
      //   className="p-datatable-responsive-demo"
      rowHover
      scrollable
      scrollDirection="horizontal"
      //   style={{ minWidth: "100%" }}
    >
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 100 }}
      />
      <Column
        field="create_dtm"
        header="วันเวลาจัดเก็บประวัติ"
        sortable
        body={(e) => formatDate(e, "create_dtm")}
        style={{ textAlign: "center", width: 200 }}
      />
      {/* <Column field="personal_id" header="เลขประจำตัวประชาชน" body={(e) => personalFormat(e)} style={{ textAlign: 'center', width: '10%' }} /> */}
      <Column
        field="personal_nameth"
        header="ชื่อ-นามสกุล"
        style={{ width: 300 }}
      />
      <Column
        field="department_name_th"
        header="หน่วยงาน"
        style={{ wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="ip_address"
        header="หมายเลขเครื่อง"
        style={{ textAlign: "center", wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="request_dtm"
        header="วันเวลา Request"
        sortable
        body={(e) => formatDate(e, "request_dtm")}
        style={{ textAlign: "center", width: 200 }}
      />
      <Column
        field="response_dtm"
        header="วันเวลา Response"
        sortable
        body={(e) => formatDate(e, "response_dtm")}
        style={{ textAlign: "center", width: 200 }}
      />
      {/* <Column field="service_method" header="Method" style={{ wordWrap: 'break-word', width: '8%' }} /> */}
      <Column
        field="service_name"
        header="ชื่อ Service"
        style={{ wordWrap: "break-word", width: 300 }}
      />
      <Column
        field="data_status"
        header="สถานะ"
        body={(e) => returnStatus(e, "data_status")}
        style={{ textAlign: "center", width: 150 }}
      />
      <Column
        field="data_size"
        header="ขนาดข้อมูล (byte)"
        body={(e) => bodyTxt(e.data_size)}
        style={{ width: 200 }}
        sortable
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
