import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import {
  formatDateAPI2,
  formatDateTH_full2,
  formatDateTH,
} from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";
//PAGE
import DEA02Search from "./DEA02Search";
import DEA02List from "./DEA02List";
import DEA02Dialog from "./DEA02Dialog";

//SERVICE
import MSM01Services from "../../../service/ServiceMSM/ServiceMSM01";
// import { DEA02GetDataList } from '../../../service/ServiceDEA/ServiceDEA02';
import { masterService } from "../../../service/ServiceMaster/MasterService";
//PDF
import {
  generateTableMSM1,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";
//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import {
  strToArrBuffer,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";

import {
  exportAsExcel,
  styleTextHeaders,
  styleHeaders,
  text_Default,
  text_Center,
  text_Right,
} from "../../../utils/dataHelpers";
import axios from "axios";
import { config_headers, URL_API, URL_API_LOG } from "../../../service/Config";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { TabView } from "primereact/tabview";

export default function DEA02() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [activeIndex, setActiveIndex] = useState(0);
  // SEARCH
  let date = new Date();
  date.setMinutes(date.getMinutes() - 20);
  const [searchData, setSearchData] = useState({
    department_seq: "-1",
    log_exchange_dtm_start: date,
    log_exchange_dtm_end: new Date(),
  });

  const [optionDepartment, setOptionDepartment] = useState([]);

  useEffect(() => {
    masterService(`GetDepartment?mode=0`, {}, "GET").then((res) => {
      setOptionDepartment(res.result);
    });
  }, []);

  const onGetDataList = async () => {
    const authorization = await config_headers();
    setLoading(true);
    // MSM01Services.GetDataList({
    //   department_seq: parseInt(searchData.department_seq),
    //   log_exchange_dtm_start: formatDateAPI2(
    //     searchData.log_exchange_dtm_start,
    //     true
    //   ),
    //   log_exchange_dtm_end: formatDateAPI2(
    //     searchData.log_exchange_dtm_end,
    //     true
    //   ),
    // })
    var dateFormat = require("dateformat");
    await axios
      .post(
        URL_API_LOG("apiLog/LogService/GetList"),
        {
          log_service_dtm_start: formatDateAPI2(
            searchData.log_exchange_dtm_start,
            true
          ), //
          log_service_dtm_end: formatDateAPI2(
            searchData.log_exchange_dtm_end,
            true
          ),
          log_desc: "",
          personal_fnameth: "",
          personal_lnameth: "",
          // request_dtm_from: dateFormat(searchData.request_dtm_from, "yyyymmdd"),
          // response_dtm_to: dateFormat(searchData.log_exchange_dtm_end,'yyyymmdd'),
          // totalRecords: 0,
          // pageofnum: 0,
          // rowofpage: 1000,
        },
        authorization
      )
      .then(
        (res) => {
          setLoading(false);
          if (res.data.status === 200 && res.data.result !== null) {
            let temp = [];
            let index = 1;
            res.data.result.data.forEach((element) => {
              temp.push({
                ...element,
                index: index,
              });
              index++;
            });
            // setSummarylist(res.result.summarylist);
            setDataTable(temp);
            // onSetGraphData(res.result.summarylist);
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
          if (err.response.data.status == 401) {
            alert(
              JSON.stringify(
                "เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่"
              )
            );
            window.location.href = "/login";
          } else {
            console.error(err);

            // alert(JSON.stringify(err.response.data));
          }
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
    let data = dataTable;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let response_status =
          data[i].response_status == "สำเร็จ" ? "ติดต่อได้" : "ติดต่อไม่ได้";
        let data_size =
          data[i].data_size === null
            ? "-"
            : data[i].data_size
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let data_status =
          data[i].data_status === 1 ? "ได้ข้อมูล" : "ไม่ได้ข้อมูล";
        _arr.push([
          {
            text: data[i].index,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].create_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].ip_address,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].department_name_th,
            style: {
              fontSize: 12,
              wrapText: true,
              wordWrap: "break-word",
              paddingRight: 20,
            },
          },
          {
            text: data[i].service_name,
            style: { fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].request_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH(data[i].response_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].service_method,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: response_status,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data_status,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data_size,
            style: { fontSize: 12, alignment: "right" },
          },
        ]);
      }
      var content = {
        pageSize: "A4",
        pageOrientation: "landscape",
        content: [generateTableMSM1(searchData, _arr)],
        pageMargins: [20, 20, 40, 40],
        style: "tableExample",
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

  const onCreateExcelClick = () => {
    setLoading(true);
    let setBorder = {
      left: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
      right: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
      top: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
      bottom: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
    };
    let styleTextHeaders = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      font: { bold: true },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: setBorder,
    };
    let styleHeaders = {
      fill: {
        fgColor: { rgb: "c7c7c7" },
      },
      font: { bold: true },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: setBorder,
    };
    let styleBorderB = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      border: setBorder,
      alignment: {
        vertical: "center",
        wrapText: true,
      },
    };
    let styleBorderB_Center = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      border: setBorder,
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
    };
    let styleBorderB_Right = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      border: setBorder,
      alignment: {
        horizontal: "right",
        vertical: "center",
        wrapText: true,
      },
    };

    if (dataTable.length > 0) {
      let dataRow = dataTable;
      let dataExcel = [];

      let headerText = [
        {
          text:
            "รายงานข้อมูล Log การแลกเปลี่ยนข้อมูล" +
            "\n" +
            formatDateTH_full2(searchData.log_exchange_dtm_start, true) +
            " ถึง " +
            formatDateTH_full2(searchData.log_exchange_dtm_end, true),
          style: styleTextHeaders,
        },
        {
          text: "",
          style: styleTextHeaders,
        },
      ];
      //หัวรายงาน
      for (let i = 0; i < headerText.length; i++) {
        dataExcel.push([
          { value: headerText[i].text, style: headerText[i].style },
        ]);
      }

      dataExcel.push([]);
      dataExcel.push([]);
      // ADD Headers
      dataExcel.push([
        { value: "ลำดับ", style: styleHeaders },
        { value: "วันเวลาจัดเก็บประวัติ", style: styleHeaders },
        { value: "หมายเลขเครื่อง", style: styleHeaders },
        { value: "หน่วยงาน", style: styleHeaders },
        { value: "ชื่อ Serivce", style: styleHeaders },
        { value: "วันเวลา" + "\n" + "Request", style: styleHeaders },
        { value: "วันเวลา Response", style: styleHeaders },
        { value: "ประเภท Service", style: styleHeaders },
        { value: "สถานะติดต่อ", style: styleHeaders },
        { value: "สถานะ", style: styleHeaders },
        { value: "ขนาดข้อมูล(byte)", style: styleHeaders },
      ]);
      // ADD Row
      for (let i = 0; i < dataRow.length; i++) {
        let response_status =
          dataRow[i].response_status == "สำเร็จ" ? "ติดต่อได้" : "ติดต่อไม่ได้";
        let data_size =
          dataRow[i].data_size === null
            ? "-"
            : dataRow[i].data_size
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let data_status =
          dataRow[i].data_status === 1 ? "ได้ข้อมูล" : "ไม่ได้ข้อมูล";
        //dataExcel
        dataExcel.push([
          { value: dataRow[i].index, style: text_Center },
          {
            value: dataRow[i].create_dtm
              ? formatDateTH(dataRow[i].create_dtm, true)
              : "",
            style: text_Center,
          },
          {
            value: dataRow[i].ip_address ? dataRow[i].ip_address : "",
            style: text_Center,
          },
          {
            value: dataRow[i].department_name_th
              ? dataRow[i].department_name_th
              : "",
            style: text_Default,
          },
          {
            value: dataRow[i].service_name ? dataRow[i].service_name : "",
            style: text_Default,
          },
          {
            value: dataRow[i].request_dtm
              ? formatDateTH(dataRow[i].request_dtm, true)
              : "",
            style: text_Center,
          },
          {
            value: dataRow[i].response_dtm
              ? formatDateTH(dataRow[i].response_dtm, true)
              : "",
            style: text_Center,
          },
          {
            value: dataRow[i].service_method ? dataRow[i].service_method : "",
            style: text_Center,
          },
          { value: response_status, style: text_Center },
          { value: data_status ? data_status : "", style: text_Center },
          { value: data_size, style: text_Right },
        ]);
      }
      exportAsExcel(dataExcel, "DEA02", [
        { s: { r: 3, c: 0 }, e: { r: 0, c: 10 } },
      ]);
      setLoading(false);
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const exportFile = (dataExcel) => {
    var dateFormat = require("dateformat");
    let filename =
      "MSM04_" + dateFormat(new Date().setFullYear(2564), "yyyymmdd");

    const wb = {
      SheetNames: [filename],
      Sheets: {
        [filename]: excelSheetFromDataSet([
          {
            columns: null,
            data: dataExcel,
            merges: [{ s: { r: 1, c: 0 }, e: { r: 0, c: 10 } }],
            page: "MSM04",
          },
        ]),
      },
    };
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary",
    });
    let data = new Blob([strToArrBuffer(wbout)], {
      type: "application/octet-stream",
    });
    FileSaver.saveAs(data, filename + "." + "xlsx");
    setLoading(false);
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />

      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ตรวจสอบประวัติแลกเปลี่ยนข้อมูล",
              actionButton: (
                <div>
                  <Button
                    style={{ height: "35px", color: "green" }}
                    label="ส่งออก Excel"
                    icon="pi pi-file-excel"
                    onClick={() => onCreateExcelClick()}
                    className="p-button-info p-button-rounded p-button-outlined"
                    tooltip="คลิกเพื่อ ส่งออก Excel"
                    tooltipOptions={{ position: "top" }}
                    disabled={dataTable.length === 0}
                  />
                  <Button
                    style={{ height: "35px", marginLeft: "5px" }}
                    label="ส่งออก PDF"
                    icon="pi pi-file-pdf"
                    onClick={() => onCreatePDFClick()}
                    className="p-button-danger p-button-rounded p-button-outlined"
                    tooltip="คลิกเพื่อ ส่งออก PDF"
                    tooltipOptions={{ position: "top" }}
                    disabled={dataTable.length === 0}
                  />
                </div>
              ),
            }}
          />
        }
        body={
          <DEA02Search
            searchData={searchData}
            setSearchData={setSearchData}
            onGetDataList={onGetDataList}
            optionDepartment={optionDepartment}
          />
        }
      />

      <CustomCard>
        <DEA02List dataTable={dataTable} setDialog={setDialog} />
      </CustomCard>

      {dialog.dialog && <DEA02Dialog dialog={dialog} setDialog={setDialog} />}

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
  );
}
