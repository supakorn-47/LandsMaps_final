import React, { useCallback, useEffect, useRef, useState } from "react";
import { validateInputText } from "../../../utils/ValidateUtil";
import { DialogConfirm } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import {
  generateKey,
  updateConsumer,
} from "../../../service/ServiceADM/ServiceADM09";
import dayjs from "dayjs";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendars, TH } from "../../../components/Calendar/Calendar";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import copy from "copy-to-clipboard";
import { Date } from "core-js";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";

export const createComponentHandler = (handleChange, name, type) => ({
  // For InputText, Password, InputTextarea
  text: (e) => handleChange(name, e.target.value),

  // For Checkbox
  checkbox: (e) => handleChange(name, e.checked),

  // For RadioButton
  radio: (e) => handleChange(name, e.value),

  // For Calendar, DatePicker
  calendar: (e) => handleChange(name, e.value, type),

  // For Dropdown, MultiSelect
  dropdown: (e) => handleChange(name, e.value),

  // For InputNumber
  number: (e) => handleChange(name, e.value),

  // For Slider
  slider: (e) => handleChange(name, e.value),

  // For ToggleButton
  toggle: (e) => handleChange(name, e.value),
});

const LPADM02ConsumerDialog = ({
  data,
  openDialog,
  setOpenDialog,
  showMessages,
  onUpdateSuccess,
}) => {
  const [copyClipboard, setCopyClipboard] = useState("");
  const [openConfimationDialog, setOpenConfimationDialog] = useState(false);
  const [isValidConsumer, setIsValidConsumer] = useState(true);
  const [consumerData, setConsumerData] = useState({
    consumerkey: "",
    consumersecret: "",
    expire_token: 1,
    consumerType: "UN",
    consumerTypeList: {
      CA: {
        checked: false,
        value: "",
      },
      CQ: {
        checked: false,
        value: "",
      },
      CR: {
        checked: false,
        value: "",
      },
      CD: {
        checked: false,
        startValue: null,
        endValue: null,
      },
    },
    serviceRequestType: "N",
    serviceStartDtm: null,
    serviceEndDtm: null,
    isDolHoliday: true,
    isUnflag: true,
  });

  const textCopyRef = useRef(null);

  const copyToClipboard = (id, text) => {
    copy(text);
    setCopyClipboard(id);
  };
  const handleCancelConsumer = () => {
    setOpenDialog(false);
  };

  const validateConsumerTypeList = (consumerTypeList) => {
    let selectedKeys = Object.keys(consumerTypeList).filter(
      (key) => consumerTypeList[key].checked
    );

    if (selectedKeys.length === 0) return false;

    return selectedKeys.every((key) => {
      if (
        key === "CD" &&
        consumerTypeList[key].startValue &&
        consumerTypeList[key].endValue
      ) {
        return true;
      } else if (key !== "CD" && consumerTypeList[key].value) {
        return true;
      }
      return false;
    });
  };

  const validateConsumer = () => {
    const {
      consumerkey,
      consumersecret,
      expire_token,
      consumerType,
      consumerTypeList,
      serviceRequestType,
      serviceStartDtm,
      serviceEndDtm,
      isDolHoliday,
    } = consumerData;

    let validGenerateKey = !!(consumerkey && consumersecret && expire_token);

    let validCreditType =
      consumerType === "UN" ||
      (consumerType === "LIM" && validateConsumerTypeList(consumerTypeList))
        ? true
        : false;

    let validServiceType =
      (serviceRequestType === "Y" && serviceStartDtm && serviceEndDtm) ||
      serviceRequestType === "N"
        ? true
        : false;

    const isValid = validGenerateKey && validCreditType && validServiceType;

    if (!isValid) {
      setIsValidConsumer(false);
      showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ครบถ้วน");
    } else {
      setIsValidConsumer(true);
    }

    return isValid;
  };

  const handleUpdateConsumer = async () => {
    const isValid = validateConsumer(consumerData);

    if (!isValid) return;

    const {
      consumerkey,
      consumersecret,
      expire_token,
      consumerType,
      consumerTypeList,
      serviceRequestType,
      serviceStartDtm,
      serviceEndDtm,
      isDolHoliday,
    } = consumerData;

    let reqBody = {
      register_seq: data.register_seq,
      consumerkey,
      consumersecret,
      expire_token,
      consumerType: consumerType === "UN" ? consumerType : "",
      consumerTypeList:
        consumerType === "UN" ? [] : mapConsumerTypeList(consumerTypeList),
      serviceRequestType,
      serviceStartDtm: serviceStartDtm
        ? dayjs(serviceStartDtm).utc().format("YYYY-MM-DDTHH:mm:ss")
        : null,
      serviceEndDtm: serviceEndDtm
        ? dayjs(serviceEndDtm).utc().format("YYYY-MM-DDTHH:mm:ss")
        : null,
      isDolHoliday: isDolHoliday ? 1 : 0,
      isUnflag: consumerType === "UN" ? 1 : 0,
    };

    try {
      const res = await updateConsumer(reqBody);
      if (res.status === 200) {
        showMessages("success", `สำเร็จ`, "บันทึกกำหนด Consumer");
        onUpdateSuccess();
        setOpenDialog(false);
      } else if (res.status === 200 && res.error === true) {
        showMessages("error", `เกิดข้อผิดพลาด`, `${res.errors.message}`);
      } else {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${res.status}`,
          `${res.errors.message}`
        );
      }
    } catch (error) {
      showMessages(
        "error",
        `เกิดข้อผิดพลาด Status Code: ${error.response.data.status} ${error.response.data.message}`,
        ""
      );
    }
  };

  const handleGenerateKey = async (type) => {
    try {
      const res = await generateKey(type);
      if (res.status === 200) {
        if (type === "Consumer Key") {
          setConsumerData({
            ...consumerData,
            consumerkey: res.result,
          });
        } else {
          setConsumerData({
            ...consumerData,
            consumersecret: res.result,
          });
        }
      } else {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${res.status}`,
          res.errors.message
        );
      }
    } catch (error) {
      if (error.response.data.status == 401) {
        alert(
          JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
        );
        window.location.href = "/login";
      } else {
        alert(JSON.stringify(error.response.data));
      }
    } finally {
      setOpenConfimationDialog(false);
    }
  };

  const handleChange = useCallback((name, value) => {
    setConsumerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleNestedChange = useCallback((path, value) => {
    setConsumerData((prev) => {
      const keys = path.split(".");
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const transformConsumerTypeList = (consumerTypeList) => {
    return consumerTypeList
      .filter(({ consumerTypeCode }) => consumerTypeCode !== "UN")
      .reduce(
        (
          acc,
          {
            consumerTypeCode,
            consumerTypeValue,
            consumerTypeStartValue,
            consumerTypeEndValue,
          }
        ) => {
          let result = {};
          if (consumerTypeCode === "CD") {
            result = {
              checked:
                consumerTypeStartValue && consumerTypeEndValue ? true : false,
              startValue: dayjs(consumerTypeStartValue),
              endValue: dayjs(consumerTypeEndValue),
            };
          } else {
            result = {
              checked: consumerTypeValue ? true : false,
              value: consumerTypeValue,
            };
          }
          acc[consumerTypeCode] = result;

          return acc;
        },
        {}
      );
  };

  const mapConsumerTypeList = (consumerTypeList) => {
    let selectedKeys = Object.keys(consumerTypeList).filter(
      (key) => consumerTypeList[key].checked
    );

    return selectedKeys.map((key) => {
      if (consumerTypeList[key].checked && key === "CD") {
        return {
          consumerTypeCode: key,
          consumerTypeStartValue:
            consumerTypeList[key].startValue.toISOString(),
          consumerTypeEndValue: consumerTypeList[key].endValue.toISOString(),
        };
      } else if (consumerTypeList[key].checked) {
        return {
          consumerTypeCode: key,
          consumerTypeValue: consumerTypeList[key].value,
        };
      }
    });
  };

  const resetConsumerData = () => {
    setConsumerData({
      consumerkey: "",
      consumersecret: "",
      expire_token: 1,
      consumerType: "UN",
      consumerTypeList: {
        CA: {
          checked: false,
          value: "",
        },
        CQ: {
          checked: false,
          value: "",
        },
        CR: {
          checked: false,
          value: "",
        },
        CD: {
          checked: false,
          startValue: null,
          endValue: null,
        },
      },
      serviceRequestType: "N",
      serviceStartDtm: null,
      serviceEndDtm: null,
      isDolHoliday: true,
      isUnflag: true,
    });
  };

  useEffect(() => {
    if (openDialog) {
      if (data.config) {
        const {
          consumerType,
          consumerTypeList,
          consumerkey,
          consumersecret,
          expire_token,
          isDolHoliday,
          isUnflag,
          serviceEndDtm,
          serviceRequestType,
          serviceStartDtm,
        } = data.config;

        let transformConsumer = transformConsumerTypeList(consumerTypeList);
        let availableConsumerTypeList =
          Object.keys(transformConsumer || {}).length === 0
            ? consumerData.consumerTypeList
            : { ...consumerData.consumerTypeList, ...transformConsumer };

        setConsumerData({
          consumerType: consumerType || "LIM",
          consumerTypeList: availableConsumerTypeList,
          consumerkey,
          consumersecret,
          expire_token,
          isDolHoliday: isDolHoliday === 1,
          isUnflag: isUnflag === 1,
          serviceEndDtm,
          serviceRequestType,
          serviceStartDtm,
        });
      }
    }

    return () => {
      resetConsumerData();
      setIsValidConsumer(true);
      setCopyClipboard("");
      setOpenConfimationDialog(false);
    };
  }, [openDialog]);

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => handleCancelConsumer()}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label={"บันทึก"}
          icon="pi pi-check"
          onClick={() => handleUpdateConsumer()}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const renderFooterConfirmation = () => {
    return (
      <FooterButtonCenter
        onClickOk={() => handleGenerateKey(openConfimationDialog.title)}
        onClickCancle={() => setOpenConfimationDialog(false)}
      />
    );
  };

  const renderHeader = () => {
    return `กำหนด Consumer${
      data?.register_type_name &&
      ` ${data?.register_type_name} ${data?.person_fullname}`
    }`;
  };

  return (
    <>
      <Dialog
        header={renderHeader()}
        visible={openDialog}
        style={{ width: "50vw" }}
        footer={renderFooter()}
        onHide={() => handleCancelConsumer()}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid">
          <div className="p-col-12">
            <label>
              Consumer-Key<span style={{ color: "red" }}>*</span>
            </label>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <InputText
                ref={textCopyRef}
                value={consumerData.consumerkey}
                disabled
                style={{ flex: 1 }}
              />

              {consumerData.consumerkey && (
                <Button
                  onClick={() =>
                    copyToClipboard("Consumer Key", consumerData.consumerkey)
                  }
                  icon="pi pi-copy"
                  className={
                    copyClipboard === "Consumer Key"
                      ? "p-button-rounded p-button-info"
                      : "p-button-rounded p-button-secondary"
                  }
                  tooltip={
                    copyClipboard === "Consumer Key"
                      ? "คัดลอกสำเร็จ"
                      : "คัดลอก Consumer Key"
                  }
                  tooltipOptions={{ position: "top" }}
                  disabled={!consumerData.consumerkey}
                />
              )}

              <Button
                onClick={() =>
                  setOpenConfimationDialog({
                    visible: true,
                    title: "Consumer Key",
                  })
                }
                label={`Generate Key`}
                style={{ flex: "none", width: "fit-content" }}
                icon="pi pi-key"
                className="p-button-rounded p-button-success"
                tooltip="คลิกเพื่อสร้างคีย์"
                tooltipOptions={{ position: "top" }}
              />
            </div>

            {!isValidConsumer &&
              consumerData.consumerkey === "" &&
              validateInputText("consumerkey", "Consumer Key")}
          </div>

          <div className="p-col-12">
            <label>
              Consumer-Secret<span style={{ color: "red" }}>*</span>
            </label>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <InputText
                id="clipboard"
                value={consumerData.consumersecret}
                disabled
                style={{ flex: 1 }}
              />
              {consumerData.consumersecret && (
                <Button
                  onClick={() =>
                    copyToClipboard(
                      "Consumer Secret",
                      consumerData.consumersecret
                    )
                  }
                  label={``}
                  icon="pi pi-copy"
                  className={
                    copyClipboard === "Consumer Secret"
                      ? "p-button-rounded p-button-info"
                      : "p-button-rounded p-button-secondary"
                  }
                  tooltip={
                    copyClipboard === "Consumer Secret"
                      ? "คัดลอกสำเร็จ"
                      : "คัดลอก Consumer Secret"
                  }
                  tooltipOptions={{ position: "top" }}
                />
              )}
              <Button
                onClick={() =>
                  setOpenConfimationDialog({
                    visible: true,
                    title: "Consumer Secret",
                  })
                }
                label={`Generate Key`}
                style={{ flex: "none", width: "fit-content" }}
                icon="pi pi-key"
                className="p-button-rounded p-button-success"
                tooltip="คลิกเพื่อสร้างคีย์"
                tooltipOptions={{ position: "top" }}
              />
            </div>

            {!isValidConsumer &&
              consumerData.consumersecret === "" &&
              validateInputText("consumersecret", "Consumer Secret")}
          </div>

          <div className="p-col-4">
            <label>
              อายุ Token (นาที)<span style={{ color: "red" }}>*</span>
            </label>
            <InputNumber
              value={consumerData.expire_token}
              onValueChange={
                createComponentHandler(handleChange, "expire_token").number
              }
              min={1}
              max={365}
              // keyfilter="int"
            />
            {!isValidConsumer &&
              (consumerData.expire_token === 0 ||
                consumerData.expire_token === "") &&
              validateInputText("expire_token", "อายุ Token (นาที)")}
          </div>
          <div className="p-col-8" />

          <hr style={{ width: "100%", color: "#868686" }} />

          <div className="p-col-12">
            <label style={{ fontSize: "16px" }}>
              <b>ประเภทการใช้ข้อมูล Service Api</b>
            </label>
          </div>
          <div className="p-col-12 p-field-radiobutton custom-radio-group">
            <RadioButton
              inputid="consumerTypeUN"
              name="consumerTypeUN"
              value="UN"
              checked={consumerData.consumerType === "UN"}
              onChange={
                createComponentHandler(handleChange, "consumerType").radio
              }
            />
            <label htmlFor="consumerTypeUN">ไม่จำกัดการใช้งาน</label>
          </div>
          <div className="p-col-12 p-field-radiobutton">
            <div className="custom-radio-group">
              <RadioButton
                inputid="consumerTypeLIM"
                name="consumerTypeLIM"
                value="LIM"
                checked={consumerData.consumerType === "LIM"}
                onChange={
                  createComponentHandler(handleChange, "consumerType").radio
                }
              />
              <label htmlFor="consumerTypeLIM">จำกัดการใช้งาน</label>
            </div>
            <div
              style={{
                paddingLeft: "1.5rem",
              }}
              className="p-grid"
            >
              <div className="p-col-6 p-field-checkbox custom-radio-group">
                <Checkbox
                  inputid="consumerTypeCA"
                  name="consumerTypeCA"
                  value="CA"
                  checked={consumerData.consumerTypeList.CA.checked}
                  onChange={
                    createComponentHandler(
                      handleNestedChange,
                      "consumerTypeList.CA.checked"
                    ).checkbox
                  }
                  disabled={consumerData.consumerType === "UN"}
                />
                <label htmlFor="consumerTypeCA">ใช้งานตามกรอบวงเงิน</label>
              </div>
              <div className="p-col-6 p-field-radiobutton">
                <div className="p-inputgroup">
                  <InputText
                    inputid="consumerTypeCAValue"
                    name="consumerTypeCAValue"
                    disabled={
                      consumerData.consumerType === "UN" ||
                      !consumerData.consumerTypeList.CA.checked
                    }
                    value={consumerData.consumerTypeList.CA.value}
                    onChange={
                      createComponentHandler(
                        handleNestedChange,
                        "consumerTypeList.CA.value"
                      ).text
                    }
                    keyfilter="int"
                  />
                  <span className="p-inputgroup-addon">บาท</span>
                </div>
              </div>

              <div className="p-col-6 p-field-radiobutton custom-radio-group">
                <Checkbox
                  inputid="consumerTypeCQ"
                  name="consumerTypeCQ"
                  value="CQ"
                  checked={consumerData.consumerTypeList.CQ.checked}
                  onChange={
                    createComponentHandler(
                      handleNestedChange,
                      "consumerTypeList.CQ.checked"
                    ).checkbox
                  }
                  disabled={consumerData.consumerType === "UN"}
                />
                <label htmlFor="consumerTypeCQ">
                  ใช้งานตามกรอบปริมาณข้อมูล
                </label>
              </div>

              <div className="p-col-6 p-field-radiobutton">
                <div className="p-inputgroup">
                  <InputText
                    disabled={
                      consumerData.consumerType === "UN" ||
                      !consumerData.consumerTypeList.CQ.checked
                    }
                    inputid="consumerTypeCQValue"
                    name="consumerTypeCQValue"
                    value={consumerData.consumerTypeList.CQ.value}
                    // onChange={(e) => handleChangeValue(e, "consumerCreditQty")}
                    onChange={
                      createComponentHandler(
                        handleNestedChange,
                        "consumerTypeList.CQ.value"
                      ).text
                    }
                    keyfilter="int"
                  />
                  <span className="p-inputgroup-addon">GB</span>
                </div>
              </div>
              <div className="p-col-6 p-field-radiobutton custom-radio-group">
                <Checkbox
                  inputid="consumerTypeCR"
                  name="consumerTypeCR"
                  value="CR"
                  checked={consumerData.consumerTypeList.CR.checked}
                  onChange={
                    createComponentHandler(
                      handleNestedChange,
                      "consumerTypeList.CR.checked"
                    ).checkbox
                  }
                  disabled={consumerData.consumerType === "UN"}
                />
                <label htmlFor="consumerTypeCR">จำกัดตามปริมาณ Request</label>
              </div>
              <div className="p-col-6 p-field-radiobutton">
                <div className="p-inputgroup">
                  <InputText
                    disabled={
                      consumerData.consumerType === "UN" ||
                      !consumerData.consumerTypeList.CR.checked
                    }
                    inputid="consumerTypeCRValue"
                    name="consumerTypeCRValue"
                    value={consumerData.consumerTypeList.CR.value}
                    onChange={
                      createComponentHandler(
                        handleNestedChange,
                        "consumerTypeList.CR.value"
                      ).text
                    }
                    keyfilter="int"
                  />
                  <span className="p-inputgroup-addon">จำนวนครั้ง</span>
                </div>
              </div>
              <div
                className="p-col-12 p-field-radiobutton custom-radio-group"
                style={{ marginTop: "5px", display: "flex" }}
              >
                <Checkbox
                  inputid="consumerTypeCD"
                  name="consumerTypeCD"
                  value="CD"
                  onChange={
                    createComponentHandler(
                      handleNestedChange,
                      "consumerTypeList.CD.checked"
                    ).checkbox
                  }
                  checked={consumerData.consumerTypeList.CD.checked}
                  disabled={consumerData.consumerType === "UN"}
                />
                <label htmlFor="consumerTypeCD">
                  ใช้งานตามจำนวนวัน เริ่มต้น - สิ้นสุด
                </label>
              </div>
              <div
                style={{
                  paddingLeft: "2rem",
                  display: "flex",
                }}
                className="p-col-12"
              >
                <div className="p-col-6 p-field-radiobutton">
                  <label>เริ่มการใช้งาน</label>
                  <Calendars
                    disabled={
                      consumerData.consumerType === "UN" ||
                      !consumerData.consumerTypeList.CD.checked
                    }
                    name="consumerTypeCDStart"
                    dateFormat={"dd/mm/yy"}
                    value={
                      consumerData.consumerTypeList.CD.startValue
                        ? new Date(consumerData.consumerTypeList.CD.startValue)
                        : null
                    }
                    onChange={
                      createComponentHandler(
                        handleNestedChange,
                        "consumerTypeList.CD.startValue"
                      ).calendar
                    }
                  />
                </div>
                <div className="p-col-6 p-field-radiobutton">
                  <label>สิ้นสุดการใช้งาน</label>
                  <Calendars
                    disabled={
                      consumerData.consumerType === "UN" ||
                      !consumerData.consumerTypeList.CD.checked
                    }
                    name="consumerTypeCDEnd"
                    dateFormat={"dd/mm/yy"}
                    value={
                      consumerData.consumerTypeList.CD.endValue
                        ? new Date(consumerData.consumerTypeList.CD.endValue)
                        : null
                    }
                    onChange={
                      createComponentHandler(
                        handleNestedChange,
                        "consumerTypeList.CD.endValue"
                      ).calendar
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <hr style={{ width: "100%", color: "#868686" }} />

          <div className="p-col-12">
            <label style={{ fontSize: "16px" }}>
              <b>ระยะเวลาการใช้งาน เปิด - ปิด Service Api</b>
            </label>
          </div>

          <div className="p-col-12 p-field-radiobutton custom-radio-group">
            <RadioButton
              name="serviceRequestN"
              value="N"
              onChange={
                createComponentHandler(handleChange, "serviceRequestType").radio
              }
              checked={consumerData.serviceRequestType === "N"}
            />
            <label htmlFor="serviceRequestN">ไม่กำหนดเวลา Request</label>
          </div>
          <div className="p-col-12 p-field-radiobutton">
            <div className="custom-radio-group">
              <RadioButton
                name="serviceRequestY"
                value="Y"
                onChange={
                  createComponentHandler(handleChange, "serviceRequestType")
                    .radio
                }
                checked={consumerData.serviceRequestType === "Y"}
              />
              <label htmlFor="serviceRequestY">กำหนดเวลา</label>
            </div>
            <div
              style={{
                paddingLeft: "1.5rem",
                display: "flex",
              }}
              className="p-grid"
            >
              <div className="p-col-4">
                <label>เวลาเริ่มการใช้งาน</label>
                <Calendar
                  showButtonBar
                  disabled={consumerData.serviceRequestType === "N"}
                  value={
                    consumerData.serviceStartDtm
                      ? new Date(consumerData.serviceStartDtm)
                      : null
                  }
                  timeOnly
                  showIcon
                  onChange={
                    createComponentHandler(handleChange, "serviceStartDtm")
                      .calendar
                  }
                  locale={TH}
                />
              </div>
              <div className="p-col-4">
                <label>เวลาสิ้นสุดการใช้งาน</label>
                <Calendar
                  showButtonBar
                  disabled={consumerData.serviceRequestType === "N"}
                  value={
                    consumerData.serviceEndDtm
                      ? new Date(consumerData.serviceEndDtm)
                      : null
                  }
                  timeOnly
                  showIcon
                  onChange={
                    createComponentHandler(handleChange, "serviceEndDtm")
                      .calendar
                  }
                  locale={TH}
                />
              </div>
              <div
                className="p-col-12"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Checkbox
                  id="isDolHoliday"
                  checked={consumerData.isDolHoliday}
                  disabled={consumerData.serviceRequestType === "N"}
                  onChange={
                    createComponentHandler(handleChange, "isDolHoliday")
                      .checkbox
                  }
                />

                <label htmlFor="isDolHoliday" style={{ margin: 0 }}>
                  ทุกวัน ยกเว้นวันหยุดราชการ
                </label>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* confirm generate key */}
      <DialogConfirm
        visible={openConfimationDialog?.visible}
        header="การยืนยัน"
        modal
        footer={renderFooterConfirmation()}
        onHide={() => setOpenConfimationDialog(false)}
        textContent={`คุณต้องการ Generate Key "${openConfimationDialog.title}" ใหม่`}
        checkTextConTent={true}
      />
    </>
  );
};

export default LPADM02ConsumerDialog;
