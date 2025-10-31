import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { formatDateTH } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";

//PAGE
// import ADM02Search from './ADM02Search';
import ADM02List from "./ADM02List";
import ADM02Dialog from "./ADM02Dialog";

//SERVICE
import ADM02Services from "../../../service/ServiceADM/ServiceADM02";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateHead,
  generatePdf,
  generatePdfOpenNewTab,
  styles,
  generateTableADM2,
} from "../../../utils/PDFMakeUtil";

import { getTextMenu } from "../../../utils/MenuUtil";

//EXCEL
import { URL_API_EXPORT } from "../../../service/Config";

var dateFormat = require("dateformat");

export default function ADM02() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [dialogToken, setDialogToken] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registerType, setRegisterType] = useState([]);
  const [dialogPDF, setDialogPDF] = useState(false);

  useEffect(() => {
    setSubmitted(false);
  }, [dialog]);

  useEffect(() => {
    onADM02GetDataList();

    // ประเภทผู้ใช้งาน
    masterService("GetRegisterType?mode=1", {}, "GET").then(
      (res) => {
        setRegisterType(res.result);
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
  }, []);

  const onADM02GetDataList = () => {
    setLoading(true);
    ADM02Services.GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status == 200 && res.result != null) {
          setDataTable(res.result);
        }
        // if (res.status === 200) {
        //     let temp = [];
        //     let index = 1;
        //     res.result.forEach(element => {
        //         temp.push({
        //             ...element,
        //             index: index
        //         })
        //         index++;
        //     });
        //     setDataTable(temp);
        // } else {
        //     showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, res.errors.message);
        // }
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

  const validation = (object) => {
    // console.log('object', object)
    let showerror = false;
    if (
      object.department_name_th === "" ||
      object.department_name_en === "" ||
      object.record_status === null ||
      object.department_name_th === 0
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
      ADM02Services.CreateData({
        ...submitForm,
        department_name_th: submitForm.department_name_th,
        department_name_en: submitForm.department_name_en,
        // "register_type_seq": "-1",
        record_status: submitForm.record_status,
        remark: submitForm.remark,
      }).then(
        (res) => {
          setLoading(false);
          showMessages("success", `สำเร็จ`, "บันทึกข้อมูลหน่วยงาน");
          // setDataTable(res.result);
          onADM02GetDataList();
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
      setLoading(true);
      ADM02Services.UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          showMessages("success", `สำเร็จ`, "แก้ไขข้อมูลหน่วยงาน");
          // setDataTable(res.result);
          onADM02GetDataList();
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
      life: 8000,
    });
  };

  const footerButton = () => {
    const onADM03DeleteData = () => {
      ADM02Services.CancelData({
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
          onADM02GetDataList();
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
    ADM02Services.UpdateUpOrDownData(e.value).then(
      (res) => {
        setLoading(false);
        showMessages("success", `สำเร็จ`, "บันทึกจัดเรียง");
        onADM02GetDataList();
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

  const onCreatePDFClick = async () => {
    if (dataTable.length > 0) {
      var content = {
        pageOrientation: "landscape",
        pageSize: "A4",
        content: [generateTableADM2(dataTable)],
      };
      generatePdfOpenNewTab(true, content, (dataUrl) => {
        // this.setState({ pdfURL: dataUrl, viewPDF: true });
        // setDialogPDF({ open: true, pdfURL: dataUrl })
        setLoading(false);
      });
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const onExportExcelClick = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;
    dataTable.forEach((element) => {
      let record_status =
        element.record_status === "N" ? "ใช้งาน" : "ไม่ใช้งาน";
      _exportData.push({
        index: index,
        department_name_th: element.department_name_th,
        department_name_en: element.department_name_en,
        remark: element.remark,
        record_status: record_status,
      });
      index++;
    });

    let fileName = `ADM02-${new Date().getTime().toString()}.xlsx`;
    let txtHead = "รายงานข้อมูลหน่วยงาน";
    // let txtDate = "ออกรายงานวันที่ " + formatDateTH(new Date);
    let json_data = {
      nameTemplate: "ADM02",
      namefileExport: fileName,
      sumCell: [false],
      footerCell: [false],
      list: [
        {
          headCell: ["A", 1, txtHead],
          dateCell: false,
          bodyCell: ["A", 4],
          sheetName: "รายงาน",
          data: _exportData,
        },
      ],
    };
    await masterGenSpreadsheet("spreadsheet", json_data).then((response) => {
      setLoading(false);
      let url = "";
      if (window.location.hostname.indexOf("localhost") !== -1) {
        url = `http://localhost:30004/export/downloadfile?filename=${fileName}`;
      } else {
        url = URL_API_EXPORT(`export/downloadfile?filename=${fileName}`);
      }
      fetch(url).then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
        });
      });
    });
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        <Toast ref={toast} position="top-right" />
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 className="p-m-0">{getTextMenu()}</h1>
            <div>
              <Button
                style={{ height: "35px", color: "green" }}
                label="ส่งออก Excel"
                icon="pi pi-file-excel"
                onClick={() => onExportExcelClick()}
                className="p-button-info p-button-rounded p-button-outlined"
                tooltip="คลิกเพื่อ ส่งออก Excel"
                tooltipOptions={{ position: "top" }}
              />
              <Button
                style={{ height: "35px", marginLeft: "5px" }}
                label="ส่งออก PDF"
                icon="pi pi-file-pdf"
                onClick={() => onCreatePDFClick()}
                className="p-button-danger p-button-rounded p-button-outlined"
                tooltip="คลิกเพื่อ ส่งออก PDF"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
          <ADM02List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onRowReorder={(e) => onRowReorder(e)}
            returnStatus={returnStatus}
          />
          {dialog && (
            <ADM02Dialog
              dialog={dialog}
              setDialog={setDialog}
              submitForm={(e) => submitForm(e)}
              submitted={submitted}
              returnStatus={returnStatus}
              showMessages={showMessages}
              registerType={registerType}
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
        textContent={deleteDialog.textConfirm}
      />

      {dialogPDF && (
        <Dialog
          header="PDF"
          visible={dialogPDF.open}
          blockScroll={true}
          maximized={true}
          onHide={() => setDialogPDF({ open: false, pdfURL: null })}
        >
          <div className="confirmation-content" style={{ paddingTop: "0em" }}>
            <Iframe
              url={dialogPDF.pdfURL}
              width="100%"
              height={window.innerHeight - 110}
              display="initial"
              position="relative"
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
