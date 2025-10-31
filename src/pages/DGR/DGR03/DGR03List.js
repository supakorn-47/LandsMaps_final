import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function List({
  dataTable,

  onRowReorders,
}) {
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
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหา"
            // className="modern-search-input"
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    </div>
  );

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <div style={{ textWrap: "nowrap" }}>
        <span
          style={{
            background: datavalue == "1" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == "1" ? "#256029" : "#c63737",
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {datavalue == "1" ? "ใช้งาน" : "ไม่ใช้งาน"}
        </span>
      </div>
    );
  };

  return (
    <DataTable
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
      onRowReorder={onRowReorders}
      // autoLayout
      rowHover
      // className="modern-datatable"
      // scrollable
      // scrollDirection="horizontal"
      // style={{ minWidth: "100%" }}
      // tableStyle={{ minWidth: "1200px" }} // or whatever min width you need
      responsiveLayout="scroll"
      autoLayout
      className="p-datatable-responsive-demo"
    >
      {/* <Column rowReorder style={{ width: 56, textAlign: "center" }}  */}
      <Column
        field="index"
        header="ลำดับ"
        style={{ textAlign: "center", width: 80 }}
      ></Column>
      <Column
        field="department_name"
        header="หน่วยงาน"
        style={{ minWidth: 300, wordWrap: "break-word" }}
      ></Column>
      <Column
        field="service_amount"
        header="ServiceAmount"
        headerStyle={{ minWidth: 300 }}
      ></Column>
      {/* <Column field="service_protocol" header="Protocal" style={{ width: '8%', wordWrap: 'break-word' }}></Column> */}

      {/* <Column field="service_param" header="Parameter" style={{ width: '8%' }}></Column> */}
      {/* <Column field="service_method" header="Method" style={{ textAlign: 'center', width: '5%' }}></Column> */}
      <Column
        field="service_rest"
        header="REST API"
        style={{ textAlign: "center", width: 100, wordWrap: "break-word" }}
      ></Column>
      <Column
        field="service_wms"
        header="WMS"
        style={{ textAlign: "center", width: 100, wordWrap: "break-word" }}
      ></Column>
      <Column
        field="service_geojson"
        header="GEOJSON"
        style={{ textAlign: "center", width: 100, wordWrap: "break-word" }}
      ></Column>
      <Column
        field="service_data_type"
        header="ประเภทข้อมูล"
        style={{ textAlign: "center", width: 100, wordWrap: "break-word" }}
      ></Column>
      {/* 
      <Column
        header="สถานะ"
        style={{ textAlign: "center", width: 150 }}
        body={(e) => returnStatus(e, "use_flag")}
      ></Column> */}

      {/* <Column
        header="เผยแพร่"
        body={actionBodyPublic}
        style={{ textAlign: "center", width: 100 }}
      ></Column> */}
    </DataTable>
  );
}
