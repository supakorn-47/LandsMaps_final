import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import ADM12Search from "./ADM12Search";
import ADM12List from "./ADM12List";
import ADM12Dialog from "./ADM12Dialog";

//SERVICE
import {
  getDataList,
  createData,
  updateData,
  deleteData,
  deleteFile,
  getFileList,
  sendMailAPI,
  downloadFile,
} from "../../../service/ServiceADM/ServiceADM12";
import { masterService } from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generatePdfOpenNewTab,
  generateTableADM12,
} from "../../../utils/PDFMakeUtil";
import { monthNamesTH } from "../../../utils/DateUtil";
import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";

var dateFormat = require("dateformat");
var d = new Date();
d.setFullYear(2564);

export default function ADM12() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [loading, setLoading] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteDialogFile, setDeleteDialogFile] = useState(false);
  const [sendMail, setSendMail] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [optionProvince, setOptionProvince] = useState([]);
  const [optionAmphur, setOptionAmphur] = useState([]);
  const [optionOpt, setOptionOpt] = useState([]);

  // SEARCH
  const [searchData, setSearchData] = useState({
    wp_month_from: String(new Date().getMonth() + 1).padStart(2, "0"),
    wp_month_to: String(new Date().getMonth() + 1).padStart(2, "0"),
    wp_year: "" + (new Date().getFullYear() + 543),
    province_seq: "-1",
    opt_seq: "-1",
    amphur_seq: "-1",
  });

  useEffect(() => {
    onGetProvinceMaster();
    onGetDataList();
    sessionStorage.removeItem("searchData");
  }, []);

  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      if (index === 10) {
        onGetDataListLoop();
        index = 0;
      }
      index++;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onGetProvinceMaster = (_VALUE = 0) => {
    masterService(`GetProvince?mode=${_VALUE}`, {}, "GET").then((res) => {
      setOptionProvince(res.result);
    });
  };

  const onGetAmphur = (province_seq, _TYPE = "") => {
    if (_TYPE === "") {
      setSearchData({
        ...searchData,
        province_seq: province_seq,
        amphur_seq: "-1",
      });
    }
    masterService(
      `GetAmphur?mode=1&province_seq=${province_seq}`,
      {},
      "GET"
    ).then((res) => {
      setOptionAmphur(res.result);
    });
  };

  const onGetOpt = (amphur_seq, _TYPE = "", province_seq) => {
    masterService(
      `GetOpt?mode=${_TYPE !== "" ? 1 : 0}&amphur_seq=${amphur_seq}`,
      {},
      "GET"
    ).then((res) => {
      setOptionOpt(res.result);
    });
  };

  const onGetDataList = () => {
    setLoading(true);
    sessionStorage.setItem("searchData", JSON.stringify(searchData)); //เก็บค่าค้นหา Jane 030466
    getDataList(searchData).then(
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
          // setDataTableReport(res.result.sort((a, b) => new Date(a) < new Date(b) ? 1 : -1))
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

  const onGetDataListLoop = () => {
    const searchDataLoop = JSON.parse(sessionStorage.getItem("searchData"));
    getDataList(searchDataLoop === null ? searchData : searchDataLoop).then(
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
          setDataTable(temp);
          // setDataTableReport(res.result.sort((a, b) => new Date(a) < new Date(b) ? 1 : -1))
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
      }
    );
  };

  const onGetFileList = (rowData) => {
    setLoading(true);
    getFileList(rowData.wp_seq).then(
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
          setFileList(temp);
          setDialog({ dialog: true, action: "แก้ไข", data: rowData });
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

  const onDownloadFile = (wp_seq) => {
    setLoading(true);
    downloadFile(wp_seq).then(
      (res) => {
        setLoading(false);
        // window.open(res, '_blank');
        let arr = res.split("/");
        //! Download
        fetch(res).then((response) => {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = arr[arr.length - 1];
            a.click();

            //? Get all list
            onGetDataList();
          });
        });
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
    if (
      object.opt_request_date === null ||
      object.province_seq === -1 ||
      object.amphur_seq === "-1" ||
      object.opt_seq === "-1" ||
      object.opt_request_desc === "" ||
      object.file === undefined ||
      object.file === null ||
      object.wp_shp_zone === undefined ||
      object.wp_shp_zone === null
    ) {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const onValidation = (object) => {
    let rtnChk = false;
    let keyList = [
      "opt_request_date",
      "province_seq",
      "amphur_seq",
      "opt_seq",
      "opt_request_desc",
      "wp_shp_zone",
    ];

    rtnChk = !keyList.some((item) => {
      let check = false;
      if (
        object[`${item}`] === undefined ||
        object[`${item}`] === "" ||
        object[`${item}`] === null ||
        object[`${item}`] === "-1" ||
        !object[`${item}`]
      ) {
        check = true;
      }
      return check;
    });
    setSubmitted(!rtnChk);
    return rtnChk;
  };

  // const validationEdit = (object) => {
  //     if (object.opt_request_date === null ||
  //         object.province_seq === -1 ||
  //         object.amphur_seq === '-1' ||
  //         object.opt_seq === '-1' ||
  //         object.opt_request_desc === '' ||
  //         object.wp_shp_zone === undefined || object.wp_shp_zone === null
  //     ) {
  //         setSubmitted(true);
  //         return false;
  //     } else {
  //         setSubmitted(false);
  //         return true;
  //     }
  // }

  const submitForm = (submitForm) => {
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      try {
        setLoading(true);
        createData({
          ...submitForm,
        }).then(
          (res) => {
            setLoading(false);
            if (res.status === 200) {
              onGetDataList();
              showMessages(
                "success",
                `สำเร็จ`,
                "บันทึกข้อมูลคำร้องขอข้อมูล มาตรา 92"
              );
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
            console.log("err", err);
            // if (err.response.data.status == 401) {
            //     alert(JSON.stringify('เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่'))
            //     window.location.href = '/login'
            // } else if (err.response.data.status == 400) {
            //     alert(JSON.stringify(err.response.data.errors));
            // } else {
            //     alert(JSON.stringify(err.response.data));
            // }
            // alert(JSON.stringify(err.response.data));
            showMessages("error", `เกิดข้อผิดพลาด`, "");
            setLoading(false);
          }
        );
      } catch (err) {
        console.log("catch--->err", err);
      }
    } else if (dialog.action === "แก้ไข" && onValidation(submitForm)) {
      // console.log('submitForm', submitForm)
      setLoading(true);
      updateData({
        ...submitForm,
      }).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            onGetDataList();
            showMessages(
              "success",
              `สำเร็จ`,
              "แก้ไขข้อมูลคำร้องขอข้อมูล มาตรา 92"
            );
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
          if (err.response.data.status == 401) {
            alert(
              JSON.stringify(
                "เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่"
              )
            );
            window.location.href = "/login";
          } else if (err.response.data.status == 400) {
            alert(JSON.stringify(err.response.data.errors));
          } else {
            alert(JSON.stringify(err.response.data));
          }
          setLoading(false);
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

  const numberWithCommas = (x) => {
    if (x === null || x === undefined) {
      return "-";
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const onCreatePDFClick = async () => {
    let data = dataTable;
    let _arr = [];
    let widths = [
      "4%",
      "8%",
      "23%",
      "6%",
      "10%",
      "10%",
      "10%",
      "10%",
      "10%",
      "10%",
    ];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let wp_file_size = numberWithCommas(data[i].wp_file_size);
        let count_sendmail =
          data[i].count_sendmail === 0 ? "ไม่ได้ส่งเมล" : "สำเร็จ";
        let path_file_zip = data[i].path_file_zip === null ? "x" : "√";
        _arr.push([
          {
            text: i + 1,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].opt_request_date, false),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].opt_name,
            style: { fontSize: 12 },
          },
          {
            text: path_file_zip,
            style: { fontSize: 12, alignment: "center" },
          },
          {
            text: wp_file_size,
            style: { fontSize: 12, alignment: "right" },
          },
          {
            text: count_sendmail,
            style: { fontSize: 12, alignment: "center" },
          },
          {
            text: data[i].wp_sendmail_by,
            style: { fontSize: 12, alignment: "center" },
          },
          {
            text: data[i].wp_sendmail_date,
            style: { fontSize: 12, alignment: "center" },
          },
          {
            text: data[i].wp_download_by,
            style: { fontSize: 12, alignment: "center" },
          },
          {
            text: data[i].wp_download_date,
            style: { fontSize: 12, alignment: "center" },
          },
        ]);
        let txtHead =
          "รายงานสร้างคำร้องข้อมูล มาตรา 92" +
          "\nเดือน " +
          monthNamesTH()[parseInt(searchData.wp_month_from) - 1].label +
          " ถึง " +
          monthNamesTH()[parseInt(searchData.wp_month_to) - 1].label +
          " ปี " +
          searchData.wp_year;
        var content = {
          pageOrientation: "landscape",
          pageSize: "A4",
          content: [generateTableADM12(widths, txtHead, _arr)],
        };
      }
      generatePdfOpenNewTab(true, content, (dataUrl) => {
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
      let wp_file_size = numberWithCommas(element.wp_file_size);
      let count_sendmail =
        element.count_sendmail === 0 ? "ไม่ได้ส่งเมล" : "สำเร็จ";
      let path_file_zip = element.path_file_zip === null ? "x" : "√";
      _exportData.push({
        index: index,
        opt_request_date: formatDateTH(element.opt_request_date, false),
        opt_name: element.opt_name === null ? "" : element.opt_name,
        path_file_zip: path_file_zip,
        wp_file_size: wp_file_size,
        count_sendmail: count_sendmail,
        wp_sendmail_by:
          element.wp_sendmail_by === null ? "" : element.wp_sendmail_by,
        wp_sendmail_date:
          element.wp_sendmail_date === null ? "" : element.wp_sendmail_date,
        wp_download_by:
          element.wp_download_by === null ? "" : element.wp_download_by,
        wp_download_date:
          element.wp_download_date === null ? "" : element.wp_download_date,
      });
      index++;
    });

    let fileName = `ADM12-${new Date().getTime().toString()}.xlsx`;
    let txtHead =
      "รายงานสร้างคำร้องข้อมูล มาตรา 92" +
      "\nเดือน " +
      monthNamesTH()[parseInt(searchData.wp_month_from) - 1].label +
      " ถึง " +
      monthNamesTH()[parseInt(searchData.wp_month_to) - 1].label +
      " ปี " +
      searchData.wp_year;
    let json_data = {
      nameTemplate: "ADM12",
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
    // console.log('json_data', json_data)
    await masterGenSpreadsheet("spreadsheet", json_data).then((res) => {
      let url = "";
      if (window.location.hostname.indexOf("localhost") !== -1) {
        url = `http://localhost:30004/export/downloadfile?filename=${fileName}`;
      } else {
        url = URL_API_EXPORT(`export/downloadfile?filename=${fileName}`);
      }
      setLoading(false);
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

  const footerButton = () => {
    const onDeleteData = () => {
      deleteData(deleteDialog.data.wp_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ลบข้อมูลสำเร็จ");
            onGetDataList(searchData);
            setDeleteDialog(false);
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด`,
            `${err.response.data.errors.message}`
          );
        }
      );
    };

    return (
      <FooterButtonCenter
        onClickOk={() => onDeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  const footerButtonFile = () => {
    const onDeleteData = () => {
      deleteFile(dialog.data.wp_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ลบไฟล์แนบขอบเขตสำเร็จ");
            onGetDataList(searchData);
            onGetFileList(dialog.data);
            setDeleteDialogFile(false);
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด`,
            `${err.response.data.errors.message}`
          );
        }
      );
    };

    return (
      <FooterButtonCenter
        onClickOk={() => onDeleteData()}
        onClickCancle={() => setDeleteDialogFile(false)}
      />
    );
  };

  const footerButtonMail = () => {
    const onSendMail = () => {
      setLoading(true);
      sendMailAPI(sendMail.data.wp_seq).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ส่งเมลสำเร็จ");
            onGetDataList(searchData);
            setSendMail(false);
            setLoading(false);
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด`,
            `${err.response.data.errors.message}`
          );
        }
      );
    };

    return (
      <FooterButtonCenter
        onClickOk={() => onSendMail()}
        onClickCancle={() => setSendMail(false)}
      />
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

          <ADM12Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onGetDataList()}
            optionProvince={optionProvince}
            optionAmphur={optionAmphur}
            optionOpt={optionOpt}
            onGetAmphur={(e) => onGetAmphur(e)}
            onGetOpt={(e) => onGetOpt(e)}
          />

          <ADM12List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onGetFileList={onGetFileList}
            setSendMail={setSendMail}
            setFileList={setFileList}
            onDownloadFile={onDownloadFile}
          />

          {dialog.dialog === true || dialog.dialogViewImage === true ? (
            <>
              <ADM12Dialog
                dialog={dialog}
                setDialog={setDialog}
                submitForm={(e) => submitForm(e)}
                submitted={submitted}
                setSubmitted={setSubmitted}
                optionProvince={optionProvince}
                optionAmphur={optionAmphur}
                optionOpt={optionOpt}
                onGetProvinceMaster={(a) => onGetProvinceMaster(a)}
                onGetAmphur={(a, b) => onGetAmphur(a, b)}
                onGetOpt={(a, b, c) => onGetOpt(a, b, c)}
                fileList={fileList}
                setFileList={setFileList}
                deleteDialogFile={deleteDialogFile}
                setDeleteDialogFile={setDeleteDialogFile}
                showMessages={showMessages}
              />
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      {deleteDialog.open && (
        <DialogDelete
          visible={deleteDialog.open}
          header="การยืนยัน"
          modal
          footer={footerButton()}
          onHide={() => setDeleteDialog(false)}
          textContent={`คุณต้องการลบข้อมูลใช่หรือไม่ ?`}
        />
      )}
      {deleteDialogFile.open && (
        <DialogDelete
          visible={deleteDialogFile.open}
          header="การยืนยัน"
          modal
          footer={footerButtonFile()}
          onHide={() => setDeleteDialogFile(false)}
          textContent={`คุณต้องการลบไฟล์ทั้งหมดใช่หรือไม่ ?`}
        />
      )}

      {sendMail.open && (
        <DialogDelete
          visible={sendMail.open}
          header="การยืนยัน"
          modal
          footer={footerButtonMail()}
          onHide={() => setSendMail(false)}
          textContent={`คุณต้องส่งเมลใช่หรือไม่ ?`}
        />
      )}

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
