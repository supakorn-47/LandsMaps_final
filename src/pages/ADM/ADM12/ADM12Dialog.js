import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendars } from "../../../components/Calendar/Calendar";
import { Slider } from "primereact/slider";
import { validateInputText } from "../../../utils/ValidateUtil";
import { URL_API } from "../../../service/Config";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";

export default function ADM12Dialog(props) {
  const [selectedTable, setSelectedTable] = useState([]);
  const [formObject, setformObject] = useState({});
  const [size, setSize] = useState(50);

  useEffect(() => {
    props.onGetProvinceMaster(1);
    if (props.dialog.dialog === true && props.dialog.action === "แก้ไข") {
      setformObject(props.dialog.data);
      props.onGetAmphur(props.dialog.data.province_seq, "DIALOG");
      props.onGetOpt(props.dialog.data.amphur_seq, "DIALOG");
    } else if (
      props.dialog.dialog === true &&
      props.dialog.action === "บันทึก"
    ) {
      setformObject({
        opt_request_date: new Date(),
        province_seq: "-1",
        amphur_seq: "-1",
        opt_seq: "-1",
        file: [],
      });
    }
    return () => {
      props.setSubmitted(false);
    };
  }, [props.dialog.data]);

  useEffect(() => {
    if (props.dialog.dialogLayer == true) {
      let arr_Temp = [];
      props.dialog.data.usergrouplayer_list.forEach((element) => {
        if (element.ischecked === "1") {
          arr_Temp.push(element);
        }
      });
      setSelectedTable(arr_Temp);
    }
  }, [props.dialog.dialogLayer]);

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => props.setDialog(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => props.submitForm(formObject)}
          autoFocus
          className="p-button-rounded"
        />
      </div>
    );
  };

  const renderFooter2 = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => props.setDialog(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
      </div>
    );
  };

  const dialogBodyList = () => {
    if (props.dialog.viewImage === undefined) return;
    return (
      <Dialog
        header={props.dialog.action}
        visible={props.dialog.dialogViewImage}
        style={{ width: "55vw" }}
        footer={renderFooter2()}
        onHide={() => props.setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable={true}
      >
        <div className="p-grid">
          <div className="p-col-3">
            <div className="slider-demo">
              <label>ขนาดรูปภาพ {size} %</label>
              <Slider
                value={size}
                onChange={(e) => setSize(e.value)}
                style={{ marginTop: "8px" }}
              />
            </div>
          </div>
          <div
            className="p-col-12"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={URL_API(
                "backOfficeApi/Upload" + props.dialog.viewImage.announce_attach
              )}
              width={size + "%"}
            />
          </div>
        </div>
      </Dialog>
    );
  };

  const onHide = () => {
    props.setDialog(false);
    setformObject({});
  };

  const onRemoveFileClick = () => {
    setformObject({ ...formObject, file: [], announce_attach: "" });
  };

  const onChangeProvince = (e) => {
    setformObject({
      ...formObject,
      province_seq: e.target.value,
      amphur_seq: "-1",
    });
    props.onGetAmphur(e.target.value, "DIALOG");
    // props.onGetOpt(e.target.value, "DIALOG")
  };

  const onChangeAmphur = (e) => {
    setformObject({ ...formObject, amphur_seq: e.target.value, opt_seq: "-1" });
    props.onGetOpt(e.target.value, "DIALOG", formObject.province_seq);
  };

  const onChangeFileSelected = (e) => {
    if (e.target.files.length === 4) {
      let arr = [];
      let size = 0;

      // e.target.files.forEach(element => {
      //     arr.push({
      //         "wp_file_name": element.name
      //     })
      //     size += element.size
      // });

      for (let i = 0; i < e.target.files.length; i++) {
        arr.push({
          wp_file_name: e.target.files[i].name,
        });
        size += e.target.files[i].size;
        console.log("e.target.files[i]", e.target.files[i]);
      }

      if ((size / 1048576).toFixed(2) > 30) {
        props.setFileList([]);
        document.getElementById("myFile").value = "";
        props.showMessages(
          "warn",
          `แจ้งเตือน`,
          `ขนาดไฟล์ทั้งหมดต้องไม่เกิน 30 MB`
        );
      } else {
        props.setFileList(arr);
        setformObject({ ...formObject, file: e.target.files });
      }
    } else {
      props.setFileList([]);
      document.getElementById("myFile").value = "";
      props.showMessages(
        "warn",
        `แจ้งเตือน`,
        `กรุณาเลือกไฟล์ให้ครบ 4 ไฟล์ .dbf, .shp, .shx, .prj`
      );
    }
  };

  return (
    <>
      <Dialog
        header={
          props.dialog.action === "บันทึก"
            ? "เพิ่มคำร้องขอข้อมูล มาตรา 92"
            : props.dialog.action + "คำร้องขอข้อมูล มาตรา 92"
        }
        visible={props.dialog}
        style={{ width: "55vw" }}
        footer={renderFooter()}
        onHide={() => onHide()}
        blockScroll={true}
        className="p-fluid"
        maximizable={true}
      >
        <div className="p-grid">
          <div className="p-col-4">
            <label>
              วันที่ขอคำร้องขอ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={new Date(formObject.opt_request_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  opt_request_date: e.target.value,
                })
              }
              disabled
            />
            {props.submitted &&
              formObject.opt_request_date === null &&
              validateInputText("opt_request_date", "วันที่ขอคำร้องขอ")}
          </div>
        </div>
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-4">
            <label>
              จังหวัด<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.province_seq + ""}
              options={props.optionProvince}
              appendTo={document.body}
              onChange={(e) => onChangeProvince(e)}
              filter
            />
            {props.submitted &&
              formObject.province_seq === "-1" &&
              validateInputText("province_seq", "จังหวัด")}
          </div>
          <div className="p-col-4">
            <label>
              อำเภอ<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.amphur_seq + ""}
              onChange={(e) => onChangeAmphur(e)}
              options={
                props.optionAmphur.length === 0
                  ? [{ label: "-กรุณาเลือก-", value: "-1" }]
                  : props.optionAmphur
              }
              appendTo={document.body}
              disabled={props.optionAmphur.length === 0}
              filter
            />
            {props.submitted &&
              formObject.amphur_seq === "-1" &&
              validateInputText("amphur_seq", "อำเภอ")}
          </div>
          <div className="p-col-4">
            <label>
              องค์กรปกครองส่วนท้องถิ่น (อปท.)
              <span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.opt_seq + ""}
              onChange={(e) =>
                setformObject({ ...formObject, opt_seq: e.target.value })
              }
              options={
                props.optionOpt.length === 0
                  ? [{ label: "-กรุณาเลือก-", value: "-1" }]
                  : props.optionOpt
              }
              appendTo={document.body}
              disabled={props.optionOpt.length === 0}
              filter
            />
            {props.submitted &&
              formObject.opt_seq === "-1" &&
              validateInputText("opt_seq", "องค์กรปกครองส่วนท้องถิ่น (อปท.)")}
          </div>

          <div className="p-col-12">
            <label>
              รายละเอียด<span style={{ color: "red" }}>*</span>
            </label>
            <InputTextarea
              rows={5}
              value={formObject.opt_request_desc}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  opt_request_desc: e.target.value,
                })
              }
              style={{ height: "150px" }}
              maxLength="4000"
            />
            {props.submitted &&
              !formObject.opt_request_desc &&
              validateInputText("opt_request_desc", "รายละเอียด")}
          </div>

          <div className="p-col-5">
            <label>
              โซน<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              optionLabel="label"
              optionValue="value"
              value={formObject.wp_shp_zone}
              onChange={(e) =>
                setformObject({ ...formObject, wp_shp_zone: e.target.value })
              }
              options={[
                { label: "โซน 47", value: "47" },
                { label: "โซน 48", value: "48" },
                { label: "โซน 47 และ 48", value: "47,48" },
              ]}
              className={
                props.submitted &&
                (formObject.wp_shp_zone === undefined ||
                  formObject.wp_shp_zone === null ||
                  !formObject.wp_shp_zone) &&
                "p-invalid"
              }
            />
            {props.submitted &&
              (formObject.wp_shp_zone === undefined ||
                formObject.wp_shp_zone === null ||
                !formObject.wp_shp_zone) &&
              validateInputText("wp_shp_zone", "โซน")}
          </div>
          <div className="p-col-8"></div>

          <div
            className={
              props.fileList.length > 0 && props.dialog.action !== "บันทึก"
                ? `p-col-6`
                : `p-col-12`
            }
          >
            <label>
              ไฟล์แนบขอบเขต{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                (นามสกุล .dbf, .shp, .shx, .prj เท่านั้น ขนาดต้องไม่เกิน 30MB)
              </span>
            </label>
            <input
              type="file"
              accept=".dbf, .shp, .shx, .prj"
              onChange={(e) => onChangeFileSelected(e)}
              id="myFile"
              name="filename"
              style={{
                border: "1px solid #E0E0E0",
                width: "100%",
                height: "38px",
                padding: "7px",
              }}
              multiple
            />
            {props.submitted &&
              props.fileList.length === 0 &&
              validateInputText("file", "ไฟล์แนบขอบเขต")}
          </div>

          {props.fileList.length > 0 && props.dialog.action !== "บันทึก" && (
            <div
              className="p-col-2"
              style={{ display: "flex", marginTop: "18px" }}
            >
              <Button
                label=""
                icon="pi pi-trash"
                className="p-button-danger p-button-rounded"
                onClick={(e) =>
                  props.setDeleteDialogFile({
                    open: true,
                    data: props.dialog.data,
                  })
                }
                tooltip="คลิกที่นี่เพื่อลบไฟล์ทั้งหมด"
              />
            </div>
          )}

          {props.fileList &&
            props.fileList.map((list, index) => {
              return (
                <div className="p-col-12" style={{ padding: "10px" }}>
                  {list.wp_file_name}
                </div>
              );
            })}

          {/* {
                        props.fileList.length > 0 && props.dialog.action !== 'บันทึก' && (
                            <div className="p-col-3" style={{ display: 'flex' }}>
                                <Button label="ลบไฟล์ทั้งหมด" icon='pi pi-trash' className="p-button-danger p-button-rounded" onClick={(e) => props.setDeleteDialogFile({ open: true, data: props.dialog.data })} />
                            </div>
                        )
                    } */}
        </div>
      </Dialog>
      {dialogBodyList()}
    </>
  );
}
