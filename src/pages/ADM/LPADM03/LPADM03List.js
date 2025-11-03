import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { Dialog } from "primereact/dialog";
import { formatDateTH } from "../../../utils/DateUtil";
import LPADM03Services from "../../../service/ServiceADM/ServiceLPADM03";

export default function LPADM03List({
  dataTable,
  setDeleteDialog,
  onViewFileClick,
  onReload,
}) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialog, setDialog] = useState({
    open: false,
    action: "บันทึก",
    data: null,
  });
  const [formData, setFormData] = useState({
    announce_seq: 0,
    announce_start_date: null,
    announce_finish_date: null,
    announce_title_th: "",
    announce_title_en: "",
    announce_desc_th: "",
    announce_desc_en: "",
    announce_url: "",
    announce_type: "1",
    files: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    setPdfFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removePdf = (index) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const customToolbar = (
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-color" />
      <button className="ql-background" />
      <button className="ql-clean" />
    </span>
  );

  const types = [
    { label: "ข่าวกรมที่ดิน", value: "ข่าวกรมที่ดิน" },
    { label: "ข่าว LandsMaps Platform", value: "ข่าว LandsMaps Platform" },
    { label: "ข่าว อปท.", value: "ข่าว อปท." },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setDialog({ open: false, action: "บันทึก", data: null });
  };

  const openEditDialog = (rowData) => {
    setFormData({
      announce_seq: rowData.announce_seq || 0,
      announce_start_date: rowData.announce_start_date
        ? new Date(rowData.announce_start_date)
        : null,
      announce_finish_date: rowData.announce_finish_date
        ? new Date(rowData.announce_finish_date)
        : null,
      announce_title_th: rowData.announce_title_th || "",
      announce_title_en: rowData.announce_title_en || "",
      announce_desc_th:
        rowData.announce_desc_th ||
        rowData.announce_desc ||
        rowData.announce_detail_th ||
        "",
      announce_desc_en:
        rowData.announce_desc_en || rowData.announce_detail_en || "",
      announce_url: rowData.announce_url || "",
      announce_type: String(rowData.announce_type || "1"),
      files: [],
    });
    setDialog({ open: true, action: "แก้ไข", data: rowData });
  };

  const handleSave = async () => {
    try {
      let res;
      if (dialog.action === "แก้ไข") {
        res = await LPADM03Services.UpdateData(formData);
      } else {
        res = await LPADM03Services.AddData(formData);
      }
      if (res?.status === 200) {
        await onReload();
      }
      setDialog({ open: false, action: "บันทึก", data: null });
    } catch (err) {
      console.error("[handleSave Error]", err);
    }
  };

  const header = (
    <div
      className="table-header"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div>
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
              title_th: "",
              title_en: "",
              detail_th: "",
              detail_en: "",
              link: "",
            });
            setImageFiles([]);
            setPdfFiles([]);
            setDialog({ open: true, action: "บันทึก", data: null });
          }}
        />
      </div>
      <div>
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
    <Button
      onClick={() => openEditDialog(rowData)}
      icon="pi pi-pencil"
      className="p-button-rounded p-button-warning"
      tooltip="แก้ไข"
    />
  );

  const actionBodyDelete = (rowData) => (
    <Button
      onClick={() =>
        setDeleteDialog({ open: true, data: rowData, onClickDelete: "ROW" })
      }
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger"
      tooltip="ลบ"
    />
  );

  const actionBodyViewFile = (rowData) => (
    <Button
      onClick={() => onViewFileClick(rowData)}
      icon="pi pi-file"
      className="p-button-rounded p-button-secondary"
      tooltip="ไฟล์แนบ"
    />
  );

  return (
    <>
      <DataTable
        value={dataTable}
        dataKey="id"
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
          style={{ width: 80, textAlign: "center" }}
        />
        <Column
          field="announce_date"
          header="วันที่ประกาศ"
          body={(e) =>
            e.announce_date ? formatDateTH(e.announce_date, true) : "-"
          }
          style={{ width: 150, textAlign: "center" }}
        />
        <Column
          field="announce_start_date"
          header="วันที่เริ่มต้นประกาศ"
          body={(e) =>
            e.announce_start_date
              ? formatDateTH(e.announce_start_date, true)
              : "-"
          }
          style={{ width: 150, textAlign: "center" }}
        />
        <Column
          field="announce_finish_date"
          header="วันที่สิ้นสุดประกาศ"
          body={(e) =>
            e.announce_finish_date
              ? formatDateTH(e.announce_finish_date, true)
              : "-"
          }
          style={{ width: 150, textAlign: "center" }}
        />
        <Column
          field="announce_title_th"
          header="หัวข้อข่าวประกาศ (ภาษาไทย)"
          style={{ width: 300 }}
        />
        <Column
          field="announce_title_en"
          header="หัวข้อข่าวประกาศ (ภาษาอังกฤษ)"
          style={{ width: 300 }}
        />
        <Column
          header="ไฟล์แนบ"
          body={actionBodyViewFile}
          style={{ width: 80 }}
        />
        <Column header="แก้ไข" body={actionBodyEdit} style={{ width: 80 }} />
        <Column header="ลบ" body={actionBodyDelete} style={{ width: 80 }} />
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
            <div className="p-field p-col-6">
              <label>วันที่ประกาศ</label>
              <Calendar
                value={formData.announce_date}
                onChange={(e) => handleChange("announce_date", e.value)}
                showIcon
              />
            </div>

            <div className="p-field p-col-6">
              <label>ประเภทข่าว</label>
              <Dropdown
                value={formData.announce_type}
                options={types}
                onChange={(e) => handleChange("announce_type", e.value)}
                placeholder="-กรุณาเลือก-"
              />
            </div>

            <div className="p-field p-col-6">
              <label>วันที่เริ่มต้นประกาศ</label>
              <Calendar
                value={formData.announce_start}
                onChange={(e) => handleChange("announce_start", e.value)}
                showIcon
                showTime
              />
            </div>

            <div className="p-field p-col-6">
              <label>วันที่สิ้นสุดประกาศ</label>
              <Calendar
                value={formData.announce_end}
                onChange={(e) => handleChange("announce_end", e.value)}
                showIcon
                showTime
              />
            </div>

            <div className="p-field p-col-6">
              <label>หัวข้อประกาศ (ภาษาไทย)</label>
              <InputText
                value={formData.announce_title_th}
                onChange={(e) =>
                  handleChange("announce_title_th", e.target.value)
                }
              />
            </div>

            <div className="p-field p-col-6">
              <label>หัวข้อประกาศ (ภาษาอังกฤษ)</label>
              <InputText
                value={formData.announce_title_en}
                onChange={(e) =>
                  handleChange("announce_title_en", e.target.value)
                }
              />
            </div>

            <div className="p-field p-col-12">
              <label>รายละเอียดประกาศ (ภาษาไทย)</label>
              <Editor
                style={{ height: "150px" }}
                value={formData.announce_desc_th}
                onTextChange={(e) =>
                  handleChange("announce_desc_th", e.htmlValue)
                }
                headerTemplate={customToolbar}
              />
            </div>

            <div className="p-field p-col-12">
              <label>รายละเอียดประกาศ (ภาษาอังกฤษ)</label>
              <Editor
                style={{ height: "150px" }}
                value={formData.announce_desc_en}
                onTextChange={(e) =>
                  handleChange("announce_desc_en", e.htmlValue)
                }
                headerTemplate={customToolbar}
              />
            </div>

            <div className="p-field p-col-12">
              <label>ลิงก์เพิ่มเติม (ถ้ามี)</label>
              <InputText
                placeholder="www.example.com"
                value={formData.announce_url}
                onChange={(e) => handleChange("announce_url", e.target.value)}
              />
            </div>
          </div>

          <div
            className="p-col-12"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div>
              <Button
                label="เพิ่มรูปภาพ"
                icon="pi pi-plus"
                className="p-button-rounded p-button-info"
                style={{ width: "150px" }}
                onClick={() => document.getElementById("imageUpload").click()}
              />
              <p style={{ color: "red", margin: "5px 0" }}>
                *ไฟล์ภาพเฉพาะนามสกุล .png, .jpeg เท่านั้น
              </p>
              <input
                id="imageUpload"
                type="file"
                accept=".png,.jpeg,.jpg"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              {imageFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    {index + 1}. {file.name}
                  </span>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm"
                    onClick={() => removeImage(index)}
                  />
                </div>
              ))}
            </div>

            <div>
              <Button
                label="เพิ่มไฟล์ PDF"
                icon="pi pi-plus"
                className="p-button-rounded p-button-info"
                style={{ width: "150px" }}
                onClick={() => document.getElementById("pdfUpload").click()}
              />
              <p style={{ color: "red", margin: "5px 0" }}>
                *ไฟล์แนบเฉพาะนามสกุล .pdf เท่านั้น
              </p>
              <input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handlePdfChange}
              />
              {pdfFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    {index + 1}. {file.name}
                  </span>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm"
                    onClick={() => removePdf(index)}
                  />
                </div>
              ))}
            </div>
          </div>

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
              onClick={handleSave}
              className="p-button-rounded p-button-info"
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
