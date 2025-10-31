import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import {
  DialogConfirm,
  DialogDelete,
} from "../../../components/DialogService/DialogService";
import FooterButton, {
  FooterButtonCenter,
} from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";
//PAGE
import ADM01List from "./ADM01List";
import ADM01Dialog from "./ADM01Dialog";

//SERVICE
import ADM01Services from "../../../service/ServiceADM/ServiceLPASM01";

// CSS
import "../../index.css";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function ADM01() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [maxOrd, setMaxOrd] = useState(0);

  const onADM01GetDataList = () => {
    setLoading(true);
    ADM01Services.GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status == 200 && res.result != null) {
          setDataTable(res.result);
        }
        let temp = [];
        res.result.forEach((element) => {
          temp.push(element.register_type_ord);
        });
        setMaxOrd(Math.max(...temp) + 1);
      },
      function (err) {
        console.log("err", err);
        if (err.response.data.status == 401) {
          // alert(JSON.stringify('เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่'))
          // window.location.href = '/login'
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    onADM01GetDataList();
  }, []);

  const validation = (object) => {
    if (object.register_type_name === "" || object.record_status === null) {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const submitForm = (submitForm) => {
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      setDialog(true);
      ADM01Services.CreateData({
        ...submitForm,
        register_type_ord: maxOrd,
      }).then(
        (res) => {
          showMessages("success", `สำเร็จ`, "บันทึกกลุ่มผู้ใช้งาน");
          onADM01GetDataList();
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
    } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
      setDialog(true);
      ADM01Services.UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          showMessages("success", `สำเร็จ`, "แก้ไขกลุ่มผู้ใช้งาน");
          onADM01GetDataList();
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

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 10000,
    });
  };

  const footerButton = () => {
    const onADM01CancelData = () => {
      ADM01Services.CancelData({
        ...deleteDialog.data,
        record_status: deleteDialog.record_status,
      }).then(
        (res) => {
          setLoading(false);
          showMessages(
            "success",
            `สำเร็จ`,
            `${
              deleteDialog.record_status === "C" ? "ยกเลิก" : "ลบ"
            }ข้อมูลสำเร็จ`
          );
          onADM01GetDataList();
          setDeleteDialog(false);
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
        onClickOk={() => onADM01CancelData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  const onRowReorder = (e) => {
    setDialog(true);
    ADM01Services.UpdateUpOrDownData(e.value).then(
      (res) => {
        setLoading(false);
        showMessages("success", `สำเร็จ`, "บันทึกจัดเรียง");
        onADM01GetDataList();
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
            config={{
              title: "ข้อมูลกลุ่มผู้ใช้งาน",
            }}
          />
        }
        body={
          <ADM01List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onRowReorder={(e) => onRowReorder(e)}
          />
        }
      />

      {dialog.dialog === true ? (
        <ADM01Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={(e) => submitForm(e)}
          onADM01GetDataList={() => onADM01GetDataList()}
          submitted={submitted}
        />
      ) : (
        ""
      )}
      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        textContent={deleteDialog.textConfirm} //"คุณต้องการยกเลิกข้อมูล ใช่หรือไม่ ?"
      />
    </div>
  );
}
