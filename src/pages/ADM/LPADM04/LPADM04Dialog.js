import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export default function LPADM04Dialog({ dialog = {}, setDialog }) {
  const [formData, setFormData] = useState({
    createdDate: null,
    startDate: null,
    endDate: null,
    title_th: "",
    title_en: "",
    remark: "",
  });

  const onChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
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
        onClick={() => {
          console.log("บันทึกข้อมูล: ", formData);
          setDialog({ dialog: false, action: "", data: null });
        }}
        className=" p-button-info"
      />
    </div>
  );

  return (
    <Dialog
      header="เพิ่มแบบสำรวจความพึงพอใจ"
      visible={dialog?.dialog ?? false}
      style={{ width: "50vw" }}
      footer={renderFooter()}
      onHide={() => setDialog({ dialog: false, action: "", data: null })}
      blockScroll
      className="p-fluid"
    >
      <div className="p-formgrid p-grid">
        {/* วันที่สร้าง (ซ้าย) */}
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

        {/* วันที่สิ้นสุด (ขวา) */}
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

        {/* วันที่เริ่มต้น (ซ้าย) */}
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

        {/* ช่องว่าง (ขวาเว้นไว้) */}
        <div className="p-field p-col-12 p-md-6"></div>

        {/* หัวข้อไทย (ซ้าย) */}
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

        {/* หัวข้ออังกฤษ (ขวา) */}
        <div className="p-field p-col-12 p-md-6">
          <label>
            หัวข้อแบบสำรวจ (ภาษาอังกฤษ) <span style={{ color: "red" }}>*</span>
          </label>
          <InputTextarea
            rows={5}
            value={formData.title_th}
            onChange={(e) => onChange("title_th", e.target.value)}
            style={{ height: "70px", resize: "none" }}
          />
        </div>

        {/* หมายเหตุ (เต็มบรรทัด) */}
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
