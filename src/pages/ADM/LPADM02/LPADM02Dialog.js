import React, { useState, useEffect, useRef } from "react";
import copy from "copy-to-clipboard";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";

import { Calendars } from "../../../components/Calendar/Calendar";
import { Password } from "primereact/password";
import { masterService } from "../../../service/ServiceMaster/MasterService";
import { validateInputText } from "../../../utils/ValidateUtil";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH } from "../../../utils/DateUtil";
import "./LPADM02Dialog.css";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Date } from "core-js";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";

export default function LPADM02Dialog({
  // adflag,
  // setAdflag,
  setConsumerPopup,
  optionProvince,
  onAddRegisterServiceClick,
  onUpdateConsumerClick,
  onGenerateKeyClick,
  isCheckEmail,
  setIsCheckEmail,
  isCheckCardId,
  setIsCheckCardId,
  dialog,
  setDialog,
  submitForm,
  setSubmitted,
  submitted,
  verifyIdentityAD,
  // formAD,
  // setFormAD,
}) {
  const textCopyRef = useRef(null);

  const [landOffice, setLandOffice] = useState([]);
  const [formObject, setformObject] = useState({});
  const [adflag, setAdflag] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const [showPassAD, setShowPassAD] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedTable, setSelectedTable] = useState([]);
  const [formAD, setFormAD] = useState([]);
  const [optionAmphur, setOptionAmphur] = useState([]);
  const [optionOpt, setOptionOpt] = useState([]);
  const [optionDepartment, setOptionDepartment] = useState([]);

  const [copyClipboard, setCopyClipboard] = useState("");

  //MASTER
  const [registerType, setRegisterType] = useState([]);

  const [otherDetails, setOtherDetails] = useState("");
  const [showOtherDetails, setShowOtherDetails] = useState(false);
  // const [selectedOptionDateTime, setSelectedOptionDateTime] = useState(
  //   formObject.serviceRequestType &&
  //     (formObject.serviceRequestType === "Y" ||
  //       formObject.serviceRequestType === "N")
  //     ? formObject.serviceRequestType
  //     : "Y"
  // );

  //   const [selectedOptionService, setSelectedOptionService] = useState();

  const [nullselectedSystems, setnullSelectedSystems] = useState([
    {
      operating_system_seq: 1,
      record_status: "N",
      operating_system_th: "LTAX 3000",
      operating_system_other: "",
    },
    {
      operating_system_seq: 2,
      record_status: "N",
      operating_system_th: " LTAX Online",
      operating_system_other: "",
    },
    {
      operating_system_seq: 3,
      record_status: "N",
      operating_system_th: "CU-TaXGO",
      operating_system_other: "",
    },
    {
      operating_system_seq: 4,
      record_status: "N",
      operating_system_th: "Excel",
      operating_system_other: "",
    },
    {
      operating_system_seq: 5,
      record_status: "N",
      operating_system_th: "กระดาษ",
      operating_system_other: "",
    },
    {
      operating_system_seq: 99,
      record_status: "N",
      operating_system_th: "อื่นๆ",
      operating_system_other: "",
    },
  ]);

  const [selectedSystems, setSelectedSystems] = useState([]);

  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  useEffect(() => {
    if (dialog.data) {
      if (dialog.data.operating_system_list.length === 1) {
        setSelectedSystems(nullselectedSystems);
      } else {
        setSelectedSystems(dialog.data.operating_system_list);
      }
    }
  }, [dialog.data]);

  if (dialog.data != null) {
    //  console.log("selectedSystems 11 : " , dialog.data.operating_system_list)
    // console.log("selectedSystems 22  : " , selectedSystems)
  }

  //   useEffect(() => {
  //     if (selectedOptionService) {
  //       setSelectedOptionDateTime(selectedOptionService);
  //     }
  //   }, [selectedOptionService]);

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;

    setSelectedSystems((prevSystems) =>
      prevSystems.map((system) =>
        parseInt(id) === system.operating_system_seq
          ? { ...system, record_status: checked ? "Y" : "N" }
          : system
      )
    );

    if (parseInt(id) === 99) {
      setShowOtherDetails(checked);
    }
  };

  const handleOtherDetailsChange = (e) => {
    const { value } = e.target;
    setSelectedSystems((prevSystems) =>
      prevSystems.map((system) =>
        system.operating_system_seq === 99
          ? { ...system, operating_system_other: value } // อัปเดตค่า operating_system_other
          : system
      )
    );
  };
  // const handleSelectedDateTime = (e, fieldName) => {
  //   const value = e.value || e.target.value;
  //   // setSelectedOptionDateTime(value);
  //   setformObject((prev) => ({
  //     ...prev,
  //     [fieldName]: value,
  //   }));
  // };

  //   const selectedOptionsService = (e) => {
  //     const { value } = e.target;

  //     // อัปเดต selected option
  //     setSelectedOptionService(value);
  //   };

  var TH = {
    firstDayOfWeek: 1,
    dayNames: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุทธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
    dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
    dayNamesMin: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
    monthNames: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    monthNamesShort: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค",
      "เม.ย",
      "พ.ค",
      "มิ.ย",
      "ก.ค.",
      "ส.ค",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    today: "วันนี้",
    clear: "ล้าง",
  };

  // useEffect(() => {
  //   console.log("========",selectedSystems)
  //   console.log('formObject',formObject)
  // }, [formObject]);
  const handleChangeValue = (e, fieldName) => {
    const value = e.value ?? e.target.value;

    // ← ตรงนี้ตั้ง state อีกตัว
    setformObject((prev) => ({
      ...prev,
      [fieldName]: value, // fieldName อาจเป็น 'consumerType'
    }));
  };
  useEffect(() => {
    setAdflag(false);
    console.log("🔍 dialog.action:", dialog.action);
    if (dialog.action === "แก้ไข") {
      // console.log("selectedSystems 22  : ", selectedSystems);
      setformObject({
        ...dialog.data,
        user_password2: dialog.data.user_password,
      });
      if (dialog.data.register_ad_flag === "1") {
        setAdflag(true);
        setFormAD({ ...dialog.data, result: true });
      }
      masterService(
        `GetLandoffice?mode=1&province_seq=${dialog.data.province_seq}`,
        {},
        "GET"
      ).then((res) => {
        setLandOffice(res.result);
      });
      masterService(
        `GetAmphur?mode=1&province_seq=${dialog.data.province_seq}`,
        {},
        "GET"
      ).then((res) => {
        setOptionAmphur(res.result);
      });
      masterService(`GetDepartment?mode=1`, {}, "GET").then((res) => {
        setOptionDepartment(res.result);
      });
      if (dialog.data.register_type_seq === 4) {
        masterService(
          `GetOpt?mode=1&amphur_seq=${dialog.data.amphur_seq}`,
          {},
          "GET"
        ).then((res) => {
          setOptionOpt(res.result);
        });
      }

      if (
        dialog.data.register_type_seq === 2 ||
        dialog.data.register_type_seq === 6
      ) {
        masterService(
          "GetRegisterType?mode=1&register_type_seq=2,6",
          {},
          "GET"
        ).then((res) => {
          setRegisterType(res.result);
        });
      } else {
        masterService("GetRegisterType?mode=1", {}, "GET").then((res) => {
          setRegisterType(res.result);
        });
      }
    } else if (dialog.serviceOpen === true) {
      let temp = [];
      dialog.tableData.forEach((element) => {
        if (element.ischecked === 1) {
          temp.push(element);
        }
      });
      setSelectedTable(temp);
    } else {
      setformObject({
        person_id: null,

        person_firstnameth: "",
        person_middlenameth: "",
        person_lastnameth: "",
        person_birthdate: "",
        person_phone: "",
        person_email: "",
        person_position: null,
        province_seq: -1,
        amphur_seq: 0,
        landoffice_id: "-1",
        department_seq: 0,
        opt_seq: 0,
        department_phone: "",
        user_id: "",
        user_password: "",
        register_type_seq: 2,
        approve_flag: 0,
        register_ad_flag: "0",
        remark: "",
        record_status: "N",
        person_position: "",
        register_type_seq: "1",
        operatingSystems: [
          {
            operating_system_seq: 0,
            operating_system_en: "",
            operating_system_th: "",
            operating_system_other: "",
            recorD_STATUS: "",
          },
        ],
      });
      setFormAD({
        result: false,
        record_status: "N",
      });
      masterService(
        "GetRegisterType?mode=1&register_type_seq=2,6",
        {},
        "GET"
      ).then((res) => {
        setRegisterType(res.result);
      });
    }

    setGlobalFilter("");
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => {
      setCopyClipboard("");
    };
  }, [dialog.data, dialog.consumerOpen]);

  const clears = () => {
    setformObject({
      person_id: null,

      person_firstnameth: "",
      person_middlenameth: "",
      person_lastnameth: "",
      person_birthdate: "",
      person_phone: "",
      person_email: "",
      person_position: null,
      province_seq: -1,
      amphur_seq: 0,
      landoffice_id: "-1",
      department_seq: 0,
      opt_seq: 0,
      department_phone: "",
      user_id: "",
      user_password: "",
      register_type_seq: 2,
      approve_flag: 0,
      register_ad_flag: "0",
      remark: "",
      record_status: "N",
      person_position: "",
      register_type_seq: "1",
      selectedSystems: [],
    });
    setFormAD({
      result: false,
      record_status: "N",
    });
    // setAdflag(false);
    setShowPass(true);
    setShowPass2(true);
    setShowPassAD(true);
  };

  const onOK = () => {
    if (adflag) {
      submitForm({
        ...formObject,
        register_ad_flag: "1",
        register_type_seq: formObject.register_type_seq,
        ...formAD,
        selectedSystems,
      });
    } else {
      submitForm({ ...formObject, operating_system_list: selectedSystems });
    }
    clears();
  };

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => (setDialog(false), setSubmitted(false), clears())}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label={"บันทึก"}
          icon="pi pi-check"
          onClick={() => onOK()}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const onRegisterTypeChange = (register_type_seq) => {
    if (adflag) {
      setFormAD({ ...formAD, register_type_seq: register_type_seq });
      setformObject({ ...formObject, register_type_seq: register_type_seq });
    } else {
      setformObject({ ...formObject, register_type_seq: register_type_seq });
    }
  };

  const onProvinceChange = (province_seq, landoffice_id) => {
    masterService(
      `GetLandoffice?mode=1&province_seq=${province_seq}`,
      {},
      "GET"
    ).then(
      (res) => {
        setLandOffice(res.result);
        // setformObject({ ...formObject, province_seq: province_seq, landoffice_id: landoffice_id });
        // setFormAD({ ...formAD, province_seq: province_seq, landoffice_id: landoffice_id });
      },
      function (err) {
        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );

    if (adflag) {
      setFormAD({
        ...formAD,
        province_seq: province_seq,
        landoffice_id: landoffice_id,
      });
      setformObject({
        ...formObject,
        province_seq: province_seq,
        landoffice_id: landoffice_id,
      });
    } else {
      setformObject({
        ...formObject,
        province_seq: province_seq,
        landoffice_id: landoffice_id,
      });
    }
  };

  const onLandOfficeChange = (landoffice_id) => {
    if (adflag) {
      setFormAD({ ...formAD, landoffice_id: landoffice_id });
      setformObject({ ...formObject, landoffice_id: landoffice_id });
    } else {
      setformObject({ ...formObject, landoffice_id: landoffice_id });
    }
  };

  const checkCardId = (values, type) => {
    const card = values.replace(/-/g, "");
    // eslint-disable-next-line
    var x = new String(card);
    var splitext = x.split("");
    var total = 0;
    var mul = 13;
    for (var i = 0; i < splitext.length - 1; i++) {
      total = total + splitext[i] * mul;
      mul = mul - 1;
    }
    const mod = total % 11;
    const nsub = 11 - mod;
    const mod2 = nsub % 10;

    if (mod2 != splitext[12]) {
      setIsCheckCardId(false);
    } else {
      setIsCheckCardId(true);
    }

    if (type === "AD") {
      setFormAD({ ...formAD, person_id: values });
    } else {
      setformObject({ ...formObject, person_id: values });
    }
  };

  const checkEmail = (e, type) => {
    if (e.target.value.indexOf("@") === -1) {
      setIsCheckEmail(false);
    } else {
      setIsCheckEmail(true);
    }
    if (type === "AD") {
      setFormAD({ ...formAD, person_email: e.target.value });
    } else {
      setformObject({ ...formObject, person_email: e.target.value });
    }
  };

  // console.log('formAD', formAD)
  //  console.log('detail', showOtherDetails)
  const checkADFlag = () => {
    // ผู้ดูแลระบบส่วนกลาง
    if (adflag) {
      return (
        <>
          <div className="p-col-12">
            <hr style={{ width: "100%", color: "#868686" }} />
          </div>
          <div className="p-col-6">
            <label>
              ชื่อ<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              disabled={!formAD.result}
              value={formAD.person_firstnameth}
              onChange={(e) =>
                setFormAD({ ...formAD, person_firstnameth: e.target.value })
              }
            />
            {submitted &&
              !formAD.person_firstnameth &&
              validateInputText("first_name", "ชื่อ")}
          </div>
          <div className="p-col-6">
            <label>
              นามสกุล<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              disabled={!formAD.result}
              value={formAD.person_lastnameth}
              onChange={(e) =>
                setFormAD({ ...formAD, person_lastnameth: e.target.value })
              }
            />
            {submitted &&
              !formAD.person_lastnameth &&
              validateInputText("last_name", "นามสกุล")}
          </div>
          <div className="p-col-6">
            <label>
              วัน/เดือน/ปีเกิด<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              disabled={!formAD.result}
              value={
                formAD.person_birthdate ? new Date(formAD.person_birthdate) : ""
              }
              yearRange={"1921:" + new Date().getFullYear()}
              onChange={(e) =>
                setFormAD({ ...formAD, person_birthdate: e.target.value })
              }
              maxDate={new Date()}
            />
            {submitted &&
              !formAD.person_birthdate &&
              validateInputText("person_birthdate", "วัน/เดือน/ปีเกิด")}
          </div>
          <div className="p-col-6">
            <label>
              เลขประจำตัวประชาชน<span style={{ color: "red" }}>*</span>
            </label>
            <InputMask
              disabled={!formAD.result}
              value={formAD.person_id}
              onChange={(e) => checkCardId(e.target.value, "AD")}
              mask="9-9999-99999-99-9"
            />
            {isCheckCardId === false ? (
              <small className="p-invalid p-d-block">{`เลขประจำตัวประชาชนไม่ถูกต้อง `}</small>
            ) : (
              ""
            )}
            {submitted &&
              !formAD.person_id &&
              validateInputText("person_id", "เลขประจำตัวประชาชน")}
          </div>
          <div className="p-col-6">
            <label>
              อีเมล<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              disabled={!formAD.result}
              value={formAD.person_email}
              // onChange={(e) => setFormAD({ ...formAD, person_email: e.target.value })}
              onChange={(e) => checkEmail(e, "AD")}
            />
            {isCheckEmail === false ? (
              <small className="p-invalid p-d-block">{`รูปแบบอีเมลไม่ถูกต้อง`}</small>
            ) : (
              ""
            )}
            {submitted &&
              !formAD.person_email &&
              validateInputText("person_email", "อีเมล")}
          </div>
          <div className="p-col-6">
            <label>
              เบอร์มือถือ<span style={{ color: "red" }}>*</span>
            </label>
            <InputMask
              disabled={!formAD.result}
              value={formAD.person_phone}
              onChange={(e) =>
                setFormAD({ ...formAD, person_phone: e.target.value })
              }
              mask="999-999-9999"
            />
            {submitted &&
              !formAD.person_phone &&
              validateInputText("person_phone", "เบอร์มือถือ")}
          </div>
          <div className="p-col-6">
            <label>
              สถานะ<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              disabled={!formAD.result}
              value={
                formAD.record_status === "N" ||
                formAD.record_status === "ใช้งาน"
                  ? "N"
                  : "C"
              }
              options={[
                { label: "ใช้งาน", value: "N" },
                { label: "ยกเลิก", value: "C" },
              ]}
              onChange={(e) =>
                setFormAD({ ...formAD, record_status: e.target.value })
              }
            />
          </div>
        </>
      );

      // อื่นๆ
    } else {
      return (
        <>
          <div className="p-col-6">
            <label>
              ชื่อผู้ใช้งาน<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              validateOnly={true}
              value={formObject.user_id}
              onChange={(e) =>
                setformObject({ ...formObject, user_id: e.target.value })
              }
              maxLength="20"
              disabled={dialog.action === "แก้ไข" ? true : false}
            />
            {submitted &&
              !formObject.user_id &&
              validateInputText("user_id", "ชื่อผู้ใช้งาน")}
          </div>

          {dialog.action !== "แก้ไข" ? (
            <>
              {/* <div className="p-col-6"></div> */}
              <div className="p-col-6">
                <label>
                  รหัสผ่าน<span style={{ color: "red" }}>*</span>
                </label>
                <div className="p-inputgroup">
                  {showPass === true ? (
                    <>
                      <InputText
                        maxLength="20"
                        value={formObject.user_password}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password: e.target.value,
                          })
                        }
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <i className="pi pi-eye-slash"></i>
                      </span>
                    </>
                  ) : (
                    <>
                      <Password
                        value={formObject.user_password}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password: e.target.value,
                          })
                        }
                        // promptLabel={"ระบุรหัสผ่าน"} weakLabel={"รหัสผ่านคาดเดาง่าย"} mediumLabel={"รหัสผ่านคาดเดาปานกลาง"} strongLabel={"รหัสผ่านปลอดภัยสูง"}
                        feedback={false}
                        maxLength="20"
                        // panelStyle={{ marginLeft: "-41%", marginTop: "-7.5%" }}
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <i className="pi pi-eye"></i>
                      </span>
                    </>
                  )}
                </div>
                {submitted &&
                  !formObject.user_password &&
                  validateInputText("user_password", "รหัสผ่าน")}
              </div>
              <div className="p-col-6">
                <label>
                  ยืนยันรหัสผ่าน<span style={{ color: "red" }}>*</span>
                </label>
                <div className="p-inputgroup">
                  {showPass2 === true ? (
                    <>
                      <InputText
                        maxLength="20"
                        value={formObject.user_password2}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password2: e.target.value,
                          })
                        }
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass2(!showPass2)}
                      >
                        <i className="pi pi-eye-slash"></i>
                      </span>
                    </>
                  ) : (
                    <>
                      <Password
                        value={formObject.user_password2}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password2: e.target.value,
                          })
                        }
                        // promptLabel={"ระบุรหัสผ่าน"} weakLabel={"รหัสผ่านคาดเดาง่าย"} mediumLabel={"รหัสผ่านคาดเดาปานกลาง"} strongLabel={"รหัสผ่านปลอดภัยสูง"}
                        feedback={false}
                        maxLength="20"
                        // panelStyle={{ marginLeft: "-41%", marginTop: "-7.5%" }}
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass2(!showPass2)}
                      >
                        <i className="pi pi-eye"></i>
                      </span>
                    </>
                  )}
                </div>
                {submitted &&
                  !formObject.user_password2 &&
                  validateInputText("user_password2", "ยืนยันรหัสผ่าน")}
              </div>
            </>
          ) : (
            ""
          )}
          <div className="p-col-6"></div>
          {dialog.action == "แก้ไข" &&
          dialog.data.register_ad_flag != "1" &&
          dialog.data.register_type_seq === "10" ? (
            <>
              <div className="p-col-6">
                <label>
                  รหัสผ่าน<span style={{ color: "red" }}>*</span>
                </label>
                <div className="p-inputgroup">
                  {showPass === true ? (
                    <>
                      <Password
                        value={formObject.user_password}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password: e.target.value,
                          })
                        }
                        // promptLabel={"ระบุรหัสผ่าน"} weakLabel={"รหัสผ่านคาดเดาง่าย"} mediumLabel={"รหัสผ่านคาดเดาปานกลาง"} strongLabel={"รหัสผ่านปลอดภัยสูง"}
                        feedback={false}
                        maxLength="20"
                        // panelStyle={{ marginLeft: "-41%", marginTop: "-7.5%" }}
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <i className="pi pi-eye"></i>
                      </span>
                    </>
                  ) : (
                    <>
                      <InputText
                        maxLength="20"
                        value={formObject.user_password}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password: e.target.value,
                          })
                        }
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass(!showPass)}
                      >
                        <i className="pi pi-eye-slash"></i>
                      </span>
                    </>
                  )}
                </div>
                {submitted &&
                  !formObject.user_password &&
                  validateInputText("user_password", "รหัสผ่าน")}
              </div>
              <div className="p-col-6">
                <label>
                  ยืนยันรหัสผ่าน<span style={{ color: "red" }}>*</span>
                </label>
                <div className="p-inputgroup">
                  {showPass2 === true ? (
                    <>
                      <Password
                        value={formObject.user_password2}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password2: e.target.value,
                          })
                        }
                        // promptLabel={"ระบุรหัสผ่าน"} weakLabel={"รหัสผ่านคาดเดาง่าย"} mediumLabel={"รหัสผ่านคาดเดาปานกลาง"} strongLabel={"รหัสผ่านปลอดภัยสูง"}
                        feedback={false}
                        maxLength="20"
                        // panelStyle={{ marginLeft: "-41%", marginTop: "-7.5%" }}
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass2(!showPass2)}
                      >
                        <i className="pi pi-eye"></i>
                      </span>
                    </>
                  ) : (
                    <>
                      <InputText
                        maxLength="20"
                        value={formObject.user_password2}
                        onChange={(e) =>
                          setformObject({
                            ...formObject,
                            user_password2: e.target.value,
                          })
                        }
                      />
                      <span
                        className="p-inputgroup-addon"
                        onClick={() => setShowPass2(!showPass2)}
                      >
                        <i className="pi pi-eye-slash"></i>
                      </span>
                    </>
                  )}
                </div>
                {submitted &&
                  !formObject.user_password2 &&
                  validateInputText("user_password2", "ยืนยันรหัสผ่าน")}
              </div>
            </>
          ) : (
            ""
          )}
          <div className="p-col-12">
            <hr style={{ width: "100%", color: "#868686" }} />
          </div>
          <div className="p-col-6">
            <label>
              ชื่อ<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.person_firstnameth}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  person_firstnameth: e.target.value,
                })
              }
            />
            {submitted &&
              !formObject.person_firstnameth &&
              validateInputText("person_firstnameth", "ชื่อ")}
          </div>
          <div className="p-col-6">
            <label>
              นามสกุล<span style={{ color: "red" }}>*</span>
            </label>

            <InputText
              value={formObject.person_lastnameth}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  person_lastnameth: e.target.value,
                })
              }
            />
            {submitted &&
              !formObject.person_lastnameth &&
              validateInputText("person_lastnameth", "นามสกุล")}
          </div>
          <div className="p-col-6">
            <label>
              วัน/เดือน/ปีเกิด<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={
                formObject.person_birthdate
                  ? new Date(formObject.person_birthdate)
                  : ""
              }
              yearRange={"1921:" + new Date().getFullYear()}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  person_birthdate: e.target.value,
                })
              }
              maxDate={new Date()}
            />
            {submitted &&
              !formObject.person_birthdate &&
              validateInputText("person_birthdate", "วัน/เดือน/ปีเกิด")}
          </div>
          {/* เทสระบบ */}
          <div className="p-col-6">
            <label>
              เลขประจำตัวประชาชน<span style={{ color: "red" }}>*</span>
            </label>
            <InputMask
              value={
                formObject.person_id ? formObject.person_id.toString() : ""
              } // Ensure the value is a string
              onChange={(e) => checkCardId(e.target.value, "form")}
              mask="9-9999-99999-99-9"
            />

            {/* <InputMask
                            value={formObject.person_id}
                            onChange={(e) => checkCardId(e.target.value, "form")}
                            mask="9-9999-99999-99-9"
                        /> */}

            {isCheckCardId === false ? (
              <small className="p-invalid p-d-block">{`เลขประจำตัวประชาชนไม่ถูกต้อง`}</small>
            ) : (
              ""
            )}
            {submitted &&
              !formObject.person_id &&
              validateInputText("person_id", "เลขประจำตัวประชาชน")}
          </div>
          <div className="p-col-6">
            <label>
              อีเมล<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.person_email}
              onChange={(e) => checkEmail(e, "form")}
            />
            {isCheckEmail === false ? (
              <small className="p-invalid p-d-block">{`รูปแบบอีเมลไม่ถูกต้อง`}</small>
            ) : (
              ""
            )}
            {submitted &&
              !formObject.person_email &&
              validateInputText("person_email", "อีเมล")}
          </div>
          <div className="p-col-6">
            <label>
              เบอร์มือถือ<span style={{ color: "red" }}>*</span>
            </label>
            <InputMask
              value={formObject.person_phone}
              onChange={(e) =>
                setformObject({ ...formObject, person_phone: e.target.value })
              }
              mask="999-999-9999"
            />
            {submitted &&
              !formObject.person_phone &&
              validateInputText("person_phone", "เบอร์มือถือ")}
          </div>
          <div className="p-col-6">
            <label>
              สถานะ<span style={{ color: "red" }}>*</span>
            </label>
            <SelectButton
              value={
                formObject.record_status === "N" ||
                formObject.record_status === "ใช้งาน"
                  ? "N"
                  : "C"
              }
              // options={['ใช้งาน', 'ยกเลิก']}
              options={[
                { label: "ใช้งาน", value: "N" },
                { label: "ยกเลิก", value: "C" },
              ]}
              onChange={(e) =>
                setformObject({ ...formObject, record_status: e.target.value })
              }
            />
          </div>
        </>
      );
    }
  };

  const footerService = () => {
    const onClick = () => {
      setDialog(false);
      setSubmitted(false);
    };
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => onClick()}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label={"บันทึก"}
          icon="pi pi-check"
          onClick={() => onAddRegisterServiceClick(selectedTable)}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const header = (
    <div className="table-header" style={{ marginBottom: "1rem" }}>
      <div className="header-left"></div>
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

  return (
    <>
      {/* ผู้ใช้งาน */}
      {dialog.dialog && (
        <Dialog
          header={`${dialog.action}ผู้ใช้งาน ${
            dialog.data === undefined ? "" : dialog.data.person_fullname
          }`}
          visible={dialog.dialog}
          style={{ width: "55vw" }}
          footer={renderFooter()}
          onHide={() => (setDialog(false), setSubmitted(false))}
          blockScroll={true}
          className="p-fluid modern-dialog"
          // contentStyle={{ marginTop: 5 }}
          maximizable
        >
          <div className="p-grid" style={{ padding: "10px" }}>
            <div className="p-col-6 __displayItem">
              <div className="__widthItem">
                <label>
                  กลุ่มผู้ใช้งาน<span style={{ color: "red" }}>*</span>
                </label>
                <Dropdown
                  optionLabel="label"
                  value={
                    typeof formObject.register_type_seq === "string"
                      ? formObject.register_type_seq + ""
                      : formObject.register_type_seq + ""
                  }
                  options={registerType}
                  // options={[
                  //     // { label: 'กรุณาเลือก', value: '-1' },
                  //     { label: 'ผู้ดูเเลระบบส่วนกลาง', value: '2' },
                  //     { label: 'ผู้ดูเเลระบบ', value: '6' },
                  // ]}
                  onChange={(e) => onRegisterTypeChange(parseInt(e.value))}
                  placeholder="เลือกกลุ่มผู้ใช้"
                  disabled={
                    dialog.action === "แก้ไข" &&
                    formObject.register_type_seq !== -1 &&
                    formObject.register_type_seq !== 2 &&
                    formObject.register_type_seq !== 6
                  }
                />
                {submitted &&
                  formObject.register_type_seq === "-1" &&
                  validateInputText("register_type_seq", "กลุ่มผู้ใช้งาน")}
              </div>
              {(formObject.register_type_seq === "2" ||
                formObject.register_type_seq === "6" ||
                formObject.register_type_seq === 2 ||
                formObject.register_type_seq === 6) && (
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    onChange={(e) => setAdflag(e.checked)}
                    checked={adflag}
                    disabled={dialog.action === "แก้ไข" ? true : false}
                  />
                  <span
                    className="p-checkbox-label"
                    style={{ marginLeft: "4px" }}
                  >
                    AD/LDAP
                  </span>
                </div>
              )}
            </div>

            <div className="p-col-6"></div>

            {adflag === true && dialog.action !== "แก้ไข" ? (
              <>
                <div className="p-col-6">
                  <label>
                    ชื่อผู้ใช้งาน<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputText
                    value={formAD.user_id}
                    onChange={(e) =>
                      setFormAD({ ...formAD, user_id: e.target.value })
                    }
                    disabled={formAD.result}
                    maxLength="20"
                  />
                </div>
                <div className="p-col-6">
                  <label>
                    รหัสผ่าน<span style={{ color: "red" }}>*</span>
                  </label>
                  {/* <Password
                                            value={formAD.user_password}
                                            onChange={(e) => setFormAD({ ...formAD, user_password: e.target.value })}
                                            feedback={false}
                                            disabled={formAD.result}
                                            maxLength="20"
                                        /> */}
                  <div className="p-inputgroup">
                    {showPassAD === true ? (
                      <>
                        <Password
                          value={formAD.user_password}
                          onChange={(e) =>
                            setFormAD({
                              ...formAD,
                              user_password: e.target.value,
                            })
                          }
                          feedback={false}
                          maxLength="20"
                        />
                        <span
                          className="p-inputgroup-addon"
                          onClick={() => setShowPassAD(!showPassAD)}
                        >
                          <i className="pi pi-eye"></i>
                        </span>
                      </>
                    ) : (
                      <>
                        <InputText
                          maxLength="20"
                          value={formAD.user_password}
                          onChange={(e) =>
                            setFormAD({
                              ...formAD,
                              user_password: e.target.value,
                            })
                          }
                        />
                        <span
                          className="p-inputgroup-addon"
                          onClick={() => setShowPassAD(!showPassAD)}
                        >
                          <i className="pi pi-eye-slash"></i>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {!formAD.result && (
                  <div
                    className="p-col-12"
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      label={"ตรวจสอบเจ้าหน้าที่กรมที่ดิน"}
                      icon="pi pi-refresh"
                      onClick={() => verifyIdentityAD(formAD)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(167 172 175)",
                        color: "#ffffff",
                      }}
                      className="p-button-rounded p-button-secondary"
                    />
                  </div>
                )}
              </>
            ) : (
              <></>
            )}

            {/* ผู้ดูเเลระบบส่วนกลาง */}
            {formObject.register_type_seq === "2" ||
            formObject.register_type_seq === "6" ||
            formObject.register_type_seq === 2 ||
            formObject.register_type_seq === 6 ? (
              <>
                <div className="p-col-6">
                  <label>
                    จังหวัด<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.province_seq + ""}
                    options={optionProvince}
                    onChange={(e) => onProvinceChange(e.value, "-1")}
                    placeholder="เลือกจังหวัด"
                    appendTo={document.body}
                  />
                </div>
                <div className="p-col-6">
                  <label>
                    สำนักงานกรมที่ดิน<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.landoffice_id + ""}
                    options={landOffice}
                    onChange={(e) => onLandOfficeChange(e.value)}
                    placeholder="เลือกสำนักงานที่ดิน"
                    appendTo={document.body}
                    disabled={landOffice.length === 0}
                  />
                </div>
                <div className="p-col-6">
                  <label>
                    ตำแหน่ง<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputText
                    value={formObject.person_position}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        person_position: e.target.value,
                      })
                    }
                  />
                  {submitted &&
                    !formObject.person_position &&
                    validateInputText("person_position", "ตำแหน่ง")}
                </div>
              </>
            ) : (
              ""
            )}

            {/* หน่วยงานภายนอก */}
            {formObject.register_type_seq === 3 ||
            formObject.register_type_seq === "3" ? (
              <>
                {/* <div className="p-col-6">
                                    <label>จังหวัด<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        filter
                                        filterBy="label"
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.province_seq + ""}
                                        options={optionProvince}
                                        onChange={(e) => onProvinceChange(e.value, "-1")}
                                        placeholder="เลือกจังหวัด"
                                        appendTo={document.body}
                                    />
                                </div>
                                <div className="p-col-6">
                                    <label>อำเภอ<span style={{ color: "red" }}>*</span></label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formObject.amphur_seq + ""}
                                        options={optionAmphur.length === 0 ? [{ label: '-กรุณาเลือก-', value: '-1' }] : optionAmphur}
                                        appendTo={document.body}
                                        filter
                                    />
                                    {submitted && formObject.amphur_seq === "-1" && validateInputText('amphur_seq', 'อำเภอ')}
                                </div> */}
                <div className="p-col-6">
                  <label>
                    หน่วยงานภายนอก<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.department_seq + ""}
                    options={optionDepartment}
                    onChange={(e) =>
                      setformObject({ ...formObject, department_seq: e.value })
                    }
                    placeholder="เลือกสำนักงานที่ดิน"
                    appendTo={document.body}
                  />
                </div>
                <div className="p-col-6">
                  <label>
                    ตำแหน่ง<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputText
                    value={formObject.person_position}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        person_position: e.target.value,
                      })
                    }
                  />
                  {submitted &&
                    !formObject.person_position &&
                    validateInputText("person_position", "ตำแหน่ง")}
                </div>
              </>
            ) : (
              ""
            )}

            {/* องค์กรปกครองส่วนท้องถิ่น (อปท.) */}
            {formObject.register_type_seq === 4 ||
            formObject.register_type_seq === "4" ? (
              <>
                <div className="p-col-6">
                  <label>
                    จังหวัด<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.province_seq + ""}
                    options={optionProvince}
                    onChange={(e) => onProvinceChange(e.value, "-1")}
                    placeholder="เลือกจังหวัด"
                    appendTo={document.body}
                    // disabled
                  />
                </div>
                <div className="p-col-6">
                  <label>
                    อำเภอ<span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.amphur_seq + ""}
                    // onChange={(e) => onChangeAmphur(e)}
                    options={
                      optionAmphur.length === 0
                        ? [{ label: "-กรุณาเลือก-", value: "-1" }]
                        : optionAmphur
                    }
                    appendTo={document.body}
                    // disabled={optionAmphur.length === 0}
                    filter
                    // disabled
                  />
                  {submitted &&
                    formObject.amphur_seq === "-1" &&
                    validateInputText("amphur_seq", "อำเภอ")}
                </div>
                <div className="p-col-6">
                  <label>
                    องค์กรปกครองส่วนท้องถิ่น (อปท.)
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={formObject.opt_seq + ""}
                    options={optionOpt}
                    onChange={(e) =>
                      setformObject({ ...formObject, opt_seq: e.value })
                    }
                    placeholder="เลือกสำนักงานที่ดิน"
                    appendTo={document.body}
                    // disabled={landOffice.length === 0}
                    // disabled
                  />
                </div>
                <div className="p-col-6">
                  <label>
                    ตำแหน่ง<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputText
                    value={formObject.person_position}
                    onChange={(e) =>
                      setformObject({
                        ...formObject,
                        person_position: e.target.value,
                      })
                    }
                  />
                  {submitted &&
                    !formObject.person_position &&
                    validateInputText("person_position", "ตำแหน่ง")}
                </div>
              </>
            ) : (
              ""
            )}

            {checkADFlag()}
          </div>
        </Dialog>
      )}

      {/* Service */}
      {dialog.serviceOpen && (
        <Dialog
          header={`กำหนด Service ${dialog.data.register_type_name || ""} ${
            dialog.data.person_fullname || ""
          }`}
          visible={dialog.serviceOpen}
          style={{ width: "75vw" }}
          footer={footerService()}
          onHide={() => (setDialog(false), setSubmitted(false))}
          blockScroll={true}
          // className="p-fluid"
          // contentStyle={{ marginTop: 5 }}
          maximizable
        >
          <DataTable
            dataKey="service_seq"
            header={header}
            globalFilter={globalFilter}
            emptyMessage="ไม่พบข้อมูล"
            selection={selectedTable}
            onSelectionChange={(e) => setSelectedTable(e.value)}
            value={dialog.tableData}
            paginator
            // rows={10}
            // paginatorTemplate={paginatorTemplate()}
            // rowsPerPageOptions={rowsPerPageOptions()}
            // currentPageReportTemplate={currentPageReportTemplate()}
            pageLinkSize={pageLinkSize}
            rows={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            paginatorTemplate={paginatorTemplate}
            currentPageReportTemplate={currentPageReportTemplate}
            autoLayout
            rowHover
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ textAlign: "center", width: "3.5rem" }}
              bodyStyle={{ textAlign: "center" }}
            />
            <Column
              field="index"
              header="ลำดับ"
              headerStyle={{ width: "4.5rem", wordWrap: "break-word" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
            <Column
              field="service_name"
              header="Name"
              style={{ width: "20rem", wordWrap: "break-word" }}
            ></Column>
            <Column
              field="service_url"
              header="URL"
              style={{ wordWrap: "break-word" }}
            ></Column>
            <Column
              field="service_method"
              header="Method"
              style={{
                width: "8em",
                textAlign: "center",
                wordWrap: "break-word",
              }}
            ></Column>
            <Column
              field="service_data_type"
              header="Data Type"
              style={{
                width: "8em",
                textAlign: "center",
                wordWrap: "break-word",
              }}
            ></Column>
            <Column
              field="service_type"
              header="Type"
              style={{
                width: "8em",
                textAlign: "center",
                wordWrap: "break-word",
              }}
            ></Column>
          </DataTable>
        </Dialog>
      )}
    </>
  );
}
