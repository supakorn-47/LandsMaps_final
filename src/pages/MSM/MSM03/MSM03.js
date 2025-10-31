import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import {
  formatDateTH2,
  formatDateTH_full2,
  formatDateAPI2,
} from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import MSM03Search from "./MSM03Search";
import MSM03List from "./MSM03List";
import MSM03Dialog from "./MSM03Dialog";

//SERVICE
import MSM03Services from "../../../service/ServiceMSM/ServiceMSM03";
import { masterService } from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generatePdfOpenNewTab,
  generateTableMSM3,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import {
  strToArrBuffer,
  excelSheetFromAoA,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function MSM03() {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [summarylist, setSummarylist] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [departmentList, setDepartmentList] = useState([]);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [optionDepartment, setOptionDepartment] = useState([]);
  const [optionsChart, setOptionsChart] = useState([]);

  //set date
  let date_from = new Date(new Date().setMinutes(new Date().getMinutes() - 10));
  let date_from_minutes = date_from.getMinutes();
  if (date_from_minutes < 10) {
    date_from_minutes = "0" + date_from_minutes;
  } else {
    date_from_minutes = date_from_minutes + "";
  }

  let date_to = new Date();
  let date_to_minutes = date_to.getMinutes();
  if (date_to_minutes < 10) {
    date_to_minutes = "0" + date_from_minutes;
  } else {
    date_to_minutes = date_to_minutes + "";
  }
  date_from.setMinutes(date_from_minutes.slice(0, 1) + 0);
  date_to.setMinutes(date_to_minutes.slice(0, 1) + 0);
  // SEARCH
  const [searchData, setSearchData] = useState({
    log_service_dtm_start: new Date(),
    log_service_dtm_end: new Date(),
    log_desc: "",
    personal_fnameth: "",
    personal_lnameth: "",
  });

  useEffect(() => {
    onGetDataList();
    masterService(`GetDepartment?mode=0`, {}, "GET").then((res) => {
      setOptionDepartment(res.result);
    });
  }, []);

  const onGetDataList = () => {
    setLoading(true);
    MSM03Services.GetDataList({
      log_service_dtm_start: formatDateAPI2(
        searchData.log_service_dtm_start,
        true
      ), //
      log_service_dtm_end: formatDateAPI2(searchData.log_service_dtm_end, true),
      log_desc: searchData.log_desc,
      personal_fnameth: searchData.personal_fnameth,
      personal_lnameth: searchData.personal_lnameth,
    }).then(
      (res) => {
        if (res.status === 200 && res.result.data !== null) {
          let temp = [];
          let index = 1;
          res.result.data.forEach((element) => {
            temp.push({
              ...element,
              index: index,
            });
            index++;
          });
          setSummarylist(res.result.summarylist);
          setDataTable(temp);
          onSetGraphData(res.result.summarylist);
        }
        setLoading(false);
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
      }
    );
  };

  const onSetGraphData = (summarylist) => {
    let categories = [];
    let seriesData = [];

    summarylist.forEach((element) => {
      categories.push(
        element.ip_address === null ? "0.0.0.0" : element.ip_address
      );
      seriesData.push(element.total);
    });
    setOptionsChart({
      chart: {
        type: "column",
        style: {
          fontFamily: "CSChatThaiUI",
        },
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: categories,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "จำนวน (ครั้ง)",
        },
      },
      tooltip: {
        headerFormat: "<span><b>IP: {point.key}</b></span><table>",
        pointFormat:
          '<td style="padding:0"><b>ใช้งาน {point.y} ครั้ง</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: "ปริมาณการใช้งาน Service ตามผู้ใช้งาน",
          data: seriesData,
        },
      ],
    });
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const personalFormat = (personal_id) => {
    if (personal_id === null || personal_id === undefined) return "-";
    let str = personal_id.toString();
    if (str.length < 13) return "-";
    return (
      str.substring(0, 1) +
      "-" +
      str.substring(1, 5) +
      "-" +
      str.substring(5, 10) +
      "-" +
      str.substring(10, 12) +
      "-" +
      str.substring(12)
    );
  };

  const onCreatePDFClick = async () => {
    // setLoading(true)
    let data = dataTable;
    let _arr = [];
    //#region
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let data_status = data[i].data_status == 1 ? "สำเร็จ" : "ไม่สำเร็จ";
        let data_size =
          data[i].data_size === null
            ? "-"
            : data[i].data_size
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //columus
        _arr.push([
          {
            text: data[i].index,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH2(data[i].create_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].personal_nameth,
            style: { fontSize: 12 },
          },
          {
            text: data[i].department_name_th,
            style: { fontSize: 12 },
          },
          {
            text: data[i].ip_address,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH2(data[i].request_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH2(data[i].response_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].service_name,
            style: { fontSize: 12 },
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
        content: [generateTableMSM3(searchData, _arr)],
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
      font: { bold: true, name: "TH SarabunPSK", sz: "20" },
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
      font: { bold: true, name: "TH SarabunPSK", sz: "16" },
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
      font: { name: "TH SarabunPSK", sz: "16" },
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
      font: { name: "TH SarabunPSK", sz: "16" },
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
      font: { name: "TH SarabunPSK", sz: "16" },
    };

    if (dataTable.length > 0) {
      let dataRow = dataTable;
      let dataExcel = [];

      let headerText = [
        {
          text:
            "รายงานข้อมูล Log Service" +
            "\n" +
            formatDateTH_full2(searchData.log_service_dtm_start, true) +
            " ถึง " +
            formatDateTH_full2(searchData.log_service_dtm_end, true),
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
        { value: "ชื่อ-นามสกุล", style: styleHeaders },
        { value: "หน่วยงาน", style: styleHeaders },
        { value: "หมายเลขเครื่อง", style: styleHeaders },
        { value: "วันเวลา" + "\n" + "Request", style: styleHeaders },
        { value: "วันเวลา Response", style: styleHeaders },
        { value: "ชื่อ Service", style: styleHeaders },
        { value: "สถานะ", style: styleHeaders },
        { value: "ขนาดข้อมูล(byte)", style: styleHeaders },
      ]);

      // ADD Row
      for (let i = 0; i < dataRow.length; i++) {
        let data_status = dataRow[i].data_status == 1 ? "สำเร็จ" : "ไม่สำเร็จ";
        let data_size =
          dataRow[i].data_size === null
            ? "-"
            : dataRow[i].data_size
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //dataExcel
        dataExcel.push([
          { value: dataRow[i].index, style: styleBorderB_Center },
          {
            value: dataRow[i].create_dtm
              ? formatDateTH2(dataRow[i].create_dtm, true)
              : "",
            style: styleBorderB_Center,
          },
          {
            value: dataRow[i].personal_nameth ? dataRow[i].personal_nameth : "",
            style: styleBorderB,
          },
          {
            value: dataRow[i].department_name_th
              ? dataRow[i].department_name_th
              : "",
            style: styleBorderB,
          },
          {
            value: dataRow[i].ip_address ? dataRow[i].ip_address : "",
            style: styleBorderB_Center,
          },
          {
            value: dataRow[i].request_dtm
              ? formatDateTH2(dataRow[i].request_dtm, true)
              : "",
            style: styleBorderB_Center,
          },
          {
            value: dataRow[i].response_dtm
              ? formatDateTH2(dataRow[i].response_dtm, true)
              : "",
            style: styleBorderB_Center,
          },
          {
            value: dataRow[i].service_name ? dataRow[i].service_name : "",
            style: styleBorderB,
          },
          { value: data_status, style: styleBorderB_Center },
          { value: data_size, style: styleBorderB_Right },
        ]);
      }
      //"xlsx"  "csv"
      exportFile(dataExcel);
      // this.handleCloseExport()
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const exportFile = (dataExcel) => {
    var dateFormat = require("dateformat");
    let filename =
      "MSM03_" + dateFormat(new Date().setFullYear(2564), "yyyymmdd");

    const wb = {
      SheetNames: [filename],
      Sheets: {
        [filename]: excelSheetFromDataSet([
          {
            columns: null,
            data: dataExcel,
            merges: [{ s: { r: 3, c: 0 }, e: { r: 0, c: 9 } }],
            page: "MSM03",
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
              title: "ข้อมูล Log Service",
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
          <MSM03Search
            departmentList={departmentList}
            searchData={searchData}
            setSearchData={setSearchData}
            onGetDataList={onGetDataList}
            optionDepartment={optionDepartment}
          />
        }
      />

      <CustomCard>
        {summarylist.length > 0 && (
          <div className="modern-table-container">
            <HighchartsReact highcharts={Highcharts} options={optionsChart} />
          </div>
        )}

        <MSM03List dataTable={dataTable} setDialog={setDialog} />
      </CustomCard>

      {dialog.dialog && <MSM03Dialog dialog={dialog} setDialog={setDialog} />}
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
