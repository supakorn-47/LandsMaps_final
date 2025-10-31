import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { validateInputText } from "../../../utils/ValidateUtil";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Calendars } from "../../../components/Calendar/Calendar";
import "./ADM07.css";

export default function ADM07Dialog({
  dialog,
  setDialog,
  submitForm,
  onCreateDataSurveyUser,
  submitted,
  setSubmitted,
}) {
  const [formObject, setformObject] = useState([]);
  const [checkBox, setCheckBox] = useState([]);

  useEffect(() => {
    if (dialog.dialogConfigQuestion == true) {
      setformObject(dialog.list);
    } else if (dialog.dialog === true && dialog.action === "แก้ไข") {
      setformObject(dialog.data);
    } else {
      setformObject({
        form_date: new Date(),
        form_start_date: new Date(),
        form_finish_date: new Date(),
        form_name_th: "",
        form_name_en: "",
        random_num: 1,
        form_remark: "",
      });
    }
  }, [dialog.data]);

  useEffect(() => {
    if (dialog.dialogGroup == true) {
      setCheckBox(dialog.dataForm);
    }
  }, [dialog.dialogGroup]);

  useEffect(() => {
    setSubmitted(false);
  }, []);

  const renderFooter = () => {
    return (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => submitForm(formObject)}
          autoFocus
          className="p-button-rounded"
        />
      </div>
    );
  };

  // เพิ่ม แก้ไข
  const addAndUpdateDialog = () => {
    return (
      <Dialog
        header={
          dialog.action == "บันทึก"
            ? "เพิ่มแบบสำรวจความพึงพอใจ"
            : dialog.action + "แบบสำรวจความพึงพอใจ"
        }
        visible={dialog.dialog}
        style={{ width: "55vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-6">
            <label>
              วันที่สร้างแบบสำรวจ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={
                formObject.form_date === ""
                  ? ""
                  : new Date(formObject.form_date)
              }
              onChange={(e) =>
                setformObject({ ...formObject, form_date: e.target.value })
              }
            />
          </div>
          <div className="p-col-6"></div>
          <div className="p-col-6">
            <label>
              วันที่เริ่มต้นสำรวจ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={
                formObject.form_start_date === ""
                  ? ""
                  : new Date(formObject.form_start_date)
              }
              maxDate={new Date(formObject.form_finish_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  form_start_date: e.target.value,
                })
              }
            />
          </div>
          <div className="p-col-6">
            <label>
              วันที่สิ้นสุดสำรวจ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={
                formObject.form_finish_date === ""
                  ? ""
                  : new Date(formObject.form_finish_date)
              }
              minDate={new Date(formObject.form_start_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  form_finish_date: e.target.value,
                })
              }
            />
          </div>
          <div className="p-col-6">
            <label>
              หัวข้อแบบสำรวจ(ภาษาไทย)<span style={{ color: "red" }}>*</span>
            </label>
            <InputTextarea
              value={formObject.form_name_th}
              rows={5}
              onChange={(e) =>
                setformObject({ ...formObject, form_name_th: e.target.value })
              }
              style={{ height: "70px", resize: "none" }}
            />
            {submitted &&
              !formObject.form_name_th &&
              validateInputText("form_name_th", "หัวข้อแบบสำรวจ(ภาษาไทย)")}
          </div>
          <div className="p-col-6">
            <label>
              หัวข้อแบบสำรวจ(ภาษาอังกฤษ)<span style={{ color: "red" }}>*</span>
            </label>
            <InputTextarea
              value={formObject.form_name_en}
              rows={5}
              onChange={(e) =>
                setformObject({ ...formObject, form_name_en: e.target.value })
              }
              style={{ height: "70px", resize: "none" }}
            />
            {submitted &&
              !formObject.form_name_en &&
              validateInputText("form_name_en", "หัวข้อแบบสำรวจ(ภาษาอังกฤษ)")}
          </div>

          <div className="p-col-12">
            <label>หมายเหตุแบบสำรวจ</label>
            <InputTextarea
              value={formObject.form_remark}
              rows={5}
              onChange={(e) =>
                setformObject({ ...formObject, form_remark: e.target.value })
              }
              style={{ height: "70px", resize: "none" }}
            />
            {submitted &&
              !formObject.form_remark &&
              validateInputText("form_name_en", "หัวข้อแบบสำรวจ(ภาษาอังกฤษ)")}
          </div>
        </div>
      </Dialog>
    );
  };

  // กำหนดกลุ่มผู้ใช้งาน
  const configGroupDialog = () => {
    const onUserGroupDataCheck = (value, index) => {
      let arr = [...checkBox];
      arr[index].check_from = value.checked === true ? "1" : "0";
      let temp = arr;
      setCheckBox(temp);
    };

    const footer = () => {
      return (
        <div style={{ textAlign: "right" }}>
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => setDialog(false)}
            className="p-button-secondary p-button-rounded"
            style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
          />
          <Button
            label={dialog.action}
            icon="pi pi-check"
            onClick={() => onCreateDataSurveyUser(dialog.dataForm)}
            autoFocus
            className="p-button-rounded"
          />
        </div>
      );
    };

    return (
      <Dialog
        header={"กำหนดกลุ่มผู้ใช้งาน"}
        visible={dialog.dialogGroup}
        style={{ width: "40vw" }}
        footer={footer()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-12">
            <div className="p-col-12">กำหนดกลุ่มผู้ใช้งาน</div>
            {checkBox.map((value, index) => {
              return (
                <div className="p-col-12">
                  <Checkbox
                    checked={value.check_from === "1" ? true : false}
                    value={value.check_from}
                    onChange={(e) => onUserGroupDataCheck(e, index)}
                  ></Checkbox>
                  <label className="p-checkbox-label">
                    {value.register_type_th}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </Dialog>
    );
  };

  // กำหนดคำถาม
  const configQuestionEx = () => {
    const onCreatePatternQuestion = () => {
      formObject.push({
        list_seq: 0,
        form_seq: dialog.data.form_seq,
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
      });
      setformObject([...formObject]);
    };

    const onCreatePatternAnswer = (index) => {
      formObject[index].survey_sublist.push({
        sublist_seq: 0,
        list_seq: 0,
        sublist_ord: 0,
        sublist_type: "",
        sublist_desc_th: "",
        sublist_desc_en: "",
        sublist_icon: "",
        sublist_value: "",
      });
      setformObject([...formObject]);
    };

    const removePattern = (type, index, indexSub) => {
      if (type === "list") {
        formObject.splice(index, 1);
      } else if (type === "sub") {
        formObject[index].survey_sublist.splice(indexSub, 1);
      }
      setformObject([...formObject]);
    };

    const onRequireChange = (value, indexList) => {
      formObject[indexList].require_flag = value === true ? 1 : 0;
      setformObject([...formObject]);
    };

    const onFieldChangeList = (value, index, lan) => {
      if (lan === "th") {
        formObject[index].list_name_th = value;
        setformObject([...formObject]);
      } else if (lan === "en") {
        formObject[index].list_name_en = value;
        setformObject([...formObject]);
      }
    };

    const onFieldChangeTextSub = (value, indexList, indexSub, lan) => {
      if (lan === "th") {
        formObject[indexList].survey_sublist[indexSub].sublist_desc_th = value;
        setformObject([...formObject]);
      } else if (lan === "en") {
        formObject[indexList].survey_sublist[indexSub].sublist_desc_en = value;
        setformObject([...formObject]);
      }
    };

    const onDropdownChange = (value, indexList, indexSub) => {
      formObject[indexList].survey_sublist[indexSub].sublist_type = value;
      setformObject([...formObject]);
    };

    const footer = () => {
      return (
        <>
          <div className="p-grid">
            <div className="p-col-6" style={{ textAlign: "left" }}>
              <Button
                label={"เพิ่มคำถาม"}
                tooltip={"คลิกเพื่อเพิ่มคำถาม"}
                icon="pi pi-plus"
                onClick={() => onCreatePatternQuestion()}
                autoFocus
                className="p-button-rounded"
              />
            </div>
            <div className="p-col-6" style={{ textAlign: "right" }}>
              <Button
                label="ยกเลิก"
                icon="pi pi-times"
                onClick={() => setDialog(false)}
                className="p-button-secondary p-button-rounded"
                style={{
                  backgroundColor: "rgb(167 172 175)",
                  color: "#ffffff",
                }}
              />
              <Button
                label="บันทึก"
                icon="pi pi-check"
                onClick={() => submitForm(formObject)}
                autoFocus
                className="p-button-rounded"
              />
            </div>
          </div>
        </>
      );
    };

    return (
      <Dialog
        header={"กำหนดคำถาม"}
        visible={
          dialog.dialogConfigQuestion + " [ " + dialog.data.form_name_th + " ] "
        }
        style={{ width: "60vw" }}
        footer={footer()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          {formObject.length > 0
            ? formObject.map((list, indexList) => {
                return (
                  <>
                    <div
                      className="p-col-12"
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <label style={{ color: "blue", alignSelf: "center" }}>
                        ข้อที่ {indexList + 1}
                      </label>
                      {/* <div className="p-col-2"> */}
                      <Button
                        style={{ marginLeft: "10px", width: "130px" }}
                        onClick={() => removePattern("list", indexList)}
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger"
                        label={"ลบคำถาม"}
                        tooltip="ลบคำถาม"
                      />
                      {/* </div> */}
                    </div>
                    <div className="p-col-1" style={{ display: "flex" }}>
                      <labe style={{ alignSelf: "center" }}>คำถาม</labe>
                    </div>
                    <div className="p-col-5">
                      <InputText
                        value={list.list_name_th}
                        onChange={(e) =>
                          onFieldChangeList(e.target.value, indexList, "th")
                        }
                        placeholder="กรุณาระบุคำถามภาษาไทย"
                        maxlength="255"
                      />
                    </div>
                    <div className="p-col-5">
                      <InputText
                        value={list.list_name_en}
                        onChange={(e) =>
                          onFieldChangeList(e.target.value, indexList, "en")
                        }
                        placeholder="กรุณาระบุคำถามภาษาอังกฤษ"
                        maxlength="255"
                      />
                    </div>
                    <div className="p-col-12">
                      <Checkbox
                        checked={list.require_flag === 1 ? true : false}
                        value={list.require_flag}
                        onChange={(e) => onRequireChange(e.checked, indexList)}
                        tooltip="เลือกเพื่อบังคับตอบคำถาม"
                      ></Checkbox>{" "}
                      Require
                    </div>
                    <div className="p-col-12">
                      <div className="p-col-2">
                        <Button
                          style={{ width: "140px" }}
                          onClick={() => onCreatePatternAnswer(indexList)}
                          icon="pi pi-plus"
                          className="p-button-rounded p-button"
                          label={"เพิ่มคำตอบ"}
                          tooltip="เพิ่มคำตอบ"
                        />
                      </div>
                    </div>
                    {list.survey_sublist.map((subList, indexSub) => {
                      return (
                        <>
                          <div
                            className="p-col-1"
                            style={{ alignSelf: "center" }}
                          >
                            คำตอบ {indexSub + 1}
                          </div>
                          <div className="p-col-2">
                            <Dropdown
                              options={[
                                { label: "Radio", value: "1" },
                                { label: "Checkbox", value: "2" },
                                { label: "Textbox", value: "3" },
                                // { label: 'Dropdown', value: '4' },
                              ]}
                              placeholder="กรุณาเลือกรูปแบบ"
                              optionLabel="label"
                              appendTo={document.body}
                              value={subList.sublist_type}
                              onChange={(e) =>
                                onDropdownChange(e.value, indexList, indexSub)
                              }
                            />
                          </div>
                          <div className="p-col-4">
                            <InputText
                              value={subList.sublist_desc_th}
                              onChange={(e) =>
                                onFieldChangeTextSub(
                                  e.target.value,
                                  indexList,
                                  indexSub,
                                  "th"
                                )
                              }
                              placeholder="กรุณาระบุคำตอบภาษาไทย"
                              maxlength="255"
                            />
                          </div>
                          <div className="p-col-4">
                            <InputText
                              value={subList.sublist_desc_en}
                              onChange={(e) =>
                                onFieldChangeTextSub(
                                  e.target.value,
                                  indexList,
                                  indexSub,
                                  "en"
                                )
                              }
                              placeholder="กรุณาระบุคำตอบภาษาอังกฤษ"
                              maxlength="255"
                            />
                          </div>
                          <div className="p-col-1">
                            <Button
                              onClick={() =>
                                removePattern("sub", indexList, indexSub)
                              }
                              icon="pi pi-trash"
                              className="p-button-rounded p-button-danger"
                              tooltip="ลบคำตอบนี้"
                              style={{ marginLeft: "5px" }}
                            />
                          </div>
                        </>
                      );
                    })}
                    <hr style={{ width: "100%", color: "#868686" }} />
                  </>
                );
              })
            : ""}
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
