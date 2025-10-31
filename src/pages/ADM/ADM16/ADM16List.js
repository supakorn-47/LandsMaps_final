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
import { formatDateTH } from "../../../utils/DateUtil";

export default function ADM16List({ dataTable, setDialog, setDeleteDialog }) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <span />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="คำค้น"
          style={{ height: "38px", width: 400 }}
          onInput={(e) => setGlobalFilter(e.target.value)}
        />
      </span>
    </div>
  );

  const actionBodyEdit = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({ dialog: true, action: "แก้ไข", data: rowData })
          }
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อ แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };
  const actionBodyDelete = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => setDeleteDialog({ open: true, data: rowData })}
          style={{ marginLeft: 5 }}
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อ ลบ"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyViewImage = (rowData) => {
    if (
      rowData.announce_attach === undefined ||
      rowData.announce_attach === "" ||
      rowData.announce_attach === null
    ) {
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            disabled={true}
            onClick={() =>
              setDialog({
                dialogViewImage: true,
                action: "แสดงรูปภาพ",
                viewImage: rowData,
              })
            }
            style={{ marginLeft: 5 }}
            icon="pi pi-image"
            className="p-button-rounded p-button-secondary"
            tooltip="คลิกเพื่อ แสดงรูปภาพ"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() =>
              setDialog({
                dialogViewImage: true,
                action: "แสดงรูปภาพ",
                viewImage: rowData,
              })
            }
            style={{ marginLeft: 5 }}
            icon="pi pi-image"
            className="p-button-rounded p-button-secondary"
            tooltip="คลิกเพื่อ แสดงรูปภาพ"
            tooltipOptions={{ position: "top" }}
          />
        </div>
      );
    }
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
  };

  const actionBodyEx = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background:
              rowData.consent_flag == "0"
                ? "#ffcdd2"
                : rowData.consent_flag == "1"
                ? "#c8e6c9"
                : "#ffa33063",
            color:
              rowData.consent_flag == "0"
                ? "#c63737"
                : rowData.consent_flag == "1"
                ? "#256029"
                : "#ff8d00",
            ...styleSpan,
          }}
        >
          {rowData.consent_flag == "0"
            ? "ไม่ยินยอม"
            : rowData.consent_flag == "1"
            ? "ยินยอม"
            : "อยู่ระหว่างประสาน"}
        </span>
      </div>
    );
  };

  return (
    <div>
      <DataTable
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
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "6%" }}
        />
        <Column
          sortable
          field="pvnamethai"
          header="จังหวัด"
          style={{ width: "11rem" }}
        />
        <Column
          sortable
          field="amnamethai"
          header="อำเภอ"
          style={{ width: "11rem" }}
        />
        <Column
          sortable
          field="tamnamethai"
          header="ตำบล"
          style={{ width: "11rem" }}
        />
        <Column
          sortable
          field="opt_name_display"
          header="ชื่อ อปท."
          style={{ width: "5rem" }}
        />
        <Column
          sortable
          field="service_url"
          header="บริการ Service"
          style={{
            width: "7rem",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        />
        <Column
          sortable
          field="consent_flag"
          header="สถานะ"
          body={actionBodyEx}
          style={{ textAlign: "center", width: "9rem" }}
        />
        <Column
          sortable
          field="consent_date"
          header="วันที่ยินยอม"
          body={(e) => formatDate(e, false, "consent_date")}
          style={{ textAlign: "center", width: "10rem" }}
        />
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ textAlign: "center", width: "4%" }}
        ></Column>
        <Column
          header="ลบ"
          body={actionBodyDelete}
          style={{ textAlign: "center", width: "4%", paddingLeft: "3px" }}
        ></Column>
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
