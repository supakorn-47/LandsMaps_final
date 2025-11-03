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
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPADM04List({
  dataTable,
  setDialog,
  setDeleteDialog,
  onGetDataSurveyUserByFormID,
  onGetDataSurveyListByFormID,
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
      <div className="header-left">
        <Button
          className="p-button-rounded p-button-info"
          label="เพิ่มแบบสำรวจความพึงพอใจ"
          icon="pi pi-plus"
          onClick={() => setDialog({ dialog: true, action: "บันทึก" })}
        />
      </div>
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

  const actionBodyQuestion = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onGetDataSurveyListByFormID(rowData)}
          icon="pi pi-list"
          className="p-button-rounded p-button-info"
          tooltip="คลิกเพื่อ กำหนดคำถาม"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={dataTable}
      dataKey="id"
      paginator
      pageLinkSize={pageLinkSize}
      rows={rows}
      rowsPerPageOptions={rowsPerPageOptions}
      paginatorTemplate={paginatorTemplate}
      currentPageReportTemplate={currentPageReportTemplate}
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
        style={{ width: 80, textAlign: "center" }}
      />
      <Column
        sortable
        field="create_dtm"
        header="วันที่สร้างแบบสำรวจ"
        body={(e) => formatDateTH(e.create_dtm)}
        style={{ textAlign: "center", width: 150 }}
      />
      <Column
        sortable
        field="form_start_date"
        header="วันที่เริ่มต้นสำรวจ"
        body={(e) => formatDateTH(e.form_start_date)}
        style={{ textAlign: "center", width: 150 }}
      />
      <Column
        sortable
        field="form_finish_date"
        header="วันที่สิ้นสุดสำรวจ"
        body={(e) => formatDateTH(e.form_finish_date)}
        style={{ textAlign: "center", width: 150 }}
      />
      <Column
        field="form_name_th"
        header="หัวข้อแบบสำรวจ(ภาษาไทย)"
        style={{ width: 300 }}
      />
      <Column
        field="form_name_en"
        header="หัวข้อแบบสำรวจ(ภาษาอังกฤษ)"
        style={{ width: 300 }}
      />
      <Column
        header="กำหนดคำถาม"
        body={actionBodyQuestion}
        style={{ width: 80 }}
      />
      <Column header="แก้ไข" body={actionBodyEdit} style={{ width: 80 }} />
      <Column header="ลบ" body={actionBodyDelete} style={{ width: 80 }} />
    </DataTable>
  );
}
