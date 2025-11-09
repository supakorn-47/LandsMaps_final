import React, { useState } from "react";
import { Toast } from "primereact/toast";
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
import { TabView, TabPanel } from "primereact/tabview";

export default function LPADM03List({ dataTable, setDeleteDialog, onReload }) {
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
  const [imageInputs, setImageInputs] = useState([{ id: Date.now() }]);
  const [pdfInputs, setPdfInputs] = useState([{ id: Date.now() }]);

  const [fileDialog, setFileDialog] = useState({ open: false, data: [] });
  const [loadingFile, setLoadingFile] = useState(false);
  const addImageInput = () => {
    setImageInputs((prev) => [...prev, { id: Date.now() }]);
  };

  const removeImageInput = (id) => {
    setImageInputs((prev) => prev.filter((input) => input.id !== id));
    setImageFiles((prev) => prev.filter((_, i) => i !== id));
  };

  const addPdfInput = () => {
    setPdfInputs((prev) => [...prev, { id: Date.now() }]);
  };

  const removePdfInput = (id) => {
    setPdfInputs((prev) => prev.filter((input) => input.id !== id));
    setPdfFiles((prev) => prev.filter((_, i) => i !== id));
  };

  const onViewFileClick = async (rowData) => {
    setLoadingFile(true);
    try {
      const res = await LPADM03Services.GetAnnounceFileList({
        announce_seq: rowData.announce_seq,
      });

      const msg = res?.errors?.message || "";
      const isORAError =
        msg.includes("ORA-00904") || msg.includes("invalid identifier");
      const files = Array.isArray(res?.result) ? res.result : [];
      setFileDialog({ open: true, data: files });
    } catch {
      setFileDialog({ open: true, data: [] });
    } finally {
      setLoadingFile(false);
    }
  };
  const validateField = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    return false;
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const handlePdfChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
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

    setImageFiles([]);
    setPdfFiles([]);

    setDialog({ open: true, action: "แก้ไข", data: rowData });
  };

  const handleSave = async () => {
    try {
      // ✅ รวมไฟล์ก่อนส่ง
      const allFiles = [...imageFiles, ...pdfFiles];
      const body = { ...formData, files: allFiles };

      let res;
      if (dialog.action === "แก้ไข") {
        res = await LPADM03Services.UpdateData(body);
      } else {
        res = await LPADM03Services.AddData(body);
      }

      if (res?.status === 200) {
        await onReload();
        setDialog({ open: false, action: "บันทึก", data: null });
        setImageFiles([]);
        setPdfFiles([]);
      }
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
    <div style={{ textAlign: "center" }}>
      <Button
        icon="pi pi-file"
        className="p-button-rounded p-button-secondary"
        tooltip="ไฟล์แนบ"
        onClick={() => onViewFileClick(rowData)}
      />
    </div>
  );
  return (
    <>
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
            {/* --- วันที่ประกาศ --- */}
            <div className="p-field p-col-6">
              <label>วันที่ประกาศ</label>
              <Calendar
                value={formData.announce_date || new Date()}
                onChange={(e) => handleChange("announce_date", e.value)}
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>

            {/* --- ประเภทข่าว --- */}
            <div className="p-field p-col-6">
              <label>ประเภทข่าว</label>
              <Dropdown
                value={formData.announce_type}
                options={types}
                onChange={(e) => handleChange("announce_type", e.value)}
                placeholder="-กรุณาเลือก-"
              />
            </div>
            {/* --- วันที่เริ่มต้นประกาศ --- */}
            <div className="p-field p-col-6">
              <label>วันที่เริ่มต้นประกาศ</label>
              <Calendar
                value={formData.announce_start_date || new Date()}
                onChange={(e) => handleChange("announce_start_date", e.value)}
                showIcon
                showTime
                hourFormat="24"
                dateFormat="dd/mm/yy"
              />
            </div>

            {/* --- วันที่สิ้นสุดประกาศ --- */}
            <div className="p-field p-col-6">
              <label>วันที่สิ้นสุดประกาศ</label>
              <Calendar
                value={formData.announce_finish_date || new Date()}
                onChange={(e) => handleChange("announce_finish_date", e.value)}
                showIcon
                showTime
                hourFormat="24"
                dateFormat="dd/mm/yy"
              />
            </div>

            {/* --- หัวข้อประกาศ (ภาษาไทย) --- */}
            <div className="p-field p-col-6">
              <label>หัวข้อประกาศ (ภาษาไทย)</label>
              <InputText
                value={formData.announce_title_th || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/; //
                  if (val === "" || regexTH.test(val))
                    handleChange("announce_title_th", val);
                }}
                placeholder="กรุณากรอกเฉพาะภาษาไทย"
              />
            </div>

            {/* --- หัวข้อประกาศ (ภาษาอังกฤษ) --- */}
            <div className="p-field p-col-6">
              <label>หัวข้อประกาศ (ภาษาอังกฤษ)</label>
              <InputText
                value={formData.announce_title_en || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/;
                  if (val === "" || regexEN.test(val))
                    handleChange("announce_title_en", val);
                }}
                placeholder="กรุณากรอกเฉพาะภาษาอังกฤษ"
              />
            </div>

            {/* --- รายละเอียดประกาศ (ภาษาไทย) --- */}
            <div className="p-field p-col-12">
              <label>รายละเอียดประกาศ (ภาษาไทย)</label>
              <Editor
                style={{ height: "150px" }}
                value={formData.announce_desc_th || ""}
                onTextChange={(e) => {
                  const val = e.htmlValue;
                  const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/;
                  if (
                    val === "" ||
                    regexTH.test(val.replace(/<[^>]*>?/gm, ""))
                  ) {
                    handleChange("announce_desc_th", val);
                  }
                }}
                headerTemplate={customToolbar}
              />
            </div>

            {/* --- รายละเอียดประกาศ (ภาษาอังกฤษ) --- */}
            <div className="p-field p-col-12">
              <label>รายละเอียดประกาศ (ภาษาอังกฤษ)</label>
              <Editor
                style={{ height: "150px" }}
                value={formData.announce_desc_en || ""}
                onTextChange={(e) => {
                  const val = e.htmlValue;
                  const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/;
                  if (
                    val === "" ||
                    regexEN.test(val.replace(/<[^>]*>?/gm, ""))
                  ) {
                    handleChange("announce_desc_en", val);
                  }
                }}
                headerTemplate={customToolbar}
              />
            </div>
          </div>
        </div>

        <div className="p-field p-col-12">
          <label>ลิงก์เพิ่มเติม (ถ้ามี)</label>
          <InputText
            placeholder="www.example.com"
            value={formData.announce_url}
            onChange={(e) => handleChange("announce_url", e.target.value)}
          />
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
              onClick={addImageInput}
            />
            <p style={{ color: "red", margin: "5px 0" }}>
              *ไฟล์ภาพเฉพาะนามสกุล .png, .jpeg เท่านั้น
            </p>

            {imageInputs.map((input, index) => (
              <div
                key={input.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label>{index + 1}. รูปภาพ</label>
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-sm"
                  onClick={() => removeImageInput(input.id)}
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
              onClick={addPdfInput}
            />
            <p style={{ color: "red", margin: "5px 0" }}>
              *ไฟล์แนบเฉพาะนามสกุล .pdf เท่านั้น
            </p>

            {pdfInputs.map((input, index) => (
              <div
                key={input.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label>{index + 1}. ไฟล์แนบ</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handlePdfChange(e, index)}
                  />
                </div>
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-sm"
                  onClick={() => removePdfInput(input.id)}
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
      </Dialog>
      <Dialog
        header="แสดงรูปภาพ"
        visible={fileDialog.open}
        style={{ width: "60vw" }}
        modal
        onHide={() => setFileDialog({ ...fileDialog, open: false })}
      >
        {loadingFile ? (
          <p style={{ textAlign: "center" }}>กำลังโหลดไฟล์...</p>
        ) : (
          <TabView>
            <TabPanel header="ไฟล์รูปภาพ">
              {fileDialog.data
                .filter((f) => f.file_type === "IMAGE")
                .map((img, i) => (
                  <div key={i} style={{ marginBottom: "1rem" }}>
                    <img
                      src={`data:image/png;base64,${img.file_data}`}
                      alt={img.file_name}
                      width="150"
                      style={{
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <p>{img.file_name}</p>
                  </div>
                ))}
            </TabPanel>

            <TabPanel header="ไฟล์เอกสาร (PDF)">
              {fileDialog.data
                .filter((f) => f.file_type === "PDF")
                .map((doc, i) => (
                  <div key={i} style={{ marginBottom: "0.5rem" }}>
                    <a
                      href={`data:application/pdf;base64,${doc.file_data}`}
                      download={doc.file_name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.file_name}
                    </a>
                  </div>
                ))}
            </TabPanel>
          </TabView>
        )}
      </Dialog>
    </>
  );
}
