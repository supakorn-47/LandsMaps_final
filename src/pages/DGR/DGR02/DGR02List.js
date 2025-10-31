import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH2 } from "../../../utils/DateUtil";

const DGR02List = (props) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const header = (
    <div className="table-header">
      <div className="header-left">
        <Button
          label="เพิ่มเอกสาร"
          icon="pi pi-plus"
          onClick={() => props.setDialog({ dialog: true, action: "ADD" })}
          className="p-button-rounded p-button-info"
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
            props.setDialog({ dialog: true, action: "UPDATE", data: rowData })
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
          disabled={rowData.record_status === "C"}
          onClick={() =>
            props.setDeleteDialog({
              open: true,
              data: rowData,
              record_status: "C",
              textConfirm: "คุณต้องการลบข้อมูล ใช่หรือไม่?",
            })
          }
          style={{ marginLeft: 5 }}
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อยกลบ"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const actionChangePublish = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <InputSwitch
          checked={rowData.gdg_public_flag === "1" ? true : false}
          onChange={(e) => props.onChangeUpdatePublicFlg(rowData, e.value)}
          tooltip="คลิกเพื่อ เปิด/ปิด เผยแพร่"
          tooltipOptions={{ position: "top" }}
          style={{ marginTop: "10px" }}
        />
      </div>
    );
  };

  const actionBodyViewFile = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          disabled={rowData.gdg_file_path === null ? true : false}
          onClick={() =>
            props.setPopupViewFile({
              open: true,
              linkURL: rowData.gdg_file_path,
            })
          }
          icon="pi pi-file"
          className="p-button-rounded p-button-success"
          tooltip="คลิกเพื่อ ดูรายการไฟล์"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
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
        // className="modern-datatable"
        scrollable
        scrollDirection="horizontal"
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: 56 }}
        />
        <Column
          field="gdg_version"
          header="เวอร์ชัน"
          style={{ textAlign: "center", width: 100 }}
        />
        <Column
          field="gdg_version_date"
          header="วันที่ปรับปรุงเอกสาร"
          body={(e) => formatDateTH2(e.gdg_version_date, false)}
          style={{ width: 150, textAlign: "center" }}
        />
        <Column
          field="gdg_organizer"
          header="ผู้จัดทำ"
          style={{ width: 300, textAlign: "left" }}
        />
        <Column
          field="gdg_approver"
          header="ผู้อนุมัติ"
          style={{ width: 300, textAlign: "left" }}
        />
        <Column
          field="gdg_document_name"
          header="ชื่อเอกสาร"
          style={{ width: 300, textAlign: "left" }}
        />
        <Column
          field="gdg_file_read"
          header="อ่าน"
          style={{ width: 80, textAlign: "center" }}
        />
        <Column
          field="gdg_file_download"
          header="ดาวน์โหลด"
          style={{ width: 120, textAlign: "center" }}
        />

        <Column
          header="ดูไฟล์"
          body={actionBodyViewFile}
          style={{ width: 80, textAlign: "center" }}
        />
        <Column
          header="เผยแพร่"
          body={actionChangePublish}
          style={{ width: 100, textAlign: "center" }}
        />
        <Column
          header="แก้ไข"
          body={actionBodyEdit}
          style={{ width: 80, textAlign: "center" }}
        />
        <Column
          header="ลบ"
          body={actionBodyDelete}
          style={{ width: 80, textAlign: "center" }}
        />
      </DataTable>
    </div>
  );
};

export default DGR02List;
