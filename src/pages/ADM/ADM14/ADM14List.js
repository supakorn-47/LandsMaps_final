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

export default function ADM16List(props) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);

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

  const bodyFile = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          label=""
          className="p-button-rounded p-button-success"
          icon="pi pi-file"
        />
      </div>
    );
  };

  const bodyAnswers = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => props.setPopup({ open: true, rowData: rowData })}
          label=""
          className="p-button-rounded p-button-info"
          icon="pi pi-comments"
        />
      </div>
    );
  };

  const header = () => {
    return (
      <div className="table-header">
        <span className="p-input-icon-left">
          {/* <i className="pi pi-search" />
                    <Button className="p-button-rounded" label="เพิ่มคำร้องขอข้อมูล มาตรา 92" icon="pi pi-plus" onClick={() => open()} autoFocus /> */}
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

  const bodySplitText = (data) => {
    let data_show = "-";
    if (data === null || data === "  " || data === " ") return "-";
    if (data.length > 50) {
      data_show = data.substring(0, 50) + "...";
    } else {
      data_show = data;
    }
    return <div>{data_show}</div>;
  };

  const actionBodyTxt = (text) => {
    if (text === undefined || text === null || text === " ") return "-";
    return <div>{text}</div>;
  };

  return (
    <div>
      <DataTable
        value={props.dataTable}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        className="p-datatable-responsive-demo"
        autoLayout
        rowHover
        header={header()}
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "6%" }}
        />
        <Column
          field="error_question_date"
          header="วันที่แจ้ง"
          style={{ textAlign: "center" }}
        />
        <Column field="landoffice_name" header="ชื่อสำนักงาน" />
        <Column
          field="province_name"
          header="จังหวัด"
          body={(e) => actionBodyTxt(e.province_name)}
          style={{ wordWrap: "break-word" }}
        />
        {/* <Column field="register_name" header="ชื่อ-สกุล" style={{ textAlign: 'center', width: '12%' }} /> */}
        <Column field="agency_name" header="ชื่อหน่วยงาน" />
        <Column field="error_type_name" header="ประเภทข้อผิดพลาด" />
        <Column field="error_question_subject" header="หัวข้อ" />
        <Column
          field="error_question_desc"
          header="รายละเอียด"
          body={(e) => bodySplitText(e.error_question_desc)}
        />
        {/* <Column header="ไฟล์แนบ" body={(e) => e.error_files.length === 0 ? '-' : e.error_files.length } style={{ textAlign: 'center' }}/> */}
        <Column field="error_question_status" header="ตอบโดย" />
        <Column header="รายละเอียด" body={bodyAnswers} />
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
