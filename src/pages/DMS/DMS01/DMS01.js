import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import DMS01List from "./DMS01List";
import DMS01Dialog from "./DMS01Dialog";

//SERVICE
import {
  DMS01GetDataList,
  DMS01CreateData,
  DMS01UpdateData,
  DMS01CancelData,
  DMS01UpdateStatus,
  DMS01CheckConnectionDatabase,
} from "../../../service/ServiceDMS/ServiceDMS01";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
// import { masterService } from '../../../service/ServiceMaster/MasterService';

export default function DMS01() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [connectionDB, setConnectionDB] = useState(false);
  // MASTER
  const [system, setSystem] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  const optionSource = [
    { label: "-กรุณาเลือก-", value: "-1" },
    { label: "SOURCE", value: "1" },
    // { label: 'PROCESS', value: '2' },
    { label: "TARGET", value: "3" },
  ];

  const optionDataBase = [
    { label: "Oracle", value: "Oracle" },
    { label: "PostgreSQL", value: "PostgreSQL" },
  ];

  const onDMS01GetDataList = () => {
    setLoading(true);
    DMS01GetDataList().then(
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
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    onDMS01GetDataList();
  }, []);

  const validation = (object) => {
    let showerror = false;
    for (const property in object) {
      if (
        object[property] === null ||
        object[property] === undefined ||
        object[property] === ""
      ) {
        showerror = true;
      } else if (object["transfer_process"] === null) {
        setSubmitted(false);
        return true;
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
    if (dialog.action === "SAVE" && validation(submitForm)) {
      setLoading(true);
      DMS01CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "บันทึกแหล่งข้อมูลการถ่ายโอน");
            setDataTable(res.result);
            onDMS01GetDataList();
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
    } else if (dialog.action === "UPDATE" && validation(submitForm)) {
      setLoading(true);
      DMS01UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขแหล่งข้อมูลการถ่ายโอน");
            setDataTable(res.result);
            onDMS01GetDataList();
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
      DMS01CancelData(deleteDialog.data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ยกเลิกข้อมูลสำเร็จ");
            onDMS01GetDataList();
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

  const onStatusChange = (rowData, isChecked) => {
    setLoading(true);
    DMS01UpdateStatus({
      source_seq: rowData.source_seq,
      record_status: isChecked === true ? "N" : "C",
    }).then(
      (res) => {
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            isChecked === true ? "เปิด การใช้งาน" : "ปิด การใช้งาน"
          );
          onDMS01GetDataList();
          // setDeleteDialog(false);
        }
        setLoading(false);
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

  const onCheckConnectionDB = (rowData, isChecked) => {
    if (
      rowData.source_host === "" ||
      rowData.source_service_name === "" ||
      rowData.user_name === "" ||
      rowData.password === "" ||
      rowData.source_port === ""
    ) {
      showMessages("warn", `ตรวจสอบการเชื่อมต่อ`, `กรุณาระบุข้อมูลให้ถูกต้อง`);
    } else {
      setLoading(true);
      DMS01CheckConnectionDatabase({
        host: rowData.source_host,
        database_type: rowData.database_type,
        service_name: rowData.source_service_name,
        user_name: rowData.user_name,
        password: rowData.password,
        port: rowData.source_port.toString(),
      }).then(
        (res) => {
          if (res.status === 200) {
            showMessages("success", `ตรวจสอบการเชื่อมต่อ`, res.result);
            setConnectionDB(true);
          } else {
            showMessages("warn", `ตรวจสอบการเชื่อมต่อ`, res.result);
            setConnectionDB(false);
          }
          setLoading(false);
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

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "กำหนดแหล่งข้อมูลการถ่ายโอน",
            }}
          />
        }
        body={
          <DMS01List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onStatusChange={onStatusChange}
          />
        }
      />

      {dialog && (
        <DMS01Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={(e) => submitForm(e)}
          system={system}
          submitted={submitted}
          setSubmitted={setSubmitted}
          onCheckConnectionDB={onCheckConnectionDB}
          optionSource={optionSource}
          optionDataBase={optionDataBase}
          connectionDB={connectionDB}
          setConnectionDB={setConnectionDB}
        />
      )}

      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        className="modern-dialog"
      >
        <p>คุณต้องการยกเลิกข้อมูลนี้หรือไม่?</p>
      </DialogDelete>
    </div>
  );
}
