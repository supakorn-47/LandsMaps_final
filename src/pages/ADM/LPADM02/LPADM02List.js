import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { formatDateTH } from "../../../utils/DateUtil";
import LPADM02Services from "../../../service/ServiceADM/ServiceLPADM02";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

import {
  currentPageReportTemplate as utilCurrentPageReportTemplate,
  paginatorTemplate as utilPaginatorTemplate,
  rowsPerPageOptions as utilRowsPerPageOptions,
} from "../../../utils/TableUtil";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";
import "../../../styles/global.css";

export default function LPADM02List({
  onSetConsumer,
  onGetRegisterServiceClick,
  dataTable,
  setDialog,
  setDeleteDialog,
  setResetDialog,
  onReload,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);

  const [dialogDelete, setDialogDelete] = useState({
    open: false,
    data: null,
    record_status: "C",
    textConfirm: "",
  });

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions: hookRowsPerPageOptions,
    currentPageReportTemplate: hookCurrentPageReportTemplate,
    paginatorTemplate: hookPaginatorTemplate,
  } = useResponsivePaginator();

  const safeSetDialog = setDialog || (() => {});
  const safeSetResetDialog = setResetDialog || (() => {});
  const safeOnSetConsumer = onSetConsumer || (() => {});
  const safeOnGetRegisterServiceClick = onGetRegisterServiceClick || (() => {});

  const loadDepartments = async () => {
    try {
      const opts = await LPADM02Services.getDepartmentOptions();
      return opts || [];
    } catch {
      return [];
    }
  };

  const header = () => {
    const onClick = () => {
      safeSetDialog({ dialog: true, action: "เพิ่ม" });
    };
    return (
      <div className="table-header">
        <div className="header-left">
          <Button
            label="เพิ่มผู้ใช้งาน"
            icon="pi pi-plus"
            onClick={onClick}
            className="p-button-rounded p-button-info"
          />
        </div>
        <div className="header-right">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              placeholder="ค้นหาข้อมูล"
              onInput={(e) => setGlobalFilter(e.target.value)}
            />
          </span>
        </div>
      </div>
    );
  };

  const btnEdit = (row) => {
    const onEdit = async () => {
      let deptOptions = [];
      try {
        deptOptions = await loadDepartments();
      } catch {}
      let full = null;
      try {
        full = await LPADM02Services.getBySeq(row.register_seq);
      } catch {}

      const merged = { ...(row || {}), ...(full || {}) };

      safeSetDialog({
        dialog: true,
        action: "แก้ไข",
        data: {
          ...merged,
          __deptOptions: deptOptions,
          __skipLoadDept: true,
        },
      });
    };

    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={onEdit}
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
          disabled={rowData.record_status === "C"}
          onClick={() =>
            setDialogDelete({
              open: true,
              data: rowData,
              record_status: "C",
              textConfirm: `คุณต้องการลบข้อมูล "${rowData.person_fullname}" ใช่หรือไม่ ?`,
            })
          }
          style={{ marginLeft: 5 }}
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip="คลิกเพื่อลบข้อมูล"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  const onDelete = async () => {
    try {
      const res = await LPADM02Services.deleteData(
        dialogDelete.data.register_seq
      );
      if (res?.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "สำเร็จ",
          detail: `ยกเลิกข้อมูล ${dialogDelete.data.person_fullname} สำเร็จ`,
          life: 3000,
        });
        if (onReload) onReload();
      } else {
        toast.current.show({
          severity: "warn",
          summary: "ไม่สำเร็จ",
          detail: "ไม่สามารถยกเลิกข้อมูลได้",
          life: 3000,
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "ผิดพลาด",
        detail: "เกิดข้อผิดพลาดในการยกเลิกข้อมูล",
        life: 3000,
      });
      console.error(err);
    } finally {
      setDialogDelete({
        open: false,
        data: null,
        record_status: "C",
        textConfirm: "",
      });
    }
  };

  const btnResetPassword = (rowData) => {
    const disabled =
      rowData.register_ad_flag === "1" ||
      rowData.register_type_seq === 3 ||
      rowData.register_type_seq === 4 ||
      rowData.register_type_seq === 5;
    return (
      <div className="action-buttons">
        <Button
          onClick={() => safeSetResetDialog({ open: true, data: rowData })}
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

  const statusRecord = (rowData) => {
    const isActive = rowData.record_status === "N";
    return (
      <div className="status-badge">
        <span
          className={`status-indicator ${
            isActive ? "status-active" : "status-inactive"
          }`}
        >
          {isActive ? "ใช้งาน" : "ยกเลิก"}
        </span>
      </div>
    );
  };

  const formatDate = (rowData, isTime, checkColumn) => {
    const datevalue = rowData[checkColumn];
    return formatDateTH(datevalue, isTime);
  };

  const onConfigConsumerClick = (rowData) => {
    const disabled =
      rowData.register_type_seq === 1 ||
      rowData.register_type_seq === 2 ||
      rowData.register_type_seq === 5 ||
      rowData.register_type_seq === 6;
    return (
      <div className="action-buttons">
        <Button
          onClick={() => safeOnSetConsumer(rowData)}
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
          onClick={() => safeOnGetRegisterServiceClick(rowData)}
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
    if (typeof text !== "string" || text.trim() === "") return "-";
    return <div className="text-content">{text}</div>;
  };

  const departmentCell = (row) => {
    const v =
      row?.department ||
      row?.department_name_th ||
      row?.department_name ||
      row?.register_department_name ||
      row?.landoffice_name_th ||
      row?.office_name_th ||
      "-";
    return actionBodyTxt(v);
  };

  const emailCell = (row) => {
    const v = row?.person_email || row?.email || "-";
    return <div className="text-content">{v}</div>;
  };

  const finalRowsPerPageOptions =
    hookRowsPerPageOptions || utilRowsPerPageOptions;
  const finalCurrentPageReportTemplate =
    hookCurrentPageReportTemplate || utilCurrentPageReportTemplate;
  const finalPaginatorTemplate = hookPaginatorTemplate || utilPaginatorTemplate;

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
        rowsPerPageOptions={finalRowsPerPageOptions}
        paginatorTemplate={finalPaginatorTemplate}
        currentPageReportTemplate={finalCurrentPageReportTemplate}
        paginator
      >
        <Column field="row_num" header="ลำดับ" style={{ width: 80 }} />
        <Column
          field="create_dtm"
          header="วันเวลาลงทะเบียน"
          body={(e) => formatDate(e, true, "create_dtm")}
          style={{ width: 150 }}
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
          field="department"
          header="หน่วยงาน"
          body={departmentCell}
          style={{ width: 300 }}
        />
        <Column
          field="person_fullname"
          header="ชื่อ-สกุล"
          style={{ width: 300 }}
        />
        <Column header="อีเมล" body={emailCell} style={{ width: 300 }} />
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
        <Column header="ยกเลิก" body={btnDelete} style={{ width: 80 }} />
      </DataTable>

      <Dialog
        header="การยืนยัน"
        visible={dialogDelete.open}
        style={{ width: "400px" }}
        onHide={() =>
          setDialogDelete({
            open: false,
            data: null,
            record_status: "C",
            textConfirm: "",
          })
        }
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="ยกเลิก"
              className="p-button-secondary p-button-rounded"
              onClick={() =>
                setDialogDelete({
                  open: false,
                  data: null,
                  record_status: "C",
                  textConfirm: "",
                })
              }
            />
            <Button label="ตกลง" className="p-button-info" onClick={onDelete} />
          </div>
        }
      >
        <p>{dialogDelete.textConfirm}</p>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </>
  );
}
