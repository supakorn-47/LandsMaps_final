import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
//PAGE
import ADM08Search from "./ADM08Search";
import ADM08List from "./ADM08List";
import ADM08Dialog from "./ADM08Dialog";
//SERVICE
import {
  ADM08GetDataList,
  ADM08UploadFileData,
  ADM08ApproveUserData,
  ADM08GetFilesList,
  ADM08DeleteRegisterFile,
} from "../../../service/ServiceADM/ServiceADM08";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";
import { getSession } from "../../../utils/Crypto";
//PDF
import {
  generatePdfOpenNewTab,
  generateTableADM08,
} from "../../../utils/PDFMakeUtil";
//EXCEL
import { URL_API_EXPORT } from "../../../service/Config";

export default function ADM08() {
  const toast = useRef(null);
  const [searchData, setSearchData] = useState({
    create_dtm_from: new Date(),
    create_dtm_to: new Date(),
    approve_flag: 3,
    register_type_seq: "-1",
  });
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [registerFileList, setRegisterFileList] = useState([]);
  const [registerType, setRegisterType] = useState([]);
  //PDF
  const [dialogPDF, setDialogPDF] = useState(false);

  useEffect(() => {
    let _register_type_seq = "-1";
    if (getSession("login").result.register_type_seq === 6) {
      _register_type_seq = "4";
    }
    let _body = {
      ...searchData,
      register_type_seq: _register_type_seq,
    };

    onADM08GetDataList(_body);
    onGetRegisterType();
  }, []);

  useEffect(() => {
    setSubmitted(false);
  }, [dialog]);

  const onGetRegisterType = () => {
    if (getSession("login").result.register_type_seq === 6) {
      masterService(
        "GetRegisterType?mode=0&register_type_seq=4%2C5",
        {},
        "GET"
      ).then((res) => {
        let arr = res.result;
        arr.shift();
        setRegisterType(res.result);
        setSearchData({
          ...searchData,
          register_type_seq: "4",
        });
      });
    } else {
      masterService(`GetRegisterType?mode=0`, {}, "GET").then((res) => {
        setRegisterType(res.result);
      });
    }
  };

  const onADM08GetDataList = (_body = searchData) => {
    setLoading(true);
    ADM08GetDataList(_body).then(
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
          setDataTableReport(res.result); //รายงาน
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
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

  const onADM08GetFilesList = (rowData) => {
    setLoading(true);
    ADM08GetFilesList(rowData.register_seq).then(
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
          setDialog({ openListUpload: true, data: rowData });
          // setRegisterFileList(temp);
          setRegisterFileList(temp);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
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

  const validation = (object) => {
    if (object.approve_flag === 1 || object.approve_flag === "1") {
      setSubmitted(false);
      return true;
    }
    if (!object.remark || object.remark === " " || object.remark === "") {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const submitForm = (submitForm, _EVENT = "") => {
    if (_EVENT === "ADD_FILE") {
      setLoading(true);
      ADM08UploadFileData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              submitForm.typeUpload === "add" ? "บันทึกไฟล์แนบ" : "แก้ไขไฟล์แนบ"
            );
            setRegisterFileList(res.result);
            onADM08GetFilesList(submitForm);
            setUploadDialog(false);
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
    } else if (dialog.openApprove == true && validation(submitForm)) {
      setLoading(true);
      ADM08ApproveUserData(submitForm, dialog.register_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขอนุมัติผู้ใช้งาน");
            // setDataTable(res.result);
            onADM08GetDataList(searchData);
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

  const footerButton = () => {
    const onADM08DeleteData = () => {
      setLoading(true);
      ADM08DeleteRegisterFile(deleteDialog.data.register_file_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ลบไฟล์แนบ");
            // onADM08GetDataList(searchData);
            onADM08GetFilesList(deleteDialog.data);
            setDeleteDialog(false);
            // setRegisterFileList(res.result);
          }
        },
        function (err) {
          setLoading(false);
          showMessages("error", `${err.response.data.message}`, "");
        }
      );
    };
    return (
      <FooterButtonCenter
        onClickOk={() => onADM08DeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
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
            text: i + 1,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].create_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].register_type_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].province_name === null ? "-" : data[i].province_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].landoffice_name,
            style: { fontSize: 12 },
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
            text: data[i].person_email,
            style: { fontSize: 12 },
          },
          {
            text: data[i].person_phone,
            style: { fontSize: 12 },
          },
          {
            text:
              data[i].register_objective === " "
                ? "-"
                : data[i].register_objective,
            style: { fontSize: 12 },
          },
          {
            text:
              data[i].approve_flag === 0
                ? "ไม่อนุมัติ"
                : data[i].approve_flag === 1
                ? "อนุมัติ"
                : "รออนุมัติ",
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }
      var content = {
        pageSize: "A4",
        pageOrientation: "landscape",
        content: [generateTableADM08(searchData, _arr)],
        pageMargins: [20, 20, 20, 40],
      };
      generatePdfOpenNewTab(true, content, (dataUrl) => {});
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
        let approve =
          element.approve_flag === 0
            ? "ไม่อนุมัติ"
            : element.approve_flag === 1
            ? "อนุมัติ"
            : "รออนุมัติ";
        _exportData.push({
          index: index,
          create_dtm: formatDateTH(element.create_dtm, true),
          register_type_name: element.register_type_name,
          province_name:
            element.province_name === null ? "-" : element.province_name,
          landoffice_name: element.landoffice_name,
          person_fullname: element.person_fullname,
          person_id: personalFormat(element.person_id),
          person_email: element.person_email,
          person_phone: element.person_phone,
          register_objective:
            element.register_objective === " "
              ? "-"
              : element.register_objective,
          approve: approve,
        });
        index++;
      });

      let fileName = `ADM08-${new Date().getTime().toString()}.xlsx`;
      let txtHead =
        "รายงานอนุมัติผู้ใช้งาน" +
        "\n" +
        formatDateTH_full2(searchData.create_dtm_from, false) +
        " ถึง " +
        formatDateTH_full2(searchData.create_dtm_to, false);
      let json_data = {
        nameTemplate: "ADM08",
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
          <ADM08Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onADM08GetDataList()}
            registerType={registerType}
          />
          <ADM08List
            dataTable={dataTable}
            setDialog={setDialog}
            onADM08GetFilesList={(a) => onADM08GetFilesList(a)}
          />
          <ADM08Dialog
            dialog={dialog}
            setDialog={setDialog}
            submitForm={(a, b) => submitForm(a, b)}
            submitted={submitted}
            setDeleteDialog={setDeleteDialog}
            uploadDialog={uploadDialog}
            setUploadDialog={setUploadDialog}
            showMessages={(a, b, c) => showMessages(a, b, c)}
            // file
            registerFileList={registerFileList}
          />
        </div>
        <DialogDelete
          visible={deleteDialog.open}
          header="การยืนยัน"
          modal
          footer={footerButton()}
          onHide={() => setDeleteDialog(false)}
          textContent="คุณต้องการลบข้อมูล ใช่หรือไม่ ?"
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
