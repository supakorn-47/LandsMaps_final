import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import copy from "copy-to-clipboard";
//Paginator
import {
  currentPageReportTemplate,
  paginatorTemplate,
} from "../../../utils/TableUtil";
import { Paginator } from "primereact/paginator";

export default function ADM13List(props) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [copyClipboard, setCopyClipboard] = useState("");

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left"></span>
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

  const actionBodyStatus = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: rowData.otp_status == "1" ? "#c8e6c9" : "#ffcdd2",
            color: rowData.otp_status == "1" ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {rowData.otp_status == "1" ? "สำเร็จ" : "ไม่สำเร็จ"}
        </span>
      </div>
    );
  };

  const actionBodySendMail = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          label={rowData.sendmail_status}
          className="p-button-link"
          style={{
            background:
              rowData.sendmail_status === "ยังไม่ส่งเมล"
                ? "#ffcdd2"
                : "#c8e6c9",
            color:
              rowData.sendmail_status === "ยังไม่ส่งเมล"
                ? "#c63737"
                : "#256029",
            ...styleSpan,
          }}
          onClick={() => props.onGetLogList(rowData, "MAIL")}
        />
        {/* <span style={{
                    background: (rowData.sendmail_status === 'ยังไม่ส่งเมล' ? '#ffcdd2' : "#c8e6c9"),
                    color: (rowData.sendmail_status === 'ยังไม่ส่งเมล' ? '#c63737' : "#256029"),
                    ...styleSpan
                }}>
                    {rowData.sendmail_status}
                </span>
                 */}
        {rowData.wp_sendmail_date !== null ? (
          <div style={{ marginTop: "10px" }}>
            <span>{rowData.wp_sendmail_by}</span>
            <br />
            <span>{rowData.wp_sendmail_date}</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const actionBodyStatusDownload = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          label={rowData.download_status}
          className="p-button-link"
          style={{
            background:
              rowData.download_status === "ยังไม่ดาวน์โหลด"
                ? "#ffcdd2"
                : "#c8e6c9",
            color:
              rowData.download_status === "ยังไม่ดาวน์โหลด"
                ? "#c63737"
                : "#256029",
            ...styleSpan,
          }}
          onClick={() => props.onGetLogList(rowData, "DOWNLOAD")}
        />
        {/* <span style={{
                    background: (rowData.download_status === 'ยังไม่ดาวน์โหลด' ? '#ffcdd2' : "#c8e6c9"),
                    color: (rowData.download_status === 'ยังไม่ดาวน์โหลด' ? '#c63737' : "#256029"),
                    ...styleSpan
                }}>{rowData.download_status}</span> */}
        {rowData.wp_download_date !== null ? (
          <div style={{ marginTop: "10px" }}>
            <span>{rowData.wp_download_by}</span>
            <br />
            <span>{rowData.wp_download_date}</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const actionFileZip = (rowData) => {
    return (
      <>
        {rowData.wp_file_size === null
          ? "-"
          : rowData.wp_file_size
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </>
    );
  };

  const actionBodyFileStatus = (rowData) => {
    if (rowData.file_status === null) {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-times-circle"
            style={{ color: "#c63737", fontSize: "20px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-check-circle"
            style={{ color: "#256029", fontSize: "20px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    }
  };

  const numberWithCommas = (x) => {
    if (x === null || x === undefined) {
      return <>-</>;
    }
    return <>{x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>;
  };

  const actionBodyReg = (rowData) => {
    if (rowData.wp_reg_status === null || rowData.wp_reg_status === "0") {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-times-circle"
            style={{ color: "#c63737", fontSize: "20px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-check-circle"
            style={{ color: "#256029", fontSize: "20px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    }
  };

  const actionBodyGis = (rowData) => {
    if (rowData.wp_gis_status === null || rowData.wp_gis_status === "0") {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-times-circle"
            style={{ color: "#c63737", fontSize: "20px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <i
            className="pi pi-check-circle"
            style={{ color: "#256029", fontSize: "20px", fontWeight: "bold" }}
          ></i>
        </div>
      );
    }
  };

  const actionBodyDownload = (rowData) => {
    const onDownloadFileZip = () => {
      window.location = rowData.path_file_zip;
    };
    // onDownloadFile

    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => props.onDownloadFile(rowData.wp_seq)}
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

  return (
    <div>
      <DataTable
        value={props.dataTable}
        dataKey="row_num"
        rows={props.Rows}
        onPage={(e) => props.onPageChange(e)}
        // paginator
        // rowsPerPageOptions={[5, 10, 25, 50, 100]}
        // paginatorTemplate={paginatorTemplate()}
        // currentPageReportTemplate={currentPageReportTemplate()}
        // header={header}
        // globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        className="p-datatable-responsive-demo"
        autoLayout
        rowHover
      >
        <Column
          field="row_num"
          header="ลำดับ"
          style={{ textAlign: "center", width: "3%" }}
        />
        <Column
          field="wp_mcode"
          header="มาตรา"
          headerStyle={{ textAlign: "center", width: "6%" }}
          bodyStyle={{ textAlign: "center" }}
          sortable
        />
        <Column
          field="landoffice_name"
          header="สำนักงานที่ดิน"
          headerStyle={{ textAlign: "center", width: "15%" }}
          sortable
        />
        <Column
          field="opt_name"
          header="ชื่อ อปท."
          headerStyle={{ textAlign: "center", width: "15%" }}
          sortable
        />
        <Column
          field="month_year"
          header="เดือน-ปี"
          style={{ textAlign: "center", width: "7%" }}
          sortable
        />
        <Column
          field="wp_reg_num"
          header="จำนวนรายการ(เปลี่ยนแปลง)"
          headerStyle={{ textAlign: "center" }}
          style={{ textAlign: "right", width: "10%" }}
          sortable
          body={(e) => numberWithCommas(e.wp_reg_num)}
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
          field="file_status"
          header="ไฟล์ Zip"
          style={{ textAlign: "center", width: "5%" }}
          body={actionBodyFileStatus}
        />
        <Column
          field="wp_file_size"
          header="ขนาดไฟล์ Zip (KB)"
          style={{ textAlign: "right", width: "8%" }}
          body={actionFileZip}
        />
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
          field="sendmail_status"
          header="สถานะส่งเมล"
          body={actionBodySendMail}
          style={{ textAlign: "center", width: "10%" }}
        />
        <Column
          field="download_status"
          header="สถานะดาวน์โหลด"
          body={actionBodyStatusDownload}
          style={{ textAlign: "center", width: "10%" }}
        />
        {/* <Column header="แก้ไข" body={actionBodyEdit} style={{ width: '8%' }}></Column> */}
        {/* <Column header="ลบ" body={actionBodyDownload}style={{ width: '8%' }}></Column> */}
      </DataTable>

      <Paginator
        paginator
        first={props.First}
        rows={props.Rows}
        totalRecords={props.dataTable.length === 0 ? 0 : props.totalRecords}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={props.onPageChange}
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
