import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
// import DEA01Search from './DEA01Search';
import DEA01List from "./DEA01List";
import DEA01Dialog from "./DEA01Dialog";

//SERVICE
import {
  DEA01GetDataList,
  DEA01CreateData,
  DEA01UpdateData,
  DEA01CancelData,
  DEA01GetDepartmentServiceList,
  DEA01AddDepartmentService,
  DEA01GetAccessToken,
  DEA01CreateAccessToken,
  DEA01UpdateAccessToken,
} from "../../../service/ServiceDEA/ServiceDEA01";
// import { masterService } from '../../../service/ServiceMaster/MasterService';
var dateFormat = require("dateformat");

export default function DEA01() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [dialogToken, setDialogToken] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [dataConfig, setDataConfig] = useState([]);
  const [dataToken, setDataToken] = useState([]);

  useEffect(() => {
    setSubmitted(false);
  }, [dialog]);

  useEffect(() => {
    onDEA01GetDataList();
  }, []);

  const onDEA01GetDataList = () => {
    setLoading(true);
    DEA01GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let inDEA = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              inDEA: inDEA,
            });
            inDEA++;
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

          //   alert(JSON.stringify(err.response.data));
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
      object.department_name_th === "" ||
      object.department_name_en === "" ||
      object.department_type === null ||
      object.remark === "" ||
      object.department_type === null
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
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      setLoading(true);
      DEA01CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "บันทึกข้อมูลหน่วยงานแลกเปลี่ยน");
            // setDataTable(res.result);
            onDEA01GetDataList();
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
      DEA01UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขข้อมูลหน่วยงานแลกเปลี่ยน");
            // setDataTable(res.result);
            onDEA01GetDataList();
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
      DEA01CancelData(deleteDialog.data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ยกเลิกข้อมูลสำเร็จ");
            onDEA01GetDataList();
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

  const configService = (data) => {
    setLoading(true);
    DEA01GetDepartmentServiceList(data).then(
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
          setDataConfig(temp);
          setDialog({ dialogConfigService: true, data: data });
        }
      },
      function (err) {
        setLoading(false);
      }
    );
  };

  const submitFormConfigService = (data, list) => {
    let arr_temp = [];

    if (list.length !== 0) {
      list.forEach((element) => {
        arr_temp.push(parseInt(element.service_seq));
      });
    } else {
      arr_temp.push(0);
    }

    DEA01AddDepartmentService({
      department_seq: data.department_seq,
      service_list: arr_temp,
    }).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          showMessages("success", `สำเร็จ`, "บันทึกกำหนด Service");
          onDEA01GetDataList();
          setDialog(false);
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

  //getค่า Token
  const configToken = (data) => {
    setLoading(true);
    DEA01GetAccessToken(data.department_seq).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          setDataToken(res.result);
          setDialog({ dialogConfigToken: true, data: data });
        }
      },
      function (err) {
        setLoading(false);
      }
    );
  };

  //กำหนด Token
  const submitFormConfigToken = (data) => {
    if (dialogToken.action === "บันทึก" && data.token_expires_dtm != null) {
      if (data.token_expires_dtm < new Date()) {
        showMessages("warn", `แจ้งเตือน`, "กรุณาระบุเวลามากกว่าเวลาปัจจุบัน");
      } else {
        setLoading(true);
        DEA01CreateAccessToken({
          department_seq: data.department_seq,
          token_expires_dtm: dateFormat(
            new Date(data.token_expires_dtm),
            "yyyy-mm-dd'T'HH:MM:ss"
          ),
          remark: data.remark,
        }).then(
          (res) => {
            setLoading(false);
            if (res.status === 200) {
              showMessages("success", `สำเร็จ`, "บันทึกกำหนด Token");
              configToken(dialog.data);
              setDialogToken(false);
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
    } else if (dialogToken.action === "แก้ไข") {
      setLoading(true);
      DEA01UpdateAccessToken(data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขกำหนด Token");
            configToken(dialog.data);
            setDialogToken(false);
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

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        <Toast ref={toast} position="top-right" />
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 className="p-m-0">{getTextMenu()}</h1>
            {/* <div style={{ marginTop: -5 }} >
                            <Button onClick={() => onDEA01GetDataList()} icon="pi pi-refresh" className="p-button-rounded p-button-success" tooltip="คลิกเพื่อ Refresh" tooltipOptions={{ position: 'left' }} />
                        </div> */}
          </div>
          <DEA01List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            configService={(e) => configService(e)}
            configToken={(e) => configToken(e)}
            returnStatus={returnStatus}
          />
          {dialog && (
            <DEA01Dialog
              dialog={dialog}
              setDialog={setDialog}
              submitForm={(e) => submitForm(e)}
              submitted={submitted}
              dataConfig={dataConfig}
              dataToken={dataToken}
              dialogToken={dialogToken}
              setDialogToken={setDialogToken}
              submitFormConfigService={submitFormConfigService}
              submitFormConfigToken={submitFormConfigToken}
              returnStatus={returnStatus}
              showMessages={showMessages}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        textContent="คุณต้องการยกเลิกข้อมูล ใช่หรือไม่ ?"
      />
    </>
  );
}
