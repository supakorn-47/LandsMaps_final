import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import copy from "copy-to-clipboard";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH, formatDateTH2 } from "../../../utils/DateUtil";

export default function ADM12List({
  onDownloadFile,
  dataTable,
  setDialog,
  setDeleteDialog,
  onGetFileList,
  setSendMail,
  setFileList,
}) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [copyClipboard, setCopyClipboard] = useState("");

  const header = () => {
    const open = () => {
      setDialog({ dialog: true, action: "บันทึก" });
      setFileList([]);
    };
    return (
      <div className="table-header">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <Button
            className="p-button-rounded"
            label="เพิ่มคำร้องขอข้อมูล มาตรา 92"
            icon="pi pi-plus"
            onClick={() => open()}
            autoFocus
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

  const actionBodyStatus = (rowData) => {
    if (rowData.count_sendmail === 0) {
      return (
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              background: "#ffcdd2",
              color: "#c63737",
              ...styleSpan,
            }}
          >
            ยังไม่ได้ส่งเมล
          </span>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              background: "#c8e6c9",
              color: "#256029",
              ...styleSpan,
            }}
          >
            สำเร็จ
          </span>
        </div>
      );
    }
  };

  const actionBodySendMail = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() =>
            setSendMail({ open: true, action: "ส่งอีเมล", data: rowData })
          }
          icon="pi pi-envelope"
          className="p-button-rounded p-button-info"
          tooltip={`${rowData.email_address} \nส่งอีเมลล่าสุด : ${
            rowData.wp_sendmail_by === null ? "" : rowData.wp_sendmail_by
          } ${
            rowData.wp_sendmail_date === null ? "-" : rowData.wp_sendmail_date
          }`}
          tooltipOptions={{ position: "top" }}
          disabled={
            rowData.wp_file_size === "" ||
            rowData.wp_file_size === null ||
            rowData.wp_file_size === undefined ||
            rowData.path_file_zip === null
          }
        />
      </div>
    );
  };

  const actionBodyDownload = (rowData) => {
    const onDownloadFileZip = () => {
      window.location = rowData.path_file_zip;
    };
    // onDownloadFile

    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onDownloadFile(rowData.wp_seq)}
          icon="pi pi-download"
          className="p-button-rounded p-button-success"
          tooltip={`ดาวน์โหลดล่าสุด : ${
            rowData.wp_download_by === null ? "" : rowData.wp_download_by
          } ${
            rowData.wp_download_date === null ? "-" : rowData.wp_download_date
          }`}
          tooltipOptions={{ position: "top" }}
          disabled={
            rowData.wp_file_size === "" ||
            rowData.wp_file_size === null ||
            rowData.wp_file_size === undefined ||
            rowData.path_file_zip === null
          }
        />
      </div>
    );
  };

  const actionBodyKey = (rowData) => {
    const onClick = () => {
      copy(rowData.passzip_code);
      setCopyClipboard("copied");
      setInterval(() => {
        setCopyClipboard("");
      }, 1000);
    };

    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onClick()}
          icon="pi pi-key"
          className="p-button-rounded p-button-secondary"
          tooltip={
            copyClipboard === "copied"
              ? "คัดลอกสำเร็จ"
              : "คัดลอกรหัสผ่านไฟล์ zip"
          }
          tooltipOptions={{ position: "top" }}
          style={{ backgroundColor: "#F5DEB3" }}
          disabled={
            rowData.wp_file_size === "" ||
            rowData.wp_file_size === null ||
            rowData.wp_file_size === undefined ||
            rowData.path_file_zip === null
          }
        />
      </div>
    );
  };

  const actionBodyEdit = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onGetFileList(rowData)}
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="คลิกเพื่อ แก้ไข"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionBodyFileZip = (rowData) => {
    if (rowData.path_file_zip === null) {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-times-circle"
            style={{ color: "#c63737", fontSize: "22px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-check-circle"
            style={{ color: "#256029", fontSize: "22px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    }
  };

  // pi pi-spin pi-spinner
  // pi pi-check-circle
  // pi pi-times-circle
  const actionBodyReg = (rowData) => {
    if (rowData.wp_reg_status === "1" || rowData.wp_reg_status === 1) {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-check-circle"
            style={{ color: "#256029", fontSize: "22px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-spin pi-spinner"
            style={{ color: "#c63737", fontSize: "22px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    }
  };

  const actionBodyGis = (rowData) => {
    if (rowData.wp_gis_status === 1 || rowData.wp_gis_status === "1") {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-check-circle"
            style={{ color: "#256029", fontSize: "22px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-spin pi-spinner"
            style={{ color: "#c63737", fontSize: "22px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    }
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

  const formatDate = (rowData, isTime, checkColumn) => {
    let date = { ...rowData };
    let datevalue = date[`${checkColumn}`];
    return <>{formatDateTH(datevalue, isTime)}</>;
  };

  const numberWithCommas = (x) => {
    if (x === null || x === undefined) {
      return <>-</>;
    }
    return <>{x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>;
  };

  return (
    <div>
      <DataTable
        value={dataTable}
        dataKey="col1"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header()}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        rowHover
        autoLayout
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "5%" }}
          sortable
        />
        <Column
          field="opt_request_date"
          header="วันที่ขอคำร้องขอ"
          body={(e) => formatDate(e, true, "opt_request_date")}
          style={{ textAlign: "center", width: "7%" }}
        />
        <Column
          field="landoffice_name"
          header="สำนักงานที่ดิน"
          headerStyle={{
            width: "10%",
            textAlign: "center",
            wordWrap: "break-word",
          }}
          sortable
        />
        <Column
          field="opt_name"
          header="ชื่อ อปท."
          style={{ width: "15%", wordWrap: "break-word" }}
          sortable
        />
        <Column
          field="wp_shp_zone"
          header="โซน"
          style={{ textAlign: "center", width: "4.5%" }}
        />
        <Column
          field="wp_reg_status"
          header="ข้อมูลทะเบียน"
          body={actionBodyReg}
          style={{ width: "5%" }}
        />
        <Column
          field="wp_gis_status"
          header="ข้อมูลรูปแปลง"
          body={actionBodyGis}
          style={{ width: "5%" }}
        />
        <Column
          field="path_file_zip"
          header="ไฟล์ Zip"
          body={actionBodyFileZip}
          style={{ width: "5%" }}
        />
        <Column
          field="wp_file_size"
          header="ขนาดไฟล์ Zip(KB)"
          sortable
          bodyStyle={{ textAlign: "right", width: "7%" }}
          body={(e) => numberWithCommas(e.wp_file_size)}
        />
        <Column
          sortable
          field="count_sendmail"
          header="สถานะส่งอีเมล"
          body={actionBodyStatus}
          style={{ textAlign: "center", width: "8%" }}
        />
        <Column
          header="ส่งอีเมล"
          body={actionBodySendMail}
          style={{ width: "4.8%" }}
        ></Column>
        <Column
          header="ดาวน์โหลด"
          body={actionBodyDownload}
          style={{ width: "4.8%" }}
        ></Column>
        <Column
          header="รหัส Zip ไฟล์"
          body={actionBodyKey}
          style={{ width: "4.8%" }}
        ></Column>
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ width: "4.8%" }}
        ></Column>
        <Column header="ลบ" body={btnDelete} style={{ width: "4.8%" }}></Column>
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
