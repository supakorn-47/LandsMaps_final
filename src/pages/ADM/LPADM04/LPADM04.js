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
import { Button } from "primereact/button";

export default function LPADM04() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({
    dialog: false,
    dialogConfigQuestion: false,
    dialogGroup: false,
    action: "",
    data: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, data: null });
  const [submitted, setSubmitted] = useState(false);
  const [formObject, setformObject] = useState([]); // ✅ สำหรับคำถาม
  const [checkBox, setCheckBox] = useState([]); // ✅ สำหรับกำหนดกลุ่มผู้ใช้

  useEffect(() => {
    onGetDataList();
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
      } else {
        showMessages("warn", "ไม่พบข้อมูล");
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };

  const validation = (object) => {
    let invalid = false;
    for (const [key, value] of Object.entries(object)) {
      if (key === "remark" || key === "form_remark") continue;
      if (value === "" || value === null || value === undefined) {
        console.warn("[DEBUG] validation ไม่ผ่านที่ช่อง:", key);
        invalid = true;
      }
    }
    return !invalid;
  };

  const submitForm = async (form) => {
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

    if (!validation(payload)) {
      showMessages("warn", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

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

  const onGetDataSurveyListByFormID = async (rowData) => {
    setDialog({
      ...dialog,
      dialogConfigQuestion: true,
      data: rowData,
    });
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

  const footerButton = () => (
    <FooterButtonCenter
      onClickOk={onDeleteConfirm}
      onClickCancle={() => setDeleteDialog({ open: false, data: null })}
    />
  );

  const onCreateDataSurveyUser = (dataForm) => {
    console.log("สร้างกลุ่มผู้ใช้:", dataForm);
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={<PageHeader config={{ title: "แบบสำรวจความพึงพอใจ" }} />}
        body={
          <LPADM04List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onGetDataSurveyListByFormID={onGetDataSurveyListByFormID}
          />
        }
      />

      {/* ✅ Dialog รวม (Add/Edit/ConfigQuestion/ConfigGroup) */}
      <LPADM04Dialog
        dialog={dialog}
        setDialog={setDialog}
        submitForm={submitForm}
        showMessages={showMessages}
        onCreateDataSurveyUser={onCreateDataSurveyUser}
        formObject={formObject}
        setformObject={setformObject}
        checkBox={checkBox}
        setCheckBox={setCheckBox}
      />

      {/* ✅ Delete Dialog */}
      {deleteDialog.open && (
        <DialogDelete
          visible={deleteDialog.open}
          header="ยืนยันการลบข้อมูล"
          modal
          footer={footerButton()}
          onHide={() => setDeleteDialog({ open: false, data: null })}
          textContent="คุณต้องการลบข้อมูล ใช่หรือไม่ ?"
        />
      )}
    </div>
  );
}
