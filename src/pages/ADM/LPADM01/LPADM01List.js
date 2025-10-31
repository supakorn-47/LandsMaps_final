import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
//Paginator
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH } from "../../../utils/DateUtil";
import "../../../styles/global.css";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPADM01List({
  adflag,
  setAdflag,
  onSetConsumer,
  onGetRegisterServiceClick,
  dataTable,
  setDialog,
  setDeleteDialog,
  setResetDialog,
  onPageChange,
  First,
  Rows,
  totalRecords,
}) {
  const menu = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const header = () => {
    return (
      <div
        className="header-right"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหาข้อมูล..."
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    );
  };

  const btnDelete = (rowData) => (
    <div className="action-buttons">
      <Button
        onClick={() => setDeleteDialog({ open: true, data: rowData })}
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        tooltip="ลบ"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  const btnResetPassword = (rowData) => (
    <div className="action-buttons">
      <Button
        onClick={() => setResetDialog({ open: true, data: rowData })}
        icon="pi pi-replay"
        className={`p-button-rounded p-button-info ${
          rowData.register_ad_flag === "1" ||
          rowData.register_type_seq === 3 ||
          rowData.register_type_seq === 4 ||
          rowData.register_type_seq === 5
            ? "disabled"
            : ""
        }`}
        tooltip="รีเซ็ตรหัสผ่าน"
        tooltipOptions={{ position: "top" }}
        disabled={
          rowData.register_ad_flag === "1" ||
          rowData.register_type_seq === 3 ||
          rowData.register_type_seq === 4 ||
          rowData.register_type_seq === 5
        }
      />
    </div>
  );

  const statusRecord = (rowData) => (
    <div className="status-badge">
      <span
        className={`status-indicator ${
          rowData.record_status === "N" ? "status-active" : "status-inactive"
        }`}
      >
        {rowData.record_status === "N" ? "ใช้งาน" : "ยกเลิก"}
      </span>
    </div>
  );

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return formatDateTH(datevalue, isTime);
  };

  const personalFormat = (rowData) => {
    if (rowData.personal_id === null || rowData.personal_id === undefined)
      return "-";
    let str = rowData.personal_id.toString();
    if (str.length < 13) return "-";
    return `${str.substring(0, 1)}-${str.substring(1, 5)}-${str.substring(
      5,
      10
    )}-${str.substring(10, 12)}-${str.substring(12)}`;
  };

  const phoneNumberFormat = (rowData) => {
    if (!rowData.phone_number) return "-";
    return rowData.phone_number;
  };

  const objectFormat = (rowData) => {
    if (!rowData.objective) return "-";
    return rowData.objective;
  };

  const actionBodyApprove = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setDialog({
              openApprove: true,
              text: "ยืนยันอนุมัติผู้ใช้งาน",
              data: rowData,
              register_seq: rowData.register_seq,
            })
          }
          icon="pi pi-verified"
          className="p-button-rounded p-button-success"
          tooltip="คลิกเพื่อ อนุมัติผู้ใช้งาน"
          tooltipOptions={{ position: "top" }}
          disabled={
            rowData.register_type_seq === 1 ||
            rowData.register_type_seq === 2 ||
            rowData.approve_flag === 1
          }
        />
      </div>
    );
  };

  return (
    <>
      <DataTable
        value={dataTable}
        dataKey="row_num"
        header={header()}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        className="p-datatable-responsive-demo"
        rowHover
        showGridlines
        scrollable
        scrollDirection="horizontal"
        pageLinkSize={pageLinkSize}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
        paginator
      >
        <Column
          field="row_num"
          header="ลำดับ"
          style={{ textAlign: "center", width: 80 }}
          className="order-column"
        />
        <Column
          field="create_dtm"
          header="วันเวลาลงทะเบียน"
          body={(e) => formatDate(e, true, "create_dtm")}
          style={{ textAlign: "center", width: 150 }}
          className="date-column"
        />
        <Column
          field="landoffice_name"
          header="หน่วยงาน"
          style={{ width: 300 }}
          className="office-column"
        />
        <Column
          field="register_type_name"
          header="จังหวัด"
          style={{ width: 200 }}
          className="province-column"
        />
        <Column
          field="person_fullname"
          header="ชื่อ-สกุล"
          style={{ width: 300 }}
          className="name-column"
        />
        <Column
          field="personal_id"
          header="เลขบัตรประชาชน"
          style={{ width: 300 }}
          className="id-column"
        />
        <Column
          field="person_email"
          header="อีเมล"
          style={{ width: 300 }}
          className="email-column"
        />
        <Column
          header="เบอร์มือถือ"
          body={phoneNumberFormat}
          style={{ width: 300 }}
          className="phone-column"
        />
        <Column
          header="วัตถุประสงค์"
          body={objectFormat}
          style={{ width: 300 }}
          className="objective-column"
        />
        <Column
          header="สถานะผู้ใช้งาน"
          body={statusRecord}
          style={{ width: 200 }}
          className="service-column"
        />
       
        <Column
          header="อนุมัติผู้ใช้งาน"
          body={actionBodyApprove}
          style={{ width: 80 }}
        ></Column>
      </DataTable>
    </>
  );
}
