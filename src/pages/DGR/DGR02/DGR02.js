import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import {
  DialogConfirm,
  DialogDelete,
} from "../../../components/DialogService/DialogService";
import FooterButton, {
  FooterButtonCenter,
} from "../../../components/FooterButton/FooterButton";
import { Dialog } from "primereact/dialog";
import Iframe from "react-iframe";
import { Button } from "primereact/button";
import { Loading } from "../../../components/Loading/Loading";
import DGR02List from "./DGR02List";
import DGR02Dialog from "./DGR02Dialog";
import { getTextMenu } from "../../../utils/MenuUtil";

//SERVICE
import ServiceDGR02 from "../../../service/ServiceDGR/ServiceDGR02";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

const DGR02 = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [popupViewFile, setPopupViewFile] = useState(false);

  useEffect(() => {
    onGetDataList();
  }, []);

  const onGetDataList = () => {
    setLoading(true);
    ServiceDGR02.GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status == 200 && res.result != null) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              index: index,
            });
            index++;
          });
          setDataTable(temp);
        }
      },
      function (err) {
        setLoading(false);
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          console.error(err);
          //   alert(JSON.stringify(err.response.data));
        }
      }
    );
  };

  const validation = (object) => {
    let showerror = false;
    if (
      object.gdg_version === undefined ||
      object.gdg_version_date === null ||
      object.gdg_document_name === "" ||
      object.gdg_organizer === "" ||
      object.gdg_approver === ""
    ) {
      showerror = true;
    }
    if (showerror) {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const submitForm = (submitForm) => {
    if (dialog.action === "ADD" && validation(submitForm)) {
      setLoading(true);
      ServiceDGR02.CreateData({
        ...submitForm,
      }).then(
        (res) => {
          setLoading(false);
          showMessages("success", `สำเร็จ`, "บันทึกข้อมูลเอกสาร");
          onGetDataList();
          setDialog(false);
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    } else if (dialog.action === "UPDATE" && validation(submitForm)) {
      setLoading(true);
      ServiceDGR02.UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          showMessages("success", `สำเร็จ`, "แก้ไขข้อมูลเอกสาร");
          onGetDataList();
          setDialog(false);
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    }
  };

  const onChangeUpdatePublicFlg = (rowData, value) => {
    setLoading(true);
    ServiceDGR02.SetPublicFlag({
      ...rowData,
      gdg_public_flag: value === true ? "1" : "0",
    }).then(
      (res) => {
        setLoading(false);
        showMessages(
          "success",
          `สำเร็จ`,
          value === true ? "เปิดเผยแพร่เอกสาร" : "ปิดเผยแพร่เอกสาร"
        );
        onGetDataList();
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const footerPDF = () => {
    return (
      <div className="dialog-footer-action-center">
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => setPopupViewFile(false)}
          className="p-button-secondary p-button-rounded"
        />
      </div>
    );
  };

  const footerButton = () => {
    const onCancelData = () => {
      ServiceDGR02.CancelData(deleteDialog.data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, `ลบข้อมูลสำเร็จ`);
            onGetDataList();
            setDeleteDialog(false);
          } else {
            showMessages("error", `เกิดข้อผิดพลาด`, `ลบข้อมูลไม่สำเร็จ`);
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    };
    return (
      <FooterButtonCenter
        onClickOk={() => onCancelData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={
          <PageHeader config={{ title: "เอกสารธรรมาภิบาลข้อมูลภาครัฐ" }} />
        }
        body={
          <DGR02List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            setPopupViewFile={setPopupViewFile}
            onChangeUpdatePublicFlg={onChangeUpdatePublicFlg}
          />
        }
      />

      <DGR02Dialog
        dialog={dialog}
        setDialog={setDialog}
        submitForm={(e) => submitForm(e)}
        submitted={submitted}
        showMessages={showMessages}
        setLoading={setLoading}
      />

      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        textContent={deleteDialog.textConfirm}
      />

      {popupViewFile && (
        <Dialog
          header="PDF"
          visible={popupViewFile.open}
          blockScroll={true}
          maximized={true}
          onHide={() => setPopupViewFile({ open: false, linkURL: null })}
          footer={footerPDF()}
        >
          <div className="confirmation-content" style={{ paddingTop: "0em" }}>
            <Iframe
              url={popupViewFile.linkURL}
              width="100%"
              height={window.innerHeight - 110}
              display="initial"
              position="relative"
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default DGR02;
