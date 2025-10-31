import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";

//PAGE
import DBT07Search from "./DBT07Search";
import DBT07List from "./DBT07List";
import DBT07Dialog from "./DBT07Dialog";

//SERVICE
import {
  DBT07GetDataList,
  DBT07SetRecordStatus,
  DBT07CreateData,
  DBT07UpdateData,
  DBT07UpdateNextRunTime,
  DBT07CancelData,
} from "../../../service/ServiceDBT/ServiceDBT07";
import { DBT02GetDataList } from "../../../service/ServiceDBT/ServiceDBT02";
import { masterService } from "../../../service/ServiceMaster/MasterService";

// CSS
import "../../index.css";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

var dateFormat = require("dateformat");

export default function DBT07() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  //DDL
  const [optionSource, setOptionSource] = useState([]);
  const [optionPattern, setOptionPattern] = useState([]);
  const [searchData, setSearchData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    tb_mm_transfer_job_seq: 0,
  });

  useEffect(() => {
    onDBT07GetDataList();

    masterService("GetLandDataSource/1/1", {}, "GET").then(
      (res) => {
        setOptionSource(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );

    onGetPattren();
  }, []);

  const onDBT07GetDataList = () => {
    setLoading(true);
    DBT07GetDataList(searchData).then(
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
          console.error(err);

          // alert(JSON.stringify(err.response.data));
        }
        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );
  };

  const onGetPattren = (data) => {
    setLoading(true);
    DBT02GetDataList({
      source_schema: "-1",
      source_seq: null,
      transfer_data_group_seq: 0,
    }).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              index: index,
              // value: element.transfer_data_seq.toString(),
              // label: ("Schema ต้นทาง:" + element.source_process + "  |") + ("ตารางต้นทาง:" + element.source_table + " | ") + ("แหล่งข้อมูลปลายทาง:" + element.target_process + " | ") + ("Schema ปลายทาง:" + element.target_schema + " | ") + ("ตารางปลายทาง:" + element.target_table)
            });
            index++;
          });
          setOptionPattern(temp);
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

  const validation = (object) => {
    let showerror = false;
    for (const property in object) {
      if (
        property == "job_detail" ||
        property == "schedule_mode" ||
        property == "schedule_type" ||
        property == "next_run_time"
      ) {
        if (
          object[property] === null ||
          object[property] === undefined ||
          object[property] === "" ||
          object[property] === "0"
        ) {
          showerror = true;
        }
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

  const submitForm = (submitForm, dataSelect) => {
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      setLoading(true);
      DBT07CreateData(submitForm, dataSelect).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              "บันทึกตารางเวลา (Schedule) การถ่ายโอนข้อมูล"
            );
            setDataTable(res.result);
            onDBT07GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.message}`
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
      DBT07UpdateData(submitForm, dataSelect).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              "แก้ไขตารางเวลา (Schedule) การถ่ายโอนข้อมูล"
            );
            setDataTable(res.result);
            onDBT07GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.message}`
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

  const onStatusChange = (rowData, isChecked) => {
    setLoading(true);
    DBT07SetRecordStatus({
      transfer_job_seq: rowData.transfer_job_seq,
      record_status: isChecked === true ? "N" : "C",
    }).then(
      (res) => {
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            isChecked === true ? "เปิด การใช้งาน" : "ปิด การใช้งาน"
          );
          onDBT07GetDataList();
          setDeleteDialog(false);
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

  const onUpdateNextTime = (rowData) => {
    if (rowData.next_run_time === null || rowData.next_run_time === "") {
      setSubmitted(true);
    } else {
      setLoading(true);
      DBT07UpdateNextRunTime({
        transfer_job_seq: rowData.transfer_job_seq,
        next_run_time: dateFormat(
          new Date(rowData.next_run_time),
          "yyyy-mm-dd'T'HH:MM:ss"
        ),
      }).then(
        (res) => {
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไข Next Run Time");
            onDBT07GetDataList();
            setDialog(false);
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
              title: "กำหนดตารางเวลา (Schedule) การถ่ายโอนข้อมูล",
            }}
          />
        }
        body={
          <DBT07Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onDBT07GetDataList()}
          />
        }
      />

      <CustomCard>
        <DBT07List
          dataTable={dataTable}
          setDialog={setDialog}
          setDeleteDialog={setDeleteDialog}
          onStatusChange={onStatusChange}
        />
      </CustomCard>

      {dialog && (
        <DBT07Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={submitForm}
          submitted={submitted}
          setSubmitted={setSubmitted}
          optionSource={optionSource}
          optionPattern={optionPattern}
          onGetPattren={onGetPattren}
          setLoading={setLoading}
          showMessages={showMessages}
          onUpdateNextTime={onUpdateNextTime}
        />
      )}
    </div>
  );
}
