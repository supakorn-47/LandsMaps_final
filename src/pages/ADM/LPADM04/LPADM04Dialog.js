import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import CustomCard from "../../../components/CustomCard/CustomCard";

export default function LPADM04Dialog({
  dialog = {},
  setDialog,
  submitForm,
  onCreateDataSurveyUser,
  formObject: formObjectProp,
  setformObject: setformObjectProp,
  checkBox = [],
  setCheckBox,
}) {
  const [formData, setFormData] = useState({
    createdDate: null,
    startDate: null,
    endDate: null,
    title_th: "",
    title_en: "",
    remark: "",
  });

  // ✅ Local fallback ถ้า parent ไม่ส่ง props formObject เข้ามา
  const [localFormObject, setLocalFormObject] = useState([]);
  const formObject = formObjectProp || localFormObject;
  const setformObject = setformObjectProp || setLocalFormObject;

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
        createdDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        title_th: "",
        title_en: "",
        remark: "",
      });
    }
  }, [dialog]);

  const onChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /* -------------------- เพิ่ม/แก้ไขแบบสำรวจ -------------------- */
  const addAndUpdateDialog = () => (
    <Dialog
      header={
        dialog.action === "แก้ไข"
          ? "แก้ไขแบบสำรวจความพึงพอใจ"
          : "เพิ่มแบบสำรวจความพึงพอใจ"
      }
      visible={dialog?.dialog ?? false}
      style={{ width: "50vw" }}
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
            value={formData.createdDate || new Date()}
            onChange={(e) => onChange("createdDate", e.value)}
            showIcon
          />
        </div>

        <div className="p-field p-col-12 p-md-6">
          <label>
            วันที่สิ้นสุดสำรวจ <span style={{ color: "red" }}>*</span>
          </label>
          <Calendar
            value={formData.endDate || new Date()}
            onChange={(e) => onChange("endDate", e.value)}
            showIcon
          />
        </div>

        <div className="p-field p-col-12 p-md-6">
          <label>
            วันที่เริ่มต้นสำรวจ <span style={{ color: "red" }}>*</span>
          </label>
          <Calendar
            value={formData.startDate || new Date()}
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
            onChange={(e) => {
              const val = e.target.value;
              const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/;
              if (val === "" || regexTH.test(val)) onChange("title_th", val);
            }}
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
            onChange={(e) => {
              const val = e.target.value;
              const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/;
              if (val === "" || regexEN.test(val)) onChange("title_en", val);
            }}
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

        <div
          className="dialog-footer-action-right"
          style={{ textAlign: "right", marginTop: "1rem" }}
        >
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => setDialog({ dialog: false, action: "", data: null })}
            className="p-button-secondary p-button-rounded"
          />
          <Button
            label="บันทึก"
            icon="pi pi-check"
            className="p-button-rounded p-button-info"
            onClick={() => submitForm(formData)}
            style={{ marginLeft: "0.5rem" }}
          />
        </div>
      </div>
    </Dialog>
  );

  /* -------------------- กำหนดกลุ่มผู้ใช้งาน -------------------- */
  const configGroupDialog = () => {
    const onUserGroupDataCheck = (value, index) => {
      let arr = [...checkBox];
      arr[index].check_from = value.checked ? "1" : "0";
      setCheckBox(arr);
    };

    const footer = () => (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label={dialog.action}
          icon="pi pi-check"
          onClick={() => onCreateDataSurveyUser(dialog.dataForm)}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );

    return (
      <Dialog
        header={"กำหนดกลุ่มผู้ใช้งาน"}
        visible={dialog.dialogGroup}
        style={{ width: "40vw" }}
        footer={footer()}
        onHide={() => setDialog(false)}
        blockScroll
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-12">
            <div className="p-col-12">กำหนดกลุ่มผู้ใช้งาน</div>
            {checkBox.map((value, index) => (
              <div key={index} className="p-col-12">
                <Checkbox
                  checked={value.check_from === "1"}
                  onChange={(e) => onUserGroupDataCheck(e, index)}
                />
                <label className="p-checkbox-label">
                  {value.register_type_th}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    );
  };

  /* -------------------- กำหนดคำถาม -------------------- */
  const configQuestionEx = () => {
    const onCreatePatternQuestion = () => {
      const newQuestion = {
        list_seq: 0,
        form_seq: dialog?.data?.form_seq || 0,
        list_ord: 0,
        list_name_th: "",
        list_name_en: "",
        require_flag: 0,
        survey_sublist: [
          {
            sublist_seq: 0,
            list_seq: 0,
            sublist_ord: 0,
            sublist_type: "",
            sublist_desc_th: "",
            sublist_desc_en: "",
            sublist_icon: "",
            sublist_value: "",
          },
        ],
      };

      setformObject((prev) => [...prev, newQuestion]);
    };

    const onCreatePatternAnswer = (index) => {
      const newAnswers = [...formObject];
      newAnswers[index].survey_sublist.push({
        sublist_seq: 0,
        list_seq: 0,
        sublist_ord: 0,
        sublist_type: "",
        sublist_desc_th: "",
        sublist_desc_en: "",
        sublist_icon: "",
        sublist_value: "",
      });
      setformObject(newAnswers);
    };

    const removePattern = (type, index, indexSub) => {
      const updated = [...formObject];
      if (type === "list") updated.splice(index, 1);
      else if (type === "sub")
        updated[index].survey_sublist.splice(indexSub, 1);
      setformObject(updated);
    };

    const onRequireChange = (value, indexList) => {
      const updated = [...formObject];
      updated[indexList].require_flag = value ? 1 : 0;
      setformObject(updated);
    };

    const onFieldChangeList = (value, index, lan) => {
      const updated = [...formObject];
      if (lan === "th") updated[index].list_name_th = value;
      else updated[index].list_name_en = value;
      setformObject(updated);
    };

    const onFieldChangeTextSub = (value, indexList, indexSub, lan) => {
      const updated = [...formObject];
      if (lan === "th")
        updated[indexList].survey_sublist[indexSub].sublist_desc_th = value;
      else updated[indexList].survey_sublist[indexSub].sublist_desc_en = value;
      setformObject(updated);
    };

    const onDropdownChange = (value, indexList, indexSub) => {
      const updated = [...formObject];
      updated[indexList].survey_sublist[indexSub].sublist_type = value;
      setformObject(updated);
    };

    const footer = () => (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => submitForm(formObject)}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );

    return (
      <Dialog
        header={"กำหนดคำถาม"}
        visible={dialog.dialogConfigQuestion}
        style={{ width: "60vw" }}
        footer={footer()}
        onHide={() => setDialog(false)}
        blockScroll
        className="p-fluid"
        maximizable
      >
        <div className="survey-wrapper">
          <Button
            label="เพิ่มคำถาม"
            icon="pi pi-plus"
            onClick={onCreatePatternQuestion}
            className="p-button-rounded p-button-info"
            style={{ width: "fit-content", height: "2rem", marginBottom: 10 }}
          />

          {formObject.length > 0 &&
            formObject.map((list, indexList) => (
              <CustomCard
                key={indexList}
                body={
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <p style={{ flex: 1, fontWeight: "bold" }}>
                        ข้อที่ {indexList + 1}
                      </p>
                      <div className="p-grid p-col-2">
                        <Button
                          onClick={() => removePattern("list", indexList)}
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-danger"
                          label="ลบคำถาม"
                        />
                      </div>
                    </div>

                    <div className="p-fluid p-formgrid p-grid">
                      <div className="p-col-6">
                        <InputText
                          value={list.list_name_th}
                          onChange={(e) => {
                            const val = e.target.value;
                            const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/;
                            if (val === "" || regexTH.test(val)) {
                              onFieldChangeList(val, indexList, "th");
                            }
                          }}
                          placeholder="กรุณาระบุคำถามภาษาไทย"
                          maxLength={255}
                        />
                      </div>
                      <div className="p-col-6">
                        <InputText
                          value={list.list_name_en}
                          onChange={(e) => {
                            const val = e.target.value;
                            const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/;
                            if (val === "" || regexEN.test(val)) {
                              onFieldChangeList(val, indexList, "en");
                            }
                          }}
                          placeholder="กรุณาระบุคำถามภาษาอังกฤษ"
                          maxLength={255}
                        />
                      </div>
                      <div className="p-col-12">
                        <Checkbox
                          checked={list.require_flag === 1}
                          onChange={(e) =>
                            onRequireChange(e.checked, indexList)
                          }
                        />
                        <span style={{ marginLeft: 4 }}>Require</span>
                      </div>
                    </div>

                    <div className="p-grid p-col-2">
                      <Button
                        onClick={() => onCreatePatternAnswer(indexList)}
                        icon="pi pi-plus"
                        className="p-button-rounded p-button-info"
                        label="เพิ่มคำตอบ"
                      />
                    </div>

                    {list.survey_sublist.map((subList, indexSub) => (
                      <div
                        key={indexSub}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <div className="p-grid" style={{ flex: 1 }}>
                            <div className="p-col-4">
                              <Dropdown
                                options={[
                                  { label: "Radio", value: "1" },
                                  { label: "Checkbox", value: "2" },
                                  { label: "Textbox", value: "3" },
                                ]}
                                placeholder="กรุณาเลือกรูปแบบ"
                                value={subList.sublist_type}
                                onChange={(e) =>
                                  onDropdownChange(e.value, indexList, indexSub)
                                }
                              />
                            </div>
                            <div className="p-col-4">
                              <InputText
                                value={subList.sublist_desc_th}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const regexTH = /^[ก-๙0-9\s.,()'"!?-]*$/;
                                  if (val === "" || regexTH.test(val)) {
                                    onFieldChangeTextSub(
                                      val,
                                      indexList,
                                      indexSub,
                                      "th"
                                    );
                                  }
                                }}
                                placeholder="กรุณาระบุคำตอบภาษาไทย"
                              />
                            </div>
                            <div className="p-col-4">
                              <InputText
                                value={subList.sublist_desc_en}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const regexEN = /^[A-Za-z0-9\s.,()'"!?-]*$/;
                                  if (val === "" || regexEN.test(val)) {
                                    onFieldChangeTextSub(
                                      val,
                                      indexList,
                                      indexSub,
                                      "en"
                                    );
                                  }
                                }}
                                placeholder="กรุณาระบุคำตอบภาษาอังกฤษ"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              removePattern("sub", indexList, indexSub)
                            }
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                }
              />
            ))}
        </div>
      </Dialog>
    );
  };

  return (
    <>
      {addAndUpdateDialog()}
      {dialog.dialogConfigQuestion && configQuestionEx()}
      {dialog.dialogGroup && configGroupDialog()}
    </>
  );
}
