import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { formatDateTH } from "../../../utils/DateUtil";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";
import "../../../styles/global.css";

export default function LPADM02List({
  // adflag,
  // setAdflag,
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
    const onClick = () => {
      // setAdflag(false);
      setDialog({ dialog: true, action: "เพิ่ม" });
    };
    return (
      <div className="table-header">
        <div className="header-left">
          <Button
            label="เพิ่มผู้ใช้งาน"
            icon="pi pi-plus"
            onClick={() => onClick()}
            className="p-button-rounded p-button-info"
          />
        </div>
        <div className="header-right">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              placeholder="ค้นหาข้อมูล..."
              onInput={(e) => setGlobalFilter(e.target.value)}
            />
          </span>
        </div>
      </div>
    );
  };

  // ✅ ปุ่มแก้ไข
  const btnEdit = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          onClick={() =>
            setDialog({ dialog: true, action: "แก้ไข", data: rowData })
          }
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  // ✅ ปุ่มลบ
  const btnDelete = (rowData) => {
    return (
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
  };

  // ✅ ปุ่มรีเซ็ตรหัสผ่าน
  const btnResetPassword = (rowData) => {
    const disabled =
      rowData.register_ad_flag === "1" ||
      rowData.register_type_seq === 3 ||
      rowData.register_type_seq === 4 ||
      rowData.register_type_seq === 5;
    return (
      <div className="action-buttons">
        <Button
          onClick={() => setResetDialog({ open: true, data: rowData })}
          icon="pi pi-replay"
          className={`p-button-rounded p-button-info ${
            disabled ? "disabled" : ""
          }`}
          tooltip="รีเซ็ตรหัสผ่าน"
          tooltipOptions={{ position: "top" }}
          disabled={disabled}
        />
      </div>
    );
  };

  // ✅ แสดงสถานะ
  const statusRecord = (rowData) => {
    return (
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
  };

  // ✅ Format วันที่
  const formatDate = (rowData, isTime, checkColumn) => {
    const datevalue = rowData[`${checkColumn}`];
    return formatDateTH(datevalue, isTime);
  };

  // ✅ ปุ่มกำหนด Consumer
  const onConfigConsumerClick = (rowData) => {
    const disabled =
      rowData.register_type_seq === 1 ||
      rowData.register_type_seq === 2 ||
      rowData.register_type_seq === 5 ||
      rowData.register_type_seq === 6;
    return (
      <div className="action-buttons">
        <Button
          onClick={() => onSetConsumer(rowData)}
          icon="pi pi-key"
          className={`p-button-rounded p-button-help ${
            disabled ? "disabled" : ""
          }`}
          tooltip="กำหนด Consumer"
          tooltipOptions={{ position: "top" }}
          disabled={disabled}
        />
      </div>
    );
  };

 
  const onServiceClick = (rowData) => {
    const disabled =
      rowData.register_type_seq === 1 ||
      rowData.register_type_seq === 2 ||
      rowData.register_type_seq === 4 ||
      rowData.register_type_seq === 5 ||
      rowData.register_type_seq === 6;
    return (
      <div className="action-buttons">
        <Button
          onClick={() => onGetRegisterServiceClick(rowData)}
          icon="pi pi-cog"
          className={`p-button-rounded p-button-info ${
            disabled ? "disabled" : ""
          }`}
          tooltip="กำหนด Service"
          tooltipOptions={{ position: "top" }}
          disabled={disabled}
        />
      </div>
    );
  };

  const actionBodyTxt = (text) => {
    if (!text || text.trim() === "") return "-";
    return <div className="text-content">{text}</div>;
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
        />
        <Column
          field="create_dtm"
          header="วันเวลาลงทะเบียน"
          body={(e) => formatDate(e, true, "create_dtm")}
          style={{ textAlign: "center", width: 150 }}
        />
        <Column
          field="register_type_name"
          header="กลุ่มผู้ใช้งาน"
          style={{ width: 200 }}
        />
        <Column
          field="province_name"
          header="จังหวัด"
          body={(e) => actionBodyTxt(e.province_name)}
          style={{ width: 200 }}
        />
        <Column
          field="landoffice_name"
          header="หน่วยงาน"
          style={{ width: 300 }}
        />
        <Column
          field="person_fullname"
          header="ชื่อ-สกุล"
          style={{ width: 300 }}
        />
        <Column field="person_email" header="อีเมล" style={{ width: 300 }} />
        <Column
          field="record_status"
          body={statusRecord}
          header="สถานะ"
          style={{ width: 150 }}
        />
        <Column
          header="กำหนด Consumer"
          body={onConfigConsumerClick}
          style={{ width: 150 }}
        />
        <Column
          header="กำหนด Service"
          body={onServiceClick}
          style={{ width: 150 }}
        />
        <Column
          header="รีเซ็ตรหัสผ่าน"
          body={btnResetPassword}
          style={{ width: 150 }}
        />
        <Column header="แก้ไข" body={btnEdit} style={{ width: 80 }} />
        <Column header="ลบ" body={btnDelete} style={{ width: 80 }} />
      </DataTable>
    </>
  );
}
