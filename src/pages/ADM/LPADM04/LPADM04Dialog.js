import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

export default function LPADM04Dialog({ dialog = {}, setDialog, submitForm }) {
  const [formData, setFormData] = useState({
    createdDate: null,
    startDate: null,
    endDate: null,
    title_th: "",
    title_en: "",
    remark: "",
  });

  useEffect(() => {
    if (dialog?.data && dialog.action === "แก้ไข") {
      const d = dialog.data;
      setFormData({
        createdDate: d.form_date ? new Date(d.form_date) : null,
        startDate: d.form_start_date ? new Date(d.form_start_date) : null,
        endDate: d.form_finish_date ? new Date(d.form_finish_date) : null,
        title_th: d.form_name_th || "",
        title_en: d.form_name_en || "",
        remark: d.form_remark || "",
      });
    } else if (dialog.action === "บันทึก") {
      setFormData({
        createdDate: null,
        startDate: null,
        endDate: null,
        title_th: "",
        title_en: "",
        remark: "",
      });
    }
  }, [dialog]);

  const onChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderFooter = () => (
    <div style={{ textAlign: "right" }}>
      <Button
        label="ยกเลิก"
        icon="pi pi-times"
        onClick={() => setDialog({ dialog: false, action: "", data: null })}
        className="p-button p-component p-button-secondary p-button-rounded"
      />
      <Button
        label="บันทึก"
        icon="pi pi-check"
        onClick={() => submitForm(formData)}
        className="p-button-info"
      />
    </div>
  );

  return (
    <Dialog
      header={
        dialog.action === "แก้ไข"
          ? "แก้ไขแบบสำรวจความพึงพอใจ"
          : "เพิ่มแบบสำรวจความพึงพอใจ"
      }
      visible={dialog?.dialog ?? false}
      style={{ width: "50vw" }}
      footer={renderFooter()}
      onHide={() => setDialog({ dialog: false, action: "", data: null })}
      blockScroll
      className="p-fluid"
    >
      <div className="p-formgrid p-grid">
        <div className="p-field p-col-12 p-md-6">
          <label>
            วันที่สร้างแบบสำรวจ <span style={{ color: "red" }}>*</span>
          </label>
          <Calendar
            value={formData.createdDate}
            onChange={(e) => onChange("createdDate", e.value)}
            showIcon
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label>
            วันที่สิ้นสุดสำรวจ <span style={{ color: "red" }}>*</span>
          </label>
          <Calendar
            value={formData.endDate}
            onChange={(e) => onChange("endDate", e.value)}
            showIcon
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label>
            วันที่เริ่มต้นสำรวจ <span style={{ color: "red" }}>*</span>
          </label>
          <Calendar
            value={formData.startDate}
            onChange={(e) => onChange("startDate", e.value)}
            showIcon
          />
        </div>
        <div className="p-field p-col-12 p-md-6"></div>
        <div className="p-field p-col-12 p-md-6">
          <label>
            หัวข้อแบบสำรวจ (ภาษาไทย) <span style={{ color: "red" }}>*</span>
          </label>
          <InputTextarea
            rows={5}
            value={formData.title_th}
            onChange={(e) => onChange("title_th", e.target.value)}
            style={{ height: "70px", resize: "none" }}
          />
        </div>
        <div className="p-field p-col-12 p-md-6">
          <label>
            หัวข้อแบบสำรวจ (ภาษาอังกฤษ) <span style={{ color: "red" }}>*</span>
          </label>
          <InputTextarea
            rows={5}
            value={formData.title_en}
            onChange={(e) => onChange("title_en", e.target.value)}
            style={{ height: "70px", resize: "none" }}
          />
        </div>
        <div className="p-field p-col-12">
          <label>หมายเหตุแบบสำรวจ</label>
          <InputTextarea
            rows={3}
            value={formData.remark}
            onChange={(e) => onChange("remark", e.target.value)}
          />
        </div>
      </div>
    </Dialog>
  );
}
