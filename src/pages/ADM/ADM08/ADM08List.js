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
import { MdOutlineVerified } from "react-icons/md";
import "primeicons/primeicons.css";

export default function ADM08List(props) {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        {/* <i className="pi pi-search" />
                <Button label="บันทึกชื่อระบบ" icon="pi pi-plus" onClick={() => props.setDialog({ dialog: true, action: 'บันทึก' })} autoFocus /> */}
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

  const actionBodyApprove = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            props.setDialog({
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

  // btn แนบไฟล์
  const actionListUpload = (rowData) => {
    // let stylebg = {}
    // if (rowData.filelist === null) {
    //     stylebg = {
    //         backgroundColor: 'darkgrey',
    //         borderColor: 'darkgrey'
    //     }
    // }
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => props.onADM08GetFilesList(rowData)}
          icon="pi pi-file-pdf"
          className={
            rowData.filelist === null
              ? "p-button-rounded p-button-danger"
              : "p-button-rounded "
          }
          // style={{ ...stylebg }}
          // style={rowData.filelist === null ? { marginLeft: 5, backgroundColor: '#6c757d', borderColor: '#6c757d' } : { marginLeft: 5 }}
          tooltip="คลิกเพื่อ แสดงไฟล์แนบ"
          tooltipOptions={{ position: "top" }}
          // disabled={rowData.approve_flag ===  0}
        />
      </div>
    );
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
  };

  const personalFormat = (rowData) => {
    if (rowData.person_id === undefined || rowData.person_id === null)
      return "-";
    let str = rowData.person_id.toString();
    if (str.length < 13) return "-";
    return (
      <>
        {/* {str.substring(0, 1) + "-" + str.substring(1, 5) + "-" + str.substring(5, 10) + "-" + str.substring(10, 12) + "-" + str.substring(12)} */}
        {str.substring(0, 1) +
          "-" +
          str.substring(1, 5) +
          "-" +
          str.substring(5, 10) +
          "-" +
          "**" +
          "-" +
          "*"}{" "}
        {/*Jane 250466*/}
      </>
    );
  };

  const mobileFormat = (rowData) => {
    if (rowData.person_phone === undefined) return "-";
    if (rowData.person_phone === null) return "-";
    let str = rowData.person_phone.toString();
    if (str.length < 10) return "-";
    return (
      <>
        {str.substring(0, 3) +
          "-" +
          str.substring(3, 6) +
          "-" +
          str.substring(6, 10)}
      </>
    );
  };

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    // console.log('data', data.approve_flag)
    let datavalue = data[`${checkColumn}`];

    let text = "";
    let background = "";
    let color = "";
    if (data.approve_flag === null) {
      text = "รออนุมัติ";
      background = "#FFFACD";
      color = "#FF6600";
    } else if (data.approve_flag === 0) {
      text = "ไม่อนุมัติ";
      background = "#ffcdd2";
      color = "#c63737";
    } else if (data.approve_flag === 1) {
      text = "อนุมัติ";
      background = "#c8e6c9";
      color = "#256029";
    } else {
      text = data.approve_flag;
      background = "#ffcdd2";
      color = "#c63737";
    }

    return (
      <>
        <span
          style={{
            background: background,
            color: color,
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {text}
        </span>
      </>
    );
  };

  const renderFeild = (rowData) => {
    let text = "";
    if (
      rowData.landoffice_name === null ||
      rowData.landoffice_name === undefined
    ) {
      // text = rowData.register_type_name;
      text = "-";
    } else {
      text = rowData.landoffice_name;
    }
    return <div>{text}</div>;
  };

  const actionBodyTxt = (text) => {
    if (text === undefined || text === null || text === " ") return "-";
    return <div>{text}</div>;
  };

  return (
    <div>
      <DataTable
        value={props.dataTable}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={rowsPerPageOptions()}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        // autoLayout
        rowHover
      >
        <Column
          field="index"
          header="ลำดับ"
          sortable
          style={{ width: "5%", textAlign: "center" }}
        />
        <Column
          sortable
          field="create_dtm"
          header="วันเวลาลงทะเบียน"
          body={(e) => formatDate(e, true, "create_dtm")}
          style={{ width: "10%", textAlign: "center", wordWrap: "break-word" }}
        />
        <Column
          sortable
          field="register_type_name"
          header="กลุ่มผู้ใช้งาน"
          style={{ wordWrap: "break-word" }}
        />
        <Column
          sortable
          field="province_name"
          header="จังหวัด"
          body={(e) => actionBodyTxt(e.province_name)}
          style={{ wordWrap: "break-word", width: "8%" }}
        />
        <Column
          sortable
          field="landoffice_name"
          header="หน่วยงาน"
          style={{ wordWrap: "break-word" }}
          body={renderFeild}
        />
        <Column
          sortable
          field="person_fullname"
          header="ชื่อ-สกุล"
          style={{ wordWrap: "break-word" }}
        />
        <Column
          sortable
          field="person_id"
          header="เลขประจำตัวประชาชน"
          style={{ textAlign: "center" }}
          body={personalFormat}
        />
        <Column
          sortable
          field="person_email"
          header="อีเมล"
          style={{ wordWrap: "break-word", width: "10%" }}
        />
        <Column
          sortable
          field="person_phone"
          header="เบอร์มือถือ"
          style={{ textAlign: "center", width: "10%" }}
          body={mobileFormat}
        />
        <Column
          field="register_objective"
          header="วัตถุประสงค์"
          style={{ wordWrap: "break-word" }}
          body={(e) => actionBodyTxt(e.register_objective)}
        />
        <Column
          sortable
          field="approve_flag"
          header="สถานะผู้ใช้งาน"
          style={{ textAlign: "center", width: "8%" }}
          body={(e) => returnStatus(e, "approve_flag")}
        />
        <Column
          header="ไฟล์แนบ"
          body={actionListUpload}
          style={{ textAlign: "center", width: "6%" }}
        />
        <Column
          header="อนุมัติผู้ใช้งาน"
          body={actionBodyApprove}
          style={{ width: "6%" }}
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
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: ".3px",
  };
}
