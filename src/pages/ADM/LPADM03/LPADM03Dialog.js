import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { formatDateTH } from "../../../utils/DateUtil";
import LPADM03Services from "../../../service/ServiceADM/ServiceLPADM03";
import { Loading } from "../../../components/Loading/Loading";

export default function LPADM03List({ dataTable, setDataTable, onRefresh }) {
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    action: "เพิ่ม",
    data: null,
  });

  const [formData, setFormData] = useState({
    announce_date: new Date(),
    announce_start: null,
    announce_end: null,
    announce_type: null,
    title_th: "",
    title_en: "",
    detail_th: "",
    detail_en: "",
    link: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);

  const types = [
    { label: "ข่าวกรมที่ดิน", value: "ข่าวกรมที่ดิน" },
    { label: "ข่าว LandsMaps Platform", value: "ข่าว LandsMaps Platform" },
    { label: "ข่าว อปท.", value: "ข่าว อปท." },
  ];

  const showMsg = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 4000 });
  };

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateField = (value) => submitted && !value;

  const openEditDialog = (rowData) => {
    const toDate = (v) => (v ? new Date(v) : null);
    setFormData({
      announce_date: toDate(rowData.announce_date),
      announce_start: toDate(rowData.announce_start_date),
      announce_end: toDate(rowData.announce_finish_date),
      announce_file_types: rowData.announce_file_types || [],
      announce_type: rowData.announce_type || null,
      title_th: rowData.announce_title_th || "",
      title_en: rowData.announce_title_en || "",
      detail_th: rowData.announce_desc_th || "",
      detail_en: rowData.announce_desc_en || "",
      link: rowData.announce_url || "",
    });
    setDialog({ open: true, action: "แก้ไข", data: rowData });
  };

  const handleCancel = () =>
    setDialog({ open: false, action: "เพิ่ม", data: null });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setSubmitted(true);

      const requiredFields = [
        "announce_date",
        "announce_start",
        "announce_end",
        "announce_type",
        "announce_file_types",
        "title_th",
        "title_en",
        "detail_th",
        "detail_en",
      ];
      const invalid = requiredFields.some((f) => !formData[f]);
      if (invalid) return;
      if (formData.announce_end < formData.announce_start) return;

      const payload = {
        announce_seq: dialog.data?.announce_seq,
        announce_start_date: formData.announce_start,
        announce_finish_date: formData.announce_end,
        announce_title_th: formData.title_th,
        announce_title_en: formData.title_en,
        announce_desc_th: formData.detail_th,
        announce_desc_en: formData.detail_en,
        announce_url: formData.link,
        announce_type: formData.announce_type,
        announce_file_types: formData.announce_file_types,
        record_status: "A",
        files: [...imageFiles, ...pdfFiles],
      };

      let res;
      if (dialog.action === "แก้ไข") {
        res = await LPADM03Services.UpdateData(payload);
        showMsg("success", "สำเร็จ", "แก้ไขข่าวประกาศเรียบร้อยแล้ว");
      } else {
        res = await LPADM03Services.AddData(payload);
        showMsg("success", "สำเร็จ", "เพิ่มข่าวประกาศเรียบร้อยแล้ว");
      }

      if (res?.status === 200) {
        await onRefresh();
        setDialog({ open: false, action: "เพิ่ม", data: null });
      }
    } catch (err) {
      showMsg(
        "error",
        "เกิดข้อผิดพลาด",
        err?.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <div className="table-header">
      <div className="header-left">
        <Button
          className="p-button-rounded p-button-info"
          label="เพิ่มข่าวประกาศ"
          icon="pi pi-plus"
          onClick={() => {
            setFormData({
              announce_date: null,
              announce_start: null,
              announce_end: null,
              announce_type: null,
              announce_file_types: null,
              title_th: "",
              title_en: "",
              detail_th: "",
              detail_en: "",
              link: "",
            });
            setDialog({ open: true, action: "เพิ่ม", data: null });
          }}
          style={{ marginBottom: 20 }}
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

  const actionBodyEdit = (rowData) => (
    <div style={{ textAlign: "center" }}>
      <Button
        onClick={() => openEditDialog(rowData)}
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        tooltip="แก้ไข"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  const actionBodyViewFile = (rowData) => (
    <div style={{ textAlign: "center" }}>
      <Button
        icon="pi pi-file"
        className="p-button-rounded p-button-secondary"
        tooltip="ไฟล์แนบ"
      />
    </div>
  );

  return (
    <>
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      <DataTable
        value={dataTable}
        dataKey="announce_seq"
        paginator
        rows={10}
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
          style={{ textAlign: "center", width: 100 }}
        />
        <Column
          field="announce_date"
          header="วันที่ประกาศ"
          body={(e) => formatDateTH(e.announce_date, false)}
          style={{ textAlign: "center", width: 170 }}
        />
        <Column
          field="announce_finish_date"
          header="วันที่สิ้นสุดประกาศ"
          body={(e) => formatDateTH(e.announce_finish_date, false)}
          style={{ textAlign: "center", width: 170 }}
        />
        <Column
          field="announce_title_th"
          header="หัวข้อข่าวประกาศ (ภาษาไทย)"
          style={{ textAlign: "center", width: 300 }}
        />
        <Column
          field="announce_title_en"
          header="หัวข้อข่าวประกาศ (ภาษาอังกฤษ)"
          style={{ textAlign: "center", width: 300 }}
        />
        <Column
          field="announce_type"
          header="ประเภทข่าวประกาศ"
          body={(e) => e.announce_type || "-"}
          style={{ textAlign: "center", width: 240 }}
        />
        <Column
          header="ไฟล์แนบ"
          body={actionBodyViewFile}
          style={{ width: 100 }}
        />
        <Column header="แก้ไข" body={actionBodyEdit} style={{ width: 100 }} />
      </DataTable>

      <Dialog
        header={`${dialog.action} ข่าวประกาศ`}
        visible={dialog.open}
        style={{ width: "70vw" }}
        modal
        onHide={handleCancel}
      >
        <div className="p-fluid">
          <div className="p-grid p-formgrid">
            {/* --- วันที่ประกาศ --- */}
            <div className="p-field p-col-6">
              <label>
                วันที่ประกาศ <span style={{ color: "red" }}>*</span>
              </label>
              <Calendar
                value={formData.announce_date || new Date()} // ✅ แสดงวันปัจจุบัน
                onChange={(e) => handleChange("announce_date", e.value)}
                showIcon
                dateFormat="dd/mm/yy"
                className={
                  validateField(formData.announce_date) ? "p-invalid" : ""
                }
              />
              {validateField(formData.announce_date) && (
                <small className="p-error">กรุณาเลือกวันที่ประกาศ</small>
              )}
            </div>

            {/* --- ประเภทข่าว --- */}
            <div className="p-field p-col-6">
              <label>
                ประเภทข่าว <span style={{ color: "red" }}>*</span>
              </label>
              <Dropdown
                value={formData.announce_type}
                options={types}
                onChange={(e) => handleChange("announce_type", e.value)}
                placeholder="-กรุณาเลือก-"
                className={
                  validateField(formData.announce_type) ? "p-invalid" : ""
                }
              />
            </div>

            {/* --- วันที่เริ่มต้น/สิ้นสุด --- */}
            <div className="p-field p-col-6">
              <label>
                วันที่เริ่มต้นประกาศ <span style={{ color: "red" }}>*</span>
              </label>
              <Calendar
                value={formData.announce_start || null}
                onChange={(e) => handleChange("announce_start", e.value)}
                showIcon
                showTime
                className={
                  validateField(formData.announce_start) ? "p-invalid" : ""
                }
              />
            </div>

            <div className="p-field p-col-6">
              <label>
                วันที่สิ้นสุดประกาศ <span style={{ color: "red" }}>*</span>
              </label>
              <Calendar
                value={formData.announce_end || null}
                onChange={(e) => handleChange("announce_end", e.value)}
                showIcon
                showTime
                className={
                  validateField(formData.announce_end) ? "p-invalid" : ""
                }
              />
            </div>

            {/* --- หัวข้อประกาศ (ภาษาไทย) --- */}
            <div className="p-field p-col-6">
              <label>
                หัวข้อประกาศ (ภาษาไทย) <span style={{ color: "red" }}>*</span>
              </label>
              <InputText
                value={formData.title_th || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/; // ✅ จำกัดเฉพาะภาษาไทย
                  if (val === "" || regexTH.test(val))
                    handleChange("title_th", val);
                }}
                className={validateField(formData.title_th) ? "p-invalid" : ""}
                placeholder="กรุณากรอกเฉพาะภาษาไทย"
              />
            </div>

            {/* --- หัวข้อประกาศ (ภาษาอังกฤษ) --- */}
            <div className="p-field p-col-6">
              <label>
                หัวข้อประกาศ (ภาษาอังกฤษ){" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <InputText
                value={formData.title_en || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/; // ✅ จำกัดเฉพาะภาษาอังกฤษ
                  if (val === "" || regexEN.test(val))
                    handleChange("title_en", val);
                }}
                className={validateField(formData.title_en) ? "p-invalid" : ""}
                placeholder="กรุณากรอกเฉพาะภาษาอังกฤษ"
              />
            </div>

            {/* --- รายละเอียดประกาศ (ภาษาไทย) --- */}
            <div className="p-field p-col-12">
              <label>รายละเอียดประกาศ (ภาษาไทย)</label>
              <Editor
                style={{ height: "150px" }}
                value={formData.detail_th || ""}
                onTextChange={(e) => {
                  const val = e.htmlValue;
                  const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/;
                  if (
                    val === "" ||
                    regexTH.test(val.replace(/<[^>]*>?/gm, ""))
                  ) {
                    handleChange("detail_th", val);
                  }
                }}
              />
            </div>

            {/* --- รายละเอียดประกาศ (ภาษาอังกฤษ) --- */}
            <div className="p-field p-col-12">
              <label>รายละเอียดประกาศ (ภาษาอังกฤษ)</label>
              <Editor
                style={{ height: "150px" }}
                value={formData.detail_en || ""}
                onTextChange={(e) => {
                  const val = e.htmlValue;
                  const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/;
                  if (
                    val === "" ||
                    regexEN.test(val.replace(/<[^>]*>?/gm, ""))
                  ) {
                    handleChange("detail_en", val);
                  }
                }}
              />
            </div>

            {/* --- ลิงก์ --- */}
            <div className="p-field p-col-12">
              <label>ลิงก์เพิ่มเติม (ถ้ามี)</label>
              <InputText
                placeholder="www.example.com"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>

            {/* --- ปุ่ม --- */}
            <div className="dialog-footer-action-right">
              <Button
                label="ยกเลิก"
                icon="pi pi-times"
                onClick={handleCancel}
                className="p-button-secondary p-button-rounded"
              />
              <Button
                label="บันทึก"
                icon="pi pi-check"
                className="p-button-rounded p-button-info"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
