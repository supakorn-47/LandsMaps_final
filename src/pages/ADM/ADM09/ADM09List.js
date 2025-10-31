import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { currentPageReportTemplate, paginatorTemplate, rowsPerPageOptions } from '../../../utils/TableUtil';
import { formatDateTH } from "../../../utils/DateUtil";
//Paginator
import {
  currentPageReportTemplate,
  paginatorTemplate,
} from "../../../utils/TableUtil";
import { Paginator } from "primereact/paginator";
export default function ADM09List({
  adflag,
  setAdflag,
  onGetConsumerClick,
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
  let styleSpan = useStyleSpan();

  const header = () => {
    const onClick = () => {
      setAdflag(false);
      setDialog({ dialog: true, action: "เพิ่ม" });
    };
    return (
      <div className="table-header">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <Button
            label="เพิ่มผู้ใช้งาน"
            icon="pi pi-plus"
            onClick={() => onClick()}
            className="p-button-rounded"
          />
        </span>
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
  };

  const btnEdit = (rowData) => {
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

  const btnDelete = (rowData) => {
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

  const btnResetPassword = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => setResetDialog({ open: true, data: rowData })}
          style={
            rowData.register_ad_flag === "1" ||
            rowData.register_type_seq === 3 ||
            rowData.register_type_seq === 4 ||
            rowData.register_type_seq === 5
              ? {
                  marginLeft: 5,
                  backgroundColor: "#6c757d",
                  borderColor: "#6c757d",
                }
              : { marginLeft: 5 }
          }
          icon="pi pi-replay"
          className="p-button-rounded p-button-info"
          tooltip="คลิกเพื่อ รีเซ็ตรหัสผ่าน"
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
  };

  const statusRecord = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: rowData.record_status == "N" ? "#c8e6c9" : "#ffcdd2",
            color: rowData.record_status == "N" ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {rowData.record_status == "N" ? "ใช้งาน" : "ยกเลิก"}
        </span>
      </div>
    );
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
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

  const onConfigConsumerClick = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onGetConsumerClick(rowData)}
          style={
            rowData.register_type_seq === 1 ||
            rowData.register_type_seq === 2 ||
            rowData.register_type_seq === 4 ||
            rowData.register_type_seq === 5 ||
            rowData.register_type_seq === 6
              ? {
                  marginLeft: 5,
                  backgroundColor: "#6c757d",
                  borderColor: "#6c757d",
                }
              : { marginLeft: 5 }
          }
          icon="pi pi-key"
          className="p-button-rounded p-button-help"
          tooltip="คลิกเพื่อกำหนด Consumer"
          tooltipOptions={{ position: "top" }}
          disabled={
            rowData.register_type_seq === 1 ||
            rowData.register_type_seq === 2 ||
            rowData.register_type_seq === 4 ||
            rowData.register_type_seq === 5 ||
            rowData.register_type_seq === 6
          }
        />
      </div>
    );
  };

  const onServiceClick = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onGetRegisterServiceClick(rowData)}
          style={
            rowData.register_type_seq === 1 ||
            rowData.register_type_seq === 2 ||
            rowData.register_type_seq === 4 ||
            rowData.register_type_seq === 5 ||
            rowData.register_type_seq === 6
              ? {
                  marginLeft: 5,
                  backgroundColor: "#6c757d",
                  borderColor: "#6c757d",
                }
              : { marginLeft: 5 }
          }
          icon="pi pi-cog"
          className="p-button-rounded p-button-info"
          tooltip="คลิกเพื่อกำหนด Service"
          tooltipOptions={{ position: "top" }}
          disabled={
            rowData.register_type_seq === 1 ||
            rowData.register_type_seq === 2 ||
            rowData.register_type_seq === 4 ||
            rowData.register_type_seq === 5 ||
            rowData.register_type_seq === 6
          }
        />
      </div>
    );
  };

  const actionBodyTxt = (text) => {
    if (text === undefined || text === null || text === " ") return "-";
    return <div>{text}</div>;
  };
  return (
    <div>
      <DataTable
        value={dataTable}
        dataKey="row_num"
        rows={Rows}
        onPage={(e) => onPageChange(e)}
        // paginator
        // rowsPerPageOptions={rowsPerPageOptions()}
        // paginatorTemplate={paginatorTemplate()}
        // currentPageReportTemplate={currentPageReportTemplate()}
        header={header()}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        // autoLayout
        rowHover
      >
        <Column
          sortable
          field="row_num"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
        />
        <Column
          sortable
          field="create_dtm"
          header="วันเวลาลงทะเบียน"
          body={(e) => formatDate(e, true, "create_dtm")}
          style={{ textAlign: "center" }}
        />
        <Column
          sortable
          field="register_type_name"
          header="กลุ่มผู้ใช้งาน"
          style={{ width: "10%" }}
        />
        <Column
          sortable
          field="province_name"
          header="จังหวัด"
          body={(e) => actionBodyTxt(e.province_name)}
          style={{ wordWrap: "break-word" }}
        />
        <Column
          sortable
          field="landoffice_name"
          header="หน่วยงาน"
          style={{ wordWrap: "break-word" }}
        />
        <Column sortable field="person_fullname" header="ชื่อ-สกุล" />
        <Column
          sortable
          field="person_email"
          header="อีเมล"
          style={{ wordWrap: "break-word" }}
        />
        <Column
          sortable
          field="record_status"
          body={statusRecord}
          header="สถานะ"
          style={{ width: "8%", wordWrap: "break-word" }}
        />
        <Column
          header="กำหนด Consumer"
          body={onConfigConsumerClick}
          style={{ width: "7%" }}
        />
        <Column
          header="กำหนด Service"
          body={onServiceClick}
          style={{ width: "7%" }}
        />
        <Column
          header="รีเซ็ตรหัสผ่าน"
          body={btnResetPassword}
          style={{ width: "7%" }}
        />
        <Column header="แก้ไข" body={btnEdit} style={{ width: "6%" }} />
        <Column header="ลบ" body={btnDelete} style={{ width: "6%" }} />
      </DataTable>

      <Paginator
        paginator
        first={First}
        rows={Rows}
        totalRecords={dataTable.length === 0 ? 0 : totalRecords}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={onPageChange}
        template={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
      ></Paginator>
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
