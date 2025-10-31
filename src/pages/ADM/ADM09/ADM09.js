import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import {
  DialogConfirm,
  DialogDelete,
} from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import ADM09Search from "./ADM09Search";
import ADM09List from "./ADM09List";
import ADM09Dialog from "./ADM09Dialog";

//SERVICE
import {
  getConsumer,
  verifyIdentityLandofficeAD,
  addRegisterService,
  getRegisterService,
  updateConsumer,
  generateKey,
  ADM09GetDataList,
  ADM09CreateData,
  ADM09UpdateData,
  ADM09DeleteData,
  ADM09VerifyIdentityAD,
  ADM09ResetPassword,
} from "../../../service/ServiceADM/ServiceADM09";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generatePdfOpenNewTab,
  generateTableADM09,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import {
  strToArrBuffer,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";
import { URL_API_EXPORT } from "../../../service/Config";

var dateFormat = require("dateformat");
var d = new Date();
d.setFullYear(2564);

export default function ADM09() {
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const toast = useRef(null);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [consumerPopup, setConsumerPopup] = useState(false);
  const [First, setFirst] = useState(0);
  const [Rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // SEARCH
  const [searchData, setSearchData] = useState({
    person_fullname: "",
    register_type_seq: "-1",
    create_dtm_from: new Date(),
    create_dtm_to: new Date(),
    province_seq: "-1",
    totalRecords: 0,
    pageofnum: 0,
    rowofpage: 10000,
  });

  // MASTER
  const [provinceList, setProvinceList] = useState([]);
  const [registerTypeSearch, setRegisterTypeSearch] = useState([]);

  //PDF
  const [dialogPDF, setDialogPDF] = useState(false);

  // AD
  const [formAD, setFormAD] = useState({
    username: "",
    password: "",
  });
  const [adflag, setAdflag] = useState(false);

  const [isCheckCardId, setIsCheckCardId] = useState(null);
  const [isCheckEmail, setIsCheckEmail] = useState(null);
  const [optionProvince, setOptionProvince] = useState([]);

  useEffect(() => {
    onADM09GetDataList();
    //  จังหวัด
    masterService(`GetProvince?mode=1`, {}, "GET").then((res) => {
      setOptionProvince(res.result);
    });

    //จังหวัด Search
    masterService(`GetProvince?mode=0`, {}, "GET").then((res) => {
      setProvinceList(res.result);
    });
    // ประเภทผู้ใช้งาน Search
    // masterService("GetRegisterType?mode=0", {}, "GET")
    //     .then(res => {
    //         if (res.status === 200) {
    //             for (let i = 0; i < res.result.length; i++) {
    //                 if (res.result[i].value === '8') {
    //                     res.result.splice(i, 1);
    //                 }
    //             }
    //             setRegisterTypeSearch(res);
    //             setLoading(false);
    //         } else {
    //             showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, `${res.errors.message}`);
    //         }
    //     }, function (err) {
    //         setLoading(false);
    //         showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
    //     });
    // กลุ่มผู้ใช้งาน
    masterService("GetRegisterType?mode=0", {}, "GET").then(
      (res) => {
        setRegisterTypeSearch(res.result);
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

  useEffect(() => {
    setIsCheckCardId(true);
    setIsCheckEmail(true);
  }, [dialog]);

  const onADM09GetDataList = () => {
    setLoading(true);
    setFirst(0);
    setRows(10);
    ADM09GetDataList(searchData).then(
      (res) => {
        if (res.status === 200) {
          //       console.log('onADM09GetDataList',res)
          setDataTable(res.result);
          //     console.log('1234',res.result)
          setDataTableReport(res.result); //รายงาน
          setTotalRecords(res.totalRecords); //จำนวนรายการ
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.errors.message
          );
        }
        setLoading(false);
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

  const verifyIdentityAD = (formCheck) => {
    if (
      formCheck.user_id === undefined ||
      formCheck.user_password === undefined
    ) {
      showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ถูกต้อง");
    } else {
      setLoading(true);
      verifyIdentityLandofficeAD(formCheck).then(
        (res) => {
          if (res.result) {
            setFormAD({ ...formAD, result: res.result });
            showMessages("success", ``, "ผ่านการตรวจสอบ");
          } else {
            showMessages("warn", ``, res.errors.message);
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

  const onGetConsumerClick = (rowData) => {
    setLoading(true);
    getConsumer(rowData.register_seq).then(
      (res) => {
        if (res.status === 200) {
          if (res.result.length > 0) {
            let arr = res.result[res.result.length - 1];
            setDialog({
              consumerOpen: true,
              data: {
                ...rowData,
                register_seq: rowData.register_seq,
                consumerkey: arr.consumeR_KEY,
                consumersecret: arr.consumeR_SECRET,
                expire_token: arr.expirE_TOKEN,
              },
            });
          } else {
            setDialog({
              consumerOpen: true,
              data: {
                ...rowData,
                register_seq: rowData.register_seq,
              },
            });
          }
        } else {
          showMessages("warn", ``, res.errors.message);
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

  const validation = (data, action) => {
    if (
      (data.register_ad_flag === "0" && action === "เพิ่ม") ||
      (data.register_ad_flag === "0" && action === "แก้ไข")
    ) {
      if (
        data.register_type_seq !== undefined &&
        data.register_type_seq !== "" &&
        data.register_type_seq !== "-1" &&
        data.person_firstnameth !== undefined &&
        data.person_firstnameth !== "" &&
        data.person_lastnameth !== undefined &&
        data.person_lastnameth !== "" &&
        data.person_birthdate !== undefined &&
        data.person_birthdate !== "" &&
        data.person_id !== undefined &&
        data.person_id !== "" &&
        data.person_email !== undefined &&
        data.person_email !== "" &&
        data.person_phone !== undefined &&
        data.person_phone !== ""
        // && data.user_password !== undefined
        // && data.user_password !== ''
        // && data.user_password2 !== undefined
        // && data.user_password2 !== ''
      ) {
        if (data.user_password !== data.user_password2) {
          setLoading(false);
          showMessages("warn", `แจ้งเตือน`, "รหัสผ่านไม่ตรงกัน");
          return false;
        } else {
          return true;
        }
      } else {
        setLoading(false);
        setSubmitted(true);
        return false;
      }
    } else if (data.register_ad_flag === "1" || action === "แก้ไข") {
      if (
        data.register_type_seq !== undefined ||
        data.register_type_seq !== "" ||
        data.register_type_seq !== "0" ||
        data.person_firstnameth !== undefined ||
        data.person_firstnameth !== "" ||
        data.person_lastnameth !== undefined ||
        data.person_lastnameth !== "" ||
        data.person_birthdate !== undefined ||
        data.person_birthdate !== "" ||
        data.person_id !== undefined ||
        data.person_id !== "" ||
        data.person_email !== undefined ||
        data.person_email !== "" ||
        data.person_phone !== undefined ||
        data.person_phone !== ""
      ) {
        return true;
      } else {
        setLoading(false);
        setSubmitted(true);
        return false;
      }
    }
  };

  const submitForm = (submitForm) => {
    if (dialog.action === "เพิ่ม") {
      if (
        validation(submitForm, dialog.action) &&
        isCheckCardId &&
        isCheckEmail
      ) {
        setLoading(true);
        ADM09CreateData(submitForm).then(
          (res) => {
            setLoading(false);
            if (res.status === 200) {
              showMessages("success", `สำเร็จ`, "บันทึกจัดการสิทธิผู้ใช้งาน");
              onADM09GetDataList(searchData);
              setDialog(false);
              setSubmitted(false);
            } else if (res.status === 200 && res.error === true) {
              showMessages("error", `เกิดข้อผิดพลาด`, `${res.errors.message}`);
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
    } else if (
      dialog.action === "แก้ไข" &&
      validation(submitForm, dialog.action)
    ) {
      setLoading(true);
      ADM09UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200 && res.result) {
            showMessages("success", `สำเร็จ`, "แก้ไขจัดการสิทธิผู้ใช้งาน");
            onADM09GetDataList(searchData);
            setDialog(false);
            setSubmitted(false);
          } else if (res.status === 200 && !res.result) {
            showMessages("error", `เกิดข้อผิดพลาด`, `${res.errors.message}`);
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

  //delete
  const footerButton = () => {
    const onADM09DeleteData = () => {
      ADM09DeleteData(deleteDialog.data.register_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ลบข้อมูลสำเร็จ");
            onADM09GetDataList(searchData);
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
        onClickOk={() => onADM09DeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  const footerButtonReset = () => {
    const ADM09ResetPasswordclick = () => {
      ADM09ResetPassword(resetDialog.data.register_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "รีเซตรหัสผ่านข้อมูลสำเร็จ");
            onADM09GetDataList(searchData);
            setResetDialog(false);
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
        onClickOk={() => ADM09ResetPasswordclick()}
        onClickCancle={() => setResetDialog(false)}
      />
    );
  };

  const footerButtonConsumer = () => {
    return (
      <FooterButtonCenter
        onClickOk={() =>
          onGenerateKeyClick(consumerPopup._ACTION, consumerPopup.formObject)
        }
        onClickCancle={() => setConsumerPopup(false)}
      />
    );
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 10000,
    });
  };

  const personalFormat = (person_id) => {
    if (person_id === null || person_id === undefined) return "-";
    let str = person_id.toString();
    if (str.length < 13) return "-";
    // return (str.substring(0, 1) + "-" + str.substring(1, 5) + "-" + str.substring(5, 10) + "-" + str.substring(10, 12) + "-" + str.substring(12))
    return (
      str.substring(0, 1) +
      "-" +
      str.substring(1, 5) +
      "-" +
      str.substring(5, 10) +
      "-" +
      "**" +
      "-" +
      "*"
    );
  };

  const onCreatePDFClick = async () => {
    // setLoading(true)
    let data = dataTableReport;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        _arr.push([
          {
            text: data[i].row_num,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].create_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].person_fullname,
            style: { fontSize: 12 },
          },
          {
            text: personalFormat(data[i].person_id),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].user_id,
            style: { fontSize: 12 },
          },
          {
            text: data[i].landoffice_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].register_type_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].record_status === "N" ? "ใช้งาน" : "ยกเลิก",
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }
      var content = {
        pageSize: "A4",
        pageOrientation: "landscape",
        content: [generateTableADM09(searchData, _arr)],
        pageMargins: [20, 20, 20, 40],
      };
      generatePdfOpenNewTab(true, content, (dataUrl) => {
        // this.setState({ pdfURL: dataUrl, viewPDF: true });
        // setDialogPDF({ open: true, pdfURL: dataUrl })
        // setLoading(false)
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
    if (dataTableReport.length === 0) {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    } else {
      dataTableReport.forEach((element) => {
        let record_status =
          element.record_status === "N" ? "ใช้งาน" : "ไม่ใช้งาน";
        _exportData.push({
          index: index,
          create_dtm: formatDateTH(element.create_dtm, true),
          person_fullname: element.person_fullname,
          person_id: personalFormat(element.person_id),
          user_id: element.user_id,
          landoffice_name: element.landoffice_name,
          register_type_name: element.register_type_name,
          record_status: record_status,
        });
        index++;
      });

      let fileName = `ADM09-${new Date().getTime().toString()}.xlsx`;
      let txtHead =
        "รายงานจัดการสิทธิผู้ใช้งานระบบ" +
        "\n" +
        formatDateTH_full2(searchData.create_dtm_from, false) +
        " ถึง " +
        formatDateTH_full2(searchData.create_dtm_to, false);
      let json_data = {
        nameTemplate: "ADM09",
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

      await masterGenSpreadsheet("spreadsheet", json_data).then((res) => {
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
    }
  };

  // Generate Key
  const onGenerateKeyClick = (_ACTION, formObject) => {
    setLoading(true);
    generateKey(_ACTION).then(
      (res) => {
        if (res.status === 200) {
          if (_ACTION === "Consumer Key") {
            setDialog({
              ...dialog,
              data: {
                ...formObject,
                consumerkey: res.result,
              },
            });
          } else {
            setDialog({
              ...dialog,
              data: {
                ...formObject,
                consumersecret: res.result,
              },
            });
          }
          setConsumerPopup(false);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.errors.message
          );
        }
        setLoading(false);
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

  const onUpdateConsumerClick = (submitForm) => {
    if (
      submitForm.consumerkey === "" ||
      submitForm.consumersecret === "" ||
      submitForm.expire_token === 0 ||
      submitForm.expire_token === ""
    ) {
      setSubmitted(true);
      showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ครบถ้วน");
      return;
    }
    setLoading(true);
    updateConsumer({
      register_seq: submitForm.register_seq,
      consumerkey: submitForm.consumerkey,
      consumersecret: submitForm.consumersecret,
      expire_token: parseInt(submitForm.expire_token),
    }).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          showMessages("success", `สำเร็จ`, "บันทึกกำหนด Consumer");
          onADM09GetDataList(searchData);
          setDialog(false);
          setSubmitted(false);
        } else if (res.status === 200 && res.error === true) {
          showMessages("error", `เกิดข้อผิดพลาด`, `${res.errors.message}`);
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
  };

  const onGetRegisterServiceClick = (rowData) => {
    setLoading(true);
    getRegisterService(rowData.register_seq).then(
      (res) => {
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
          setDialog({
            ...dialog,
            serviceOpen: true,
            tableData: temp,
            data: rowData,
          });
          // setDialog({ serviceOpen: true, data: rowData })
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.errors.message
          );
        }
        setLoading(false);
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

  const onAddRegisterServiceClick = (selectedTable) => {
    let temp = [];
    selectedTable.forEach((element) => {
      temp.push(element.service_seq);
    });
    addRegisterService({
      register_seq: dialog.data.register_seq,
      service_list: temp,
    }).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          showMessages("success", `สำเร็จ`, "บันทึกกำหนด Servie");
          onADM09GetDataList(searchData);
          setDialog(false);
          setSubmitted(false);
        } else if (res.status === 200 && res.error === true) {
          showMessages("error", `เกิดข้อผิดพลาด`, `${res.errors.message}`);
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
  };

  //Nextpage
  const onPageChange = (e) => {
    setLoading(true);
    setFirst(e.first);
    setRows(e.rows);

    let search_data = {
      ...searchData,
      pageofnum: e.first,
      rowofpage: e.rows,
      totalRecords: totalRecords,
    };

    ADM09GetDataList(search_data).then(
      (res) => {
        if (res.status === 200) {
          setDataTable(res.result);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
        setLoading(false);
      },
      function (err) {
        setLoading(false);
        showMessages("error", `เกิดข้อผิดพลาด`, err.message);
      }
    );
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        {/* <Toast ref={(el) => toast = el} /> */}
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
                tooltip={
                  "คลิกเพื่อ ส่งออก Excel" +
                  "\n" +
                  "(ข้อมูลไม่เกิน 10,000 รายการ)"
                }
                tooltipOptions={{ position: "top" }}
              />
              <Button
                style={{ height: "35px", marginLeft: "5px" }}
                label="ส่งออก PDF"
                icon="pi pi-file-pdf"
                onClick={() => onCreatePDFClick()}
                className="p-button-danger p-button-rounded p-button-outlined"
                tooltip={
                  "คลิกเพื่อ ส่งออก PDF" +
                  "\n" +
                  "(ข้อมูลไม่เกิน 10,000 รายการ)"
                }
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
          <ADM09Search
            // landOffice={landOffice}
            registerType={registerTypeSearch}
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onADM09GetDataList()}
            provinceList={provinceList}
          />
          <ADM09List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            isCheckCardId={isCheckCardId}
            setIsCheckCardId={setIsCheckCardId}
            setResetDialog={setResetDialog}
            onGetRegisterServiceClick={onGetRegisterServiceClick}
            onGetConsumerClick={onGetConsumerClick}
            adflag={adflag}
            setAdflag={setAdflag}
            onPageChange={(e) => onPageChange(e)}
            First={First}
            Rows={Rows}
            totalRecords={totalRecords}
          />

          {/* {dialog.dialog && */}
          <ADM09Dialog
            dialog={dialog}
            // registerType={registerType}
            // province={province}
            setDialog={setDialog}
            submitForm={(e) => submitForm(e)}
            submitted={submitted}
            setSubmitted={setSubmitted}
            verifyIdentityAD={(e) => verifyIdentityAD(e)}
            formAD={formAD}
            setFormAD={setFormAD}
            showMessages={(a, b, c) => showMessages(a, b, c)}
            isCheckCardId={isCheckCardId}
            setIsCheckCardId={setIsCheckCardId}
            isCheckEmail={isCheckEmail}
            setIsCheckEmail={setIsCheckEmail}
            onGenerateKeyClick={onGenerateKeyClick}
            onUpdateConsumerClick={onUpdateConsumerClick}
            onAddRegisterServiceClick={onAddRegisterServiceClick}
            optionProvince={optionProvince}
            setConsumerPopup={setConsumerPopup}
            adflag={adflag}
            setAdflag={setAdflag}
          />
          {/* } */}
        </div>
        {deleteDialog.open && (
          <DialogDelete
            visible={deleteDialog.open}
            header="การยืนยัน"
            modal
            footer={footerButton()}
            onHide={() => setDeleteDialog(false)}
            textContent={`คุณต้องการลบข้อมูล "${deleteDialog.data.person_fullname}" ใช่หรือไม่ ?`}
          />
        )}

        {resetDialog.open && (
          <DialogConfirm
            visible={resetDialog.open}
            header="การยืนยัน"
            modal
            footer={footerButtonReset()}
            onHide={() => setResetDialog(false)}
            textContent={`คุณต้องการรีเซตรหัสผ่าน "${resetDialog.data.person_fullname}" ใช่หรือไม่ ?`}
          />
        )}

        <DialogConfirm
          visible={consumerPopup.open}
          header="การยืนยัน"
          modal
          footer={footerButtonConsumer()}
          onHide={() => setConsumerPopup(false)}
          textContent={`คุณต้องการ Generate Key "${consumerPopup._ACTION}" ใหม่`}
          checkTextConTent={true}
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
      </div>
    </>
  );
}
