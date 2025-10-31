import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

import LPADM04List from "./LPADM04List";
import LPADM04Dialog from "./LPADM04Dialog";

// SERVICE (comment ไว้ก่อนถ้า backend ยังไม่พร้อม)
// import {
//   ADM04GetDataList,
//   ADM04CreateData,
//   ADM04UpdateData,
//   ADM04CancelData,
//   UpdateOrder,
// } from "../../../service/ServiceADM/ServiceADM04";
import PageHeader from "../../../components/PageHeader/PageHeader";
import CustomCard from "../../../components/CustomCard/CustomCard";

export default function LPADM04() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [dialogToken, setDialogToken] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, textConfirm: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
  }, [dialog]);

  // useEffect(() => {
  //   onADM04GetDataList();
  // }, []);

  // const onADM04GetDataList = () => {
  //   setLoading(true);
  //   ADM04GetDataList().then(
  //     (res) => {
  //       setLoading(false);
  //       if (res.status == 200 && res.result != null) {
  //         let temp = [];
  //         let index = 1;
  //         res.result.forEach((element) => {
  //           temp.push({
  //             ...element,
  //             index: index,
  //           });
  //           index++;
  //         });
  //         setDataTable(temp);
  //       }
  //     },
  //     function (err) {
  //       setLoading(false);
  //       if (err.response.data.status == 401) {
  //         alert(
  //           JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
  //         );
  //         window.location.href = "/login";
  //       } else {
  //         alert(JSON.stringify(err.response.data));
  //       }
  //     }
  //   );
  // };

  const validation = (object) => {
    let showerror = false;
    for (const property in object) {
      if (
        object[property] === 0 ||
        object[property] === "" ||
        object[property] === null ||
        object[property] === undefined
      ) {
        if (property !== "remark") showerror = true;
      }
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
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      setLoading(true);
      // call service create
    } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
      setLoading(true);
      // call service update
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
      // call service delete
    };
    return (
      <FooterButtonCenter
        onClickOk={() => onADM03DeleteData()}
        onClickCancle={() => setDeleteDialog({ open: false, textConfirm: "" })}
      />
    );
  };

  const onRowReorder = (e) => {
    setDialog(true);
    // call service update order
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      {/* ✅ UI หลัก */}
      <CustomCard
        title={<PageHeader config={{ title: "แบบสำรวจความพึงพอใจ" }} />}
        body={
          <LPADM04List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onRowReorder={onRowReorder}
          />
        }
      />

      {/* ✅ Dialog ฟอร์ม */}
      <LPADM04Dialog
        dialog={dialog}
        setDialog={setDialog}
        submitForm={(e) => submitForm(e)}
        submitted={submitted}
        showMessages={showMessages}
        setLoading={setLoading}
      />

      {/* ✅ Dialog ลบ */}
      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog({ open: false, textConfirm: "" })}
        textContent={deleteDialog.textConfirm}
      />
    </div>
  );
}
