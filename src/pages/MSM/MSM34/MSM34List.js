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
import { formatDateTH, formatDateTH2 } from "../../../utils/DateUtil";

export default function MSM34List({ dataTable }) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <div></div>
      <span className="p-input-icon-left  ">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="ค้นหา"
          style={{ height: "38px", width: 400 }}
        />
      </span>
    </div>
  );
  //onClick={() => setDialog({ dialogUpdate: true, action: 'UPDATE', data: rowData })}
  const actionBodyTestConnection = (rowData) => {
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <Button
            icon="pi pi-cog"
            className="p-button-rounded p-button-primary"
            tooltip="คลิกเพื่อ แก้ไข"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      </>
    );
  };
  const actionBodyDetail = (rowData) => {
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <Button
            icon="pi pi-info"
            className="p-button-rounded p-button-info"
            tooltip="คลิกเพื่อ แก้ไข"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      </>
    );
  };
  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue == "สำเร็จ" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == "สำเร็จ" ? "#256029" : "#c63737",
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {datavalue == "สำเร็จ" ? "สำเร็จ" : "ไม่สำเร็จ"}
        </span>
      </>
    );
  };

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
    <div>
      <DataTable
        value={dataTable}
        dataKey="id"
        paginator
        rows={25}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
      >
        <Column
          sortable
          field="order_no"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
        ></Column>
        <Column
          sortable
          field="col2"
          header="วันเวลาจัดเก็บข้อมูล"
          body={(e) => formatDate(e, "col2")}
          style={{ width: "10%", textAlign: "center" }}
        ></Column>
        <Column
          sortable
          field="col3"
          header="ช่วงจัดเก็บข้อมูล"
          style={{ width: "15%", textAlign: "center" }}
        ></Column>
        <Column
          sortable
          field="col4"
          header="ชื่อ Schema ข้อมูล"
          style={{ wordWrap: "break-word" }}
        ></Column>
        <Column
          sortable
          field="col5"
          header="ขนาด Schema ข้อมูล(GB)"
          style={{ width: "20%", textAlign: "center" }}
        ></Column>
        <Column
          sortable
          field="col6"
          header="สถานะจัดเก็บข้อมูล"
          body={(e) => returnStatus(e, "col6")}
          style={{ width: "10%", textAlign: "center" }}
        ></Column>
        <Column
          header="ตรวจสอบการเชื่อมต่อ"
          body={actionBodyTestConnection}
          style={{ textAlign: "center", width: "10%" }}
        ></Column>
        <Column
          header="ตรวจสอบข้อมูล"
          body={actionBodyDetail}
          style={{ textAlign: "center", width: "10%" }}
        ></Column>
      </DataTable>
    </div>
  );
}
