import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";
import { DialogConfirm } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";

//PAGE
import DMS04List from "./DMS04List";

//SERVICE
import {
  DMS04GetDataList,
  DMS04RunProcess,
  DBT04RunProcess,
} from "../../../service/ServiceDMS/ServiceDMS04";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function DMS04() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [getAllDialog, setGetAllDialog] = useState(false);

  useEffect(() => {
    onDMS04GetDataList();
  }, []);

  const onDMS04GetDataList = () => {
    setLoading(true);
    DMS04GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
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
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.message
          );
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
          alert(JSON.stringify(err.response.data));
        }
        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );
  };

  const onRunProcessClick = (value, schedule_mode) => {
    setLoading(true);
    DBT04RunProcess(value.source_seq, schedule_mode).then(
      (res) => {
        if (res.result === true) {
          showMessages("success", `สำเร็จ`, "ดึงข้อมูล");
          onDMS04GetDataList();
          setGetAllDialog({ open: false });
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

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const footerButtonGetAll = () => {
    return (
      <FooterButtonCenter
        onClickOk={() =>
          onRunProcessClick(getAllDialog.data, getAllDialog.schedule_mode)
        }
        onClickCancle={() => setGetAllDialog({ open: false })}
      />
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
              title: "ดึงข้อมูลจากแหล่งข้อมูล",
            }}
          />
        }
        body={
          <DMS04List
            dataTable={dataTable}
            onRunProcessClick={(a, b) => onRunProcessClick(a, b)}
            onGetAllClick={(rowData, schedule_mode) => {
              setGetAllDialog({
                open: true,
                data: rowData,
                schedule_mode: schedule_mode,
              });
            }}
          />
        }
      />

      <DialogConfirm
        visible={getAllDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButtonGetAll()}
        onHide={() => setGetAllDialog({ open: false })}
        textContent={
          getAllDialog.schedule_mode === 1
            ? `ยืนยันการดึงข้อมูลทั้งหมด`
            : getAllDialog.schedule_mode === 2
            ? `ยืนยันการดึงข้อมูลเปลี่ยนแปลง`
            : ""
        }
        checkTextConTent={true}
      />
    </div>
  );
}
