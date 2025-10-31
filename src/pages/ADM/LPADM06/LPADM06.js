import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import LPADM06Search from "./LPADM06Search";
import LPADM06List from "./LPADM06List";

//SERVICE
import { LPADM06GetDataList } from "../../../service/ServiceADM/ServiceLPADM06";
import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";

//PDF
import {
  generatePdfOpenNewTab,
  // generateTableLPADM06,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import {
  strToArrBuffer,
  excelSheetFromAoA,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";

var dateFormat = require("dateformat");
var d = new Date();
d.setFullYear(2564);

export default function LPADM06() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);
  // SEARCH
  const [searchData, setSearchData] = useState({
    otp_dtm_from: new Date(),
    otp_dtm_to: new Date(),
  });

  useEffect(() => {
    onLPADM06GetDataList();
  }, []);

  const onLPADM06GetDataList = () => {
    setLoading(true);
    LPADM06GetDataList(searchData).then(
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
          setDataTableReport(
            res.result.sort((a, b) => (new Date(a) < new Date(b) ? 1 : -1))
          );
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

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const onCreatePDFClick = async () => {
    // setLoading(true)
    let data = dataTableReport;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let data_status = data[i].otp_status == 1 ? "สำเร็จ" : "ไม่สำเร็จ";
        _arr.push([
          {
            text: i + 1,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].otp_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].otp_expire, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].ref_code,
            style: { fontSize: 12 },
          },
          {
            text: data[i].otp,
            style: { fontSize: 12 },
          },
          {
            text: data[i].to_email,
            style: { fontSize: 12 },
          },
          {
            text: data_status,
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }
      var content = {
        pageOrientation: "landscape",
        pageSize: "A4",
        // content: [generateTableLPADM06(searchData, _arr)],
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
      let otp_status = element.otp_status == 1 ? "สำเร็จ" : "ไม่สำเร็จ";
      _exportData.push({
        index: index,
        otp_dtm: formatDateTH(element.otp_dtm, true),
        otp_expire: formatDateTH(element.otp_expire, true),
        ref_code: element.ref_code,
        otp: element.otp,
        to_email: element.to_email,
        otp_status: otp_status,
      });
      index++;
    });

    let fileName = `LPADM06-${new Date().getTime().toString()}.xlsx`;
    let txtHead =
      "รายงานตรวจสอบประวัติ OTP" +
      "\n" +
      formatDateTH_full2(searchData.otp_dtm_from) +
      " ถึง " +
      formatDateTH_full2(searchData.otp_dtm_to);
    let json_data = {
      nameTemplate: "LPADM06",
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
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        {/* <Toast ref={(el) => toast = el} /> */}
        <Toast ref={toast} position="top-right" />
        <div className="" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              top: "1rem",
              left: "0",
              right: "1.5rem",
              zIndex: 1000,
            }}
          >
            {/* <h1 className="p-m-0">{getTextMenu()}</h1> */}
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
          <LPADM06Search
            searchData={searchData}
            setSearchData={setSearchData}
           onSearch={onLPADM06GetDataList}
          />
          <LPADM06List dataTable={dataTable} />
        </div>
      </div>
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
