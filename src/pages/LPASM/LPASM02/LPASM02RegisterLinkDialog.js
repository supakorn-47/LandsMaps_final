import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import copy from "copy-to-clipboard";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import dayjs from "dayjs";
import { Calendars } from "../../../components/Calendar/Calendar";
import ADM02Services from "../../../service/ServiceADM/ServiceADM02";
import { DialogConfirm } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { validateInputText } from "../../../utils/ValidateUtil";

const LPASM02RegisterLinkDialog = ({
  data,
  openDialog,
  setOpenDialog,
  showMessages,
}) => {
  const [copyClipboard, setCopyClipboard] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const textCopyRef = useRef(null);
  const [registerLinkData, setRegisterLinkData] = useState({
    departmentLinkKey: "",
    urlDepartmentLinkKey: "",
    expireToken: 1,
    departmentSeq: -1,
  });
  const [isValidRegisterLink, setIsValidRegisterLink] = useState(true);

  useEffect(() => {
    if (openDialog) {
      setRegisterLinkData({
        ...data,
        departmentLinkKey: data.departmentLinkKey || "",
        urlDepartmentLinkKey: data.urlDepartmentLinkKey || "",
        expireToken: data.expireToken || 1,
      });
    }

    return () => {
      resetRegisterLinkData();
      setIsValidRegisterLink(true);
      setCopyClipboard("");
      setOpenConfirmDialog(false);
    };
  }, [openDialog]);

  const resetRegisterLinkData = () => {
    setRegisterLinkData({
      departmentLinkKey: "",
      urlDepartmentLinkKey: "",
      expireToken: 1,
      departmentSeq: -1,
    });
  };
  const copyToClipboard = (id, text) => {
    copy(text);
    setCopyClipboard(id);
  };

  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setOpenDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => handleUpdateRegisterLink()}
          autoFocus
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  const renderFooterConfirmation = () => {
    return (
      <FooterButtonCenter
        onClickOk={() => handleGenerateLink()}
        onClickCancle={() => setOpenConfirmDialog(false)}
      />
    );
  };

  const handleGenerateLink = async () => {
    try {
      const data = await ADM02Services.GenerateLinkSecret();
      if (data)
        setRegisterLinkData({
          ...registerLinkData,
          urlDepartmentLinkKey: data?.urlDepartmentLinkKey,
          departmentLinkKey: data?.departmentLinkKey,
        });
    } catch (error) {
      // Handle different types of errors
      if (error.response?.data) {
        const { status, message } = error.response.data;
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${status} ${message}`,
          ""
        );
      } else {
        // Fallback for unexpected error formats
        showMessages(
          "error",
          `เกิดข้อผิดพลาดไม่ทราบสาเหตุ: ${error.message}`,
          ""
        );
      }
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const validateConsumer = () => {
    const { departmentLinkKey, expireToken } = registerLinkData;
    const isValid = departmentLinkKey && expireToken;

    if (!isValid) {
      setIsValidRegisterLink(false);
      showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ครบถ้วน");
    } else {
      setIsValidRegisterLink(true);
    }

    return isValid;
  };

  const handleUpdateRegisterLink = async () => {
    const isValid = validateConsumer();

    if (!isValid) return;

    const reqBody = {
      departmentSeq: registerLinkData.departmentSeq,
      departmentLinkKey: registerLinkData.departmentLinkKey,
      expireToken: registerLinkData.expireToken,
    };
    try {
      const res = await ADM02Services.UpdateLinkSecret(reqBody);
      if (res) showMessages("success", `สำเร็จ`, "บันทึกข้อมูลลิงก์ลงทะเบียน");
    } catch (error) {
      // Handle different types of errors
      if (error.response?.data) {
        const { status, message } = error.response.data;
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${status} ${message}`,
          ""
        );
      } else {
        // Fallback for unexpected error formats
        showMessages(
          "error",
          `เกิดข้อผิดพลาดไม่ทราบสาเหตุ: ${error.message}`,
          ""
        );
      }
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Dialog
        header="สร้างลิงก์การลงทะเบียนเข้าใช้ระบบ"
        visible={openDialog}
        style={{ width: 600, maxWidth: "80%" }}
        footer={renderFooter()}
        onHide={() => setOpenDialog(false)}
        blockScroll={true}
        focusOnShow={false}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <div>
            <label>Register Link</label>
            <div
              style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}
            >
              <InputText
                ref={textCopyRef}
                value={registerLinkData.urlDepartmentLinkKey}
                style={{ flex: 1 }}
                disabled
              />

              <Button
                onClick={() =>
                  copyToClipboard(
                    "Register link",
                    registerLinkData.urlDepartmentLinkKey
                  )
                }
                icon="pi pi-copy"
                className="p-button-rounded p-button-secondary"
                style={{ flex: "none" }}
                tooltip={"คัดลอกลิงก์"}
                tooltipOptions={{ position: "top" }}
                disabled={!registerLinkData.urlDepartmentLinkKey}
              />
            </div>
            {!isValidRegisterLink &&
              registerLinkData.urlDepartmentLinkKey === "" &&
              validateInputText("urlDepartmentLinkKey", "Register Link")}
          </div>
          <div>
            <label>Expired Token (วัน)</label>
            <div
              style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}
            >
              <InputNumber
                value={registerLinkData.expireToken}
                onValueChange={(e) =>
                  setRegisterLinkData({
                    ...registerLinkData,
                    expireToken: e.value,
                  })
                }
                min={1}
                max={365}
              />
            </div>
            {/* <small style={{ fontSize: 12, color: "#6c757d" }}>
              {`(Token จะหมดอายุในวันที่ ${dayjs()
                .add(registerLinkData.expireToken, "day")
                .format("DD/MM/YYYY")})`}
            </small> */}
          </div>

          {/* <div>
          <label>Expired Date</label>
          <div
            style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}
          >
            <Calendars
              showIcon
              value={expireDate}
              // maxDate={dayjs().add(3, "month")}
              onChange={(e) => setExpireDate}
            />
          </div>
        </div> */}

          <Button
            onClick={() => setOpenConfirmDialog(true)}
            label={
              registerLinkData.urlDepartmentLinkKey
                ? "Re-generate Link"
                : "Generate link"
            }
            icon="pi pi-link"
            className="p-button-rounded p-button-success"
            tooltip="คลิกเพื่อสร้างลิงก์"
            tooltipOptions={{ position: "top" }}
            style={{ width: "fit-content" }}
          />
        </div>
      </Dialog>
      {/* confirm generate key */}
      <DialogConfirm
        visible={openConfirmDialog}
        header="การยืนยัน"
        modal
        footer={renderFooterConfirmation()}
        onHide={() => setOpenConfirmDialog(false)}
        textContent={`คุณต้องการ Generate Register Link ใหม่`}
        checkTextConTent={true}
      />
    </>
  );
};

export default LPASM02RegisterLinkDialog;
