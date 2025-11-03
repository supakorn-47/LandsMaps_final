import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import LPADM04List from "./LPADM04List";
import LPADM04Dialog from "./LPADM04Dialog";
import PageHeader from "../../../components/PageHeader/PageHeader";
import CustomCard from "../../../components/CustomCard/CustomCard";
import ServiceLPADM04 from "../../../service/ServiceADM/ServiceLPADM04";
import { Dialog } from "primereact/dialog";

const QuestionForm = ({ formData }) => {
  return (
    <div style={{ padding: "1rem" }}>
      <h4>กำหนดคำถามสำหรับแบบสอบถาม</h4>
      <p>ฟอร์มคำถามจะมาอยู่ตรงนี้ (ยังไม่ทำจริง)</p>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default function LPADM04() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({
    dialog: false,
    action: "",
    data: null,
  });
  const [dialogQuestion, setDialogQuestion] = useState({
    open: false,
    formData: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, data: null });
  const [submitted, setSubmitted] = useState(false);
  

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await ServiceLPADM04.getDataList();
        if (isMounted) {
          if (res.status === 200 && res.data?.result) {
            const temp = res.data.result.map((item, index) => ({
              ...item,
              index: index + 1,
            }));
            setDataTable(temp);
          } else {
            showMessages("warn", "ไม่พบข้อมูล");
          }
        }
      } catch (err) {
        if (isMounted) showMessages("error", "เกิดข้อผิดพลาด", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const onGetDataList = async () => {
    setLoading(true);
    try {
      const res = await ServiceLPADM04.getDataList();
      if (res.status === 200 && res.data?.result) {
        const temp = res.data.result.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
        setDataTable(temp);
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };

  const validation = (object) => {
    let invalid = false;
    for (const property in object) {
      if (
        object[property] === "" ||
        object[property] === null ||
        object[property] === undefined
      ) {
        if (property !== "remark") invalid = true;
      }
    }
    if (invalid) {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const submitForm = async (form) => {
    console.log("Action ที่ส่งมาคือ:", dialog.action); // log เพื่อตรวจว่ามาจาก เพิ่ม หรือ แก้ไข

    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const payload = {
      form_seq: dialog.data?.form_seq || 0,
      form_date: formatDate(form.createdDate) || formatDate(new Date()),
      form_start_date: formatDate(form.startDate),
      form_finish_date: formatDate(form.endDate),
      form_name_th: form.title_th?.trim() || "",
      form_name_en: form.title_en?.trim() || "",
      form_remark: form.remark ?? "",
      random_num: 1,
    };

    if (!validation(payload)) return;

    setLoading(true);
    try {
      let res;
      if (dialog.action === "บันทึก") {
        res = await ServiceLPADM04.addData(payload);
      } else if (dialog.action === "แก้ไข") {
        res = await ServiceLPADM04.updateData(payload);
      }

      if (res?.status === 200 || res?.status === 201) {
        showMessages("success", dialog.action + "ข้อมูลเรียบร้อยแล้ว");
        setDialog({ dialog: false, action: "", data: null });
        await onGetDataList();
      } else {
        showMessages("warn", "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (err) {
      showMessages(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const onGetDataSurveyListByFormID = async (form) => {
    if (!form?.form_seq) {
      showMessages("warn", "ไม่พบรหัสแบบสอบถาม");
      return;
    }

    setLoading(true);
    try {
      const res = await ServiceLPADM04.getDataSurveyListByFormID(form.form_seq);
      if (res.status === 200 && res.data?.result) {
        showMessages("success", "โหลดรายการคำถามสำเร็จ");
      } else {
        showMessages("warn", "ไม่พบข้อมูลคำถามในแบบสอบถามนี้");
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    if (!deleteDialog?.data?.form_seq) {
      showMessages("warn", "ไม่พบข้อมูลที่จะลบ");
      return;
    }
    setLoading(true);
    try {
      const res = await ServiceLPADM04.deleteData(deleteDialog.data.form_seq);
      if (res.status === 200) {
        showMessages("success", "ลบข้อมูลเรียบร้อยแล้ว");
        setDeleteDialog({ open: false, data: null });
        await onGetDataList();
      } else {
        showMessages("warn", "ไม่สามารถลบข้อมูลได้");
      }
    } catch (err) {
      showMessages(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessages = (severity = "info", summary = "", detail = "") => {
    toast.current.show({ severity, summary, detail, life: 8000 });
  };

  // ✅ แก้ตรงนี้: footerButton ต้องไม่มี onClick ที่เปิด dialog ซ้ำ
  const footerButton = () => (
    <FooterButtonCenter
      onClickOk={onDeleteConfirm}
      onClickCancle={() => setDeleteDialog({ open: false, data: null })}
    />
  );

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={
          <PageHeader config={{ title: "แบบสำรวจความพึงพอใจ (LPADM04)" }} />
        }
        body={
          <LPADM04List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
          />
        }
      />
      <LPADM04Dialog
        dialog={dialog}
        setDialog={setDialog}
        submitForm={submitForm}
        submitted={submitted}
        showMessages={showMessages}
        setLoading={setLoading}
      />
      {deleteDialog.open && (
        <DialogDelete
          visible={deleteDialog.open}
          header="ยืนยันการลบข้อมูล"
          modal
          footer={footerButton()}
          onHide={() => setDeleteDialog({ open: false, data: null })}
          textContent={`คุณต้องการลบข้อมูล ใช่หรือไม่ ?`}
        />
      )}
      {dialogQuestion.open && (
        <Dialog
          header="กำหนดคำถาม"
          visible={dialogQuestion.open}
          style={{ width: "70vw" }}
          onHide={() => setDialogQuestion({ open: false, formData: null })}
          blockScroll
        >
          <QuestionForm formData={dialogQuestion.formData} />
        </Dialog>
      )}
    </div>
  );
}
