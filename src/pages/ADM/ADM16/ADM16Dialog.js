import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendars } from "../../../components/Calendar/Calendar";
import { InputSwitch } from "primereact/inputswitch";
import { masterService } from "../../../service/ServiceMaster/MasterService";
import { validateInputText } from "../../../utils/ValidateUtil";

export default function ADM16Dialog(props) {
  const [formObject, setformObject] = useState({});
  const [amphurList, setAmphurList] = useState([]);
  const [tambolList, setTambolList] = useState([]);
  const [optTypeList, setOptTypeList] = useState([]);
  const [optServiceList, setOptServiceList] = useState([]);
  const [landOfficeList, setLandOfficeList] = useState([]);

  const consentFlagList = [
    {
      value: "-1",
      label: "กรุณาเลือก",
    },
    {
      value: "0",
      label: "ไม่ยินยอม",
    },
    {
      value: "1",
      label: "ยินยอม",
    },
    {
      value: "2",
      label: "อยู่ระหว่างประสาน",
    },
  ];

  useEffect(() => {
    if (props.dialog.dialog && props.dialog.action === "แก้ไข") {
      let data = props.dialog.data;
      let province_id = data.province_id;
      let amphur_id =
        data.amphur_id !== null
          ? data.amphur_id.substring(4, 2)
          : data.amphur_id;
      let tambol_id =
        data.tambol_id !== null
          ? data.tambol_id.substring(6, 4)
          : data.tambol_id;
      masterService("GetAmphoe/" + province_id, {}, "GET").then(
        (res) => {
          setAmphurList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );
      masterService(
        "GetTambol/" + province_id + "/" + amphur_id,
        {},
        "GET"
      ).then(
        (res) => {
          setTambolList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );
      masterService("GetoptType", {}, "GET").then(
        (res) => {
          setOptTypeList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );
      masterService("GetoptService", {}, "GET").then(
        (res) => {
          setOptServiceList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );
      masterService("GetLandoffice/" + province_id, {}, "GET").then(
        (res) => {
          setLandOfficeList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );

      setformObject({
        ...data,
        province_id: province_id,
        amphur_id: amphur_id,
        tambol_id: tambol_id,
        opt_type: data.opt_type === null ? "0" : data.opt_type,
        opt_service_id:
          data.opt_service_id === null ? "0" : data.opt_service_id,
      });

      setAmphurList(props.amphurList[province_id] || []);
    }
  }, []);

  const onProvinceChange = (province_id) => {
    setformObject({
      ...formObject,
      province_id: province_id,
      amphur_id: "0",
      tambol_id: "0",
    });
    // ใช้ amphurList จาก props
    const list = props.amphurList[province_id] || [];
    setAmphurList(list);

    masterService("GetAmphoe/" + province_id, {}, "GET").then(
      (res) => {
        setAmphurList(res.result);
      },
      function (err) {
        console.log("err", err);
      }
    );
  };

  const onAmphurChange = (amphur_id) => {
    setformObject({ ...formObject, amphur_id: amphur_id, tambol_id: "0" });
    masterService(
      "GetTambol/" + formObject.province_id + "/" + amphur_id,
      {},
      "GET"
    ).then(
      (res) => {
        setTambolList(res.result);
      },
      function (err) {
        console.log("err", err);
      }
    );
  };

  const onStatusChange = (isChecked) => {
    setformObject({
      ...formObject,
      record_status: isChecked === true ? "N" : "C",
    });
  };

  const renderFooter = () => {
    return (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => props.setDialog(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
        <Button
          label={props.dialog.action}
          icon="pi pi-check"
          onClick={() => props.submitForm(formObject)}
          autoFocus
          className="p-button-rounded"
        />
      </div>
    );
  };

  const onHide = () => {
    props.setDialog(false);
    setformObject({});
  };

  const onRemoveFileClick = () => {
    setformObject({ ...formObject, file: [], doc_file_path: "" });
  };

  return (
    <>
      <Dialog
        header="แก้ไข ข้อมูล อปท. ที่ยินยอมเผยแพร่ข้อมูลการชำระภาษี"
        visible={props.dialog.dialog}
        style={{ width: "70vw" }}
        footer={renderFooter()}
        onHide={() => onHide()}
        blockScroll={true}
        className="p-fluid"
        maximizable={true}
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-4">
            <label>
              จังหวัด<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              filter
              filterBy="label"
              optionLabel="label"
              optionValue="value"
              value={formObject.province_id}
              options={props.provinceList}
              onChange={(e) => onProvinceChange(e.value)}
              placeholder="เลือกจังหวัด"
            />
            {props.submitted &&
              formObject.province_id === "0" &&
              validateInputText("province_id", "จังหวัด")}
          </div>
          <div className="p-col-4">
            <label>อำเภอ</label>
            <Dropdown
              filter
              filterBy="label"
              optionLabel="label"
              optionValue="value"
              value={formObject.amphur_id}
              options={amphurList}
              onChange={(e) => onAmphurChange(e.value)}
              placeholder="เลือกอำเภอ"
            />
          </div>
          <div className="p-col-4">
            <label>ตำบล</label>
            <Dropdown
              filter
              filterBy="label"
              optionLabel="label"
              optionValue="value"
              value={formObject.tambol_id}
              options={tambolList}
              onChange={(e) =>
                setformObject({ ...formObject, tambol_id: e.value })
              }
              placeholder="เลือกตำบล"
            />
          </div>
          <div className="p-col-4">
            <label>
              ประเภท อปท.<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              filter
              filterBy="label"
              optionLabel="label"
              optionValue="value"
              value={formObject.opt_type + ""}
              options={optTypeList}
              onChange={(e) =>
                setformObject({ ...formObject, opt_type: parseInt(e.value) })
              }
            />
            {props.submitted &&
              formObject.opt_type === 0 &&
              validateInputText("opt_type", "ประเภท อปท.")}
          </div>
          <div className="p-col-8">
            <label>
              ชื่อ อปท.<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.opt_name}
              onChange={(e) =>
                setformObject({ ...formObject, opt_name: e.target.value })
              }
            />
            {props.submitted &&
              !formObject.opt_name &&
              validateInputText("opt_name", "ชื่อ อปท.")}
          </div>

          <div className="p-col-4">
            <label>
              สำนักงานที่ดิน<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              filter
              filterBy="label"
              optionLabel="label"
              optionValue="value"
              value={formObject.landoffice_id}
              options={landOfficeList}
              onChange={(e) =>
                setformObject({ ...formObject, landoffice_id: e.value })
              }
            />
            {props.submitted &&
              formObject.landoffice_id === "0" &&
              validateInputText("landoffice_id", "สำนักงานที่ดิน")}
          </div>
          <div className="p-col-4">
            <label>แหล่งที่มาหนังสือยินยอม เช่น กรมที่ดิน, อปท</label>
            <InputText
              value={formObject.doc_org_source}
              onChange={(e) =>
                setformObject({ ...formObject, doc_org_source: e.target.value })
              }
            />
          </div>
          <div className="p-col-4">
            <label>บริการ Service</label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.opt_service_id + ""}
              options={optServiceList}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  opt_service_id: parseInt(e.value),
                })
              }
            />
          </div>

          <div className="p-col-4">
            <label>เลขที่หนังสือ</label>
            <InputText
              value={formObject.doc_no}
              onChange={(e) =>
                setformObject({ ...formObject, doc_no: e.target.value })
              }
            />
          </div>
          <div className="p-col-4">
            <label>วันที่หนังสือ</label>
            <Calendars
              value={
                formObject.doc_date === null
                  ? null
                  : new Date(formObject.doc_date)
              }
              onChange={(e) =>
                setformObject({ ...formObject, doc_date: e.target.value })
              }
            />
          </div>
          <div className="p-col-4">
            <label>วันที่กรมที่ดินได้รับหนังสือ</label>
            <Calendars
              value={
                formObject.doc_receive_date === null
                  ? null
                  : new Date(formObject.doc_receive_date)
              }
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  doc_receive_date: e.target.value,
                })
              }
            />
          </div>

          <div className="p-col-4">
            <label>วันที่ยินยอม</label>
            <Calendars
              value={
                formObject.consent_date === null
                  ? null
                  : new Date(formObject.consent_date)
              }
              onChange={(e) =>
                setformObject({ ...formObject, consent_date: e.target.value })
              }
            />
          </div>

          <div className="p-col-4">
            <label>วันที่เริ่มต้นการยินยอม</label>
            <Calendars
              value={
                formObject.consent_start_date === null
                  ? null
                  : new Date(formObject.consent_start_date)
              }
              minDate={new Date(formObject.consent_end_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  consent_start_date: e.target.value,
                })
              }
            />
          </div>
          <div className="p-col-4">
            <label>วันที่สิ้นสุดการยินยอม</label>
            <Calendars
              value={
                formObject.consent_end_date === null
                  ? null
                  : new Date(formObject.consent_end_date)
              }
              minDate={new Date(formObject.consent_start_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  consent_end_date: e.target.value,
                })
              }
            />
          </div>

          <div className="p-col-12">
            <label>หมายเหตุ</label>
            <InputText
              value={formObject.remark}
              onChange={(e) =>
                setformObject({ ...formObject, remark: e.target.value })
              }
            />
          </div>

          <div className="p-col-4">
            <label>ไฟล์แนบ</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setformObject({ ...formObject, file: e.target.files[0] })
              }
              id="myFile"
              name="filename"
              style={{
                border: "1px solid #E0E0E0",
                width: "100%",
                height: "38px",
                padding: "7px",
              }}
            />
          </div>
          <div className="p-col-4">
            <label>
              สถานะยินยอม<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.consent_flag}
              options={consentFlagList}
              onChange={(e) =>
                setformObject({ ...formObject, consent_flag: e.value })
              }
              appendTo={document.body}
            />
            {props.submitted &&
              formObject.consent_flag === "-1" &&
              validateInputText("consent_flag", "สถานะยินยอม")}
          </div>
          <div className="p-col-4">
            <label>สถานะข้อมูล</label>
            <div className="p-col-4">
              <InputSwitch
                checked={formObject.record_status === "N" ? true : false}
                onChange={(e) => onStatusChange(e.value)}
              />
            </div>
          </div>

          {formObject.doc_file_path !== undefined &&
          formObject.doc_file_path !== "" &&
          formObject.doc_file_path !== null ? (
            <div
              className="p-col-12"
              style={{ alignSelf: "center", display: "flex" }}
            >
              <label style={{ marginTop: "9px", overflowWrap: "anywhere" }}>
                {formObject.doc_file_path.replace("/Images\\", "")}
              </label>
              <Button
                onClick={() => onRemoveFileClick()}
                icon="pi pi-times"
                className="p-button-rounded p-button-danger p-button-outlined"
                style={{
                  marginLeft: "5px",
                  height: "25px",
                  width: "30px",
                  marginTop: "4px",
                }}
                tooltip="คลิกเพื่อ ลบไฟล์"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Dialog>
    </>
  );
}
