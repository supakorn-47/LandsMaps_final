import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
// import ADM05Search from './ADM05Search';
import ADM05List from "./ADM05List";
import ADM05Dialog from "./ADM05Dialog";

//SERVICE
import {
  ADM05GetDataList,
  ADM05CreateData,
  ADM05UpdateData,
  ADM05CancelData,
  UpdateOrder,
} from "../../../service/ServiceADM/ServiceADM05";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function ADM05() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
  }, [dialog]);

  useEffect(() => {
    onADM05GetDataList();
  }, []);

  const onADM05GetDataList = () => {
    setLoading(true);
    ADM05GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status === 200 && res.result != null) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              index: index,
              rate: 0
            });
            index++;
          });
          setDataTable(temp);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.errors.message
          );
        }
      },
      function (err) {
        setLoading(false);
        if (err.response.data.status == 401) {
          console.log(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          console.log(JSON.stringify(err.response.data));
        }
        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );
  };

  const validation = (object) => {
    let showerror = false;
    // for (const property in object) {
    //     if (object[property] === 0 || object[property] === '' || object[property] === null || object[property] === undefined) {
    //         showerror = true
    //     }
    // }

    if (
      object.error_type_name === "" ||
      object.record_status === null ||
      object.record_status === undefined
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
    if (dialog.action === "เพิ่ม" && validation(submitForm)) {
      setLoading(true);
      ADM05CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "บันทึกข้อมูลประเภทข้อผิดพลาด");
            onADM05GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.errors.message}`
            );
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
    } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
      setLoading(true);
      ADM05UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขข้อมูลประเภทข้อผิดพลาด");
            onADM05GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.errors.message}`
            );
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
    }
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const footerButton = () => {
    const onADM03DeleteData = () => {
      ADM05CancelData(deleteDialog).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              `${
                deleteDialog.record_status === "C" ? "ยกเลิก" : "ลบ"
              }ข้อมูลสำเร็จ`
            );
            onADM05GetDataList();
            setDeleteDialog(false);
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
        onClickOk={() => onADM03DeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  //สถานะ
  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue === "N" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue === "N" ? "#256029" : "#c63737",
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {datavalue === "N" ? "ใช้งาน" : "ไม่ใช้งาน"}
        </span>
      </>
    );
  };

  const onRowReorder = (e) => {
    setDialog(true);
    UpdateOrder(e.value).then(
      (res) => {
        setLoading(false);
        showMessages("success", `สำเร็จ`, "บันทึกจัดเรียง");
        onADM05GetDataList();
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
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={
          <PageHeader
            config={{ title: "กำหนดอัตราค่าตั้งต้นของการใช้บริการ" }}
          />
        }
        body={
          <ADM05List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            returnStatus={returnStatus}
            onRowReorder={onRowReorder}
          />
        }
      />

      <ADM05Dialog
        dialog={dialog}
        setDialog={setDialog}
        submitForm={(e) => submitForm(e)}
        submitted={submitted}
        returnStatus={returnStatus}
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
    </div>
  );
}
