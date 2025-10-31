import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import {
  formatDateTH2,
  formatDateTH_full2,
  formatDateAPI,
} from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import LPSMS02Search from "./LPSMS02Search";
import LPSMS02List from "./LPSMS02List";
import LPSMS02Dialog from "./LPSMS02Dialog";

//SERVICE
import MSM02Services from "../../../service/ServiceMSM/ServiceMSM02";
import { masterService } from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateTableMSM2,
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

export default function LPSMS02() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [dialogPDF, setDialogPDF] = useState(false);
  const [selectedTF, setSelectedTF] = useState([]);

  // SEARCH
  const [searchData, setSearchData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    source_seq: -1,
    transfer_data_seq: -1,
    source_schema: "-1",
  });

  const [msDataSource, setMsDataSource] = useState([]);
  const [msDataTransferGroup, setMsDataTransferGroup] = useState([]);

  useEffect(() => {
    onGetDataList();

    //แหล่งข้อมูล
    masterService(`GetDataSource?mode=${0}&source_process=1`, {}, "GET").then(
      (res) => {
        setMsDataSource(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );

    //กลุ่มตาราง
    masterService(`GetTransferDataGroup?mode=${0}`, {}, "GET").then(
      (res) => {
        setMsDataTransferGroup(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  }, []);

  const onGetTransferDataGroup = (source_schema = "") => {
    masterService(
      `GetTransferDataGroup?mode=1&source_schema=${source_schema}`,
      {},
      "GET"
    ).then((res) => {
      let temp = res.result;
      temp.splice(0, 1);
      setMsDataTransferGroup(temp);
      // setMsDataTransferGroup(res.result);
    });
  };

  const onGetDataList = () => {
    let transfer_data_group_seq = "-1";
    let index = 1;
    if (selectedTF !== null && selectedTF !== "" && selectedTF !== undefined) {
      transfer_data_group_seq = "";
      selectedTF.forEach((element) => {
        if (selectedTF.length === index || selectedTF.length === 1) {
          transfer_data_group_seq += element + "";
        } else {
          transfer_data_group_seq += element + ",";
        }
        index++;
      });
    }

    setLoading(true);
    MSM02Services.GetDataList({
      ...searchData,
      start_date: formatDateAPI(searchData.start_date),
      end_date: formatDateAPI(searchData.end_date),
      source_seq: parseInt(searchData.source_seq),
      transfer_data_seq: transfer_data_group_seq,
      source_schema: searchData.source_schema + "",
    }).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          setDataTable(res.result);
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
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
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
        _arr.push([
          {
            text: data[i].order_no,
            style: { alignment: "center", fontSize: 12 },
          },
          // {
          //     text: data[i].transfer_job_seq,
          //     style: { fontSize: 12 }
          // },
          {
            text: formatDateTH2(data[i].log_start_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH2(data[i].log_end_dtm, true),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].source_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].transfer_source_table,
            style: { fontSize: 12, wrapText: true },
          },
          {
            text: data[i].target_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].source_record_num,
            style: { alignment: "right", fontSize: 12 },
          },
          {
            text: data[i].target_record_num,
            style: { alignment: "right", fontSize: 12 },
          },
          {
            text: data[i].schedule_mode,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].transfer_status,
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }

      var content = {
        pageSize: "A4",
        pageOrientation: "landscape",
        content: [generateTableMSM2(searchData, _arr)],
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
    if (dataTable.length > 0) {
      let dataRow = dataTable;
      let dataExcel = [];

      let headerText = [
        {
          text:
            "รายงานข้อมูล Log ถ่ายโอนข้อมูล" +
            "\n" +
            formatDateTH_full2(searchData.start_date, true) +
            " ถึง " +
            formatDateTH_full2(searchData.end_date, true),
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
        { value: "วันเวลาเริ่มต้น", style: styleHeaders },
        { value: "วันเวลาสิ้นสุด", style: styleHeaders },
        { value: "แหล่งข้อมูล", style: styleHeaders },
        { value: "กลุ่มตาราง", style: styleHeaders },
        { value: "แหล่งข้อมูลปลายทาง", style: styleHeaders },
        { value: "จำนวนข้อมูลต้นทาง", style: styleHeaders },
        { value: "จำนวนข้อมูลปลายทาง", style: styleHeaders },
        { value: "Schedule Mode", style: styleHeaders },
        { value: "สถานะการถ่ายโอน", style: styleHeaders },
      ]);

      // ADD Row
      for (let i = 0; i < dataRow.length; i++) {
        //dataExcel
        dataExcel.push([
          { value: i + 1, style: text_Center },
          {
            value: dataRow[i].log_start_dtm
              ? formatDateTH2(dataRow[i].log_start_dtm, true)
              : "",
            style: text_Center,
          },
          {
            value: dataRow[i].log_end_dtm
              ? formatDateTH2(dataRow[i].log_end_dtm, true)
              : "",
            style: text_Center,
          },
          {
            value: dataRow[i].source_name ? dataRow[i].source_name : "",
            style: text_Center,
          },
          {
            value: dataRow[i].transfer_source_table
              ? dataRow[i].transfer_source_table
              : "",
            style: text_Center,
          },
          {
            value: dataRow[i].target_name ? dataRow[i].target_name : "",
            style: text_Default,
          },
          {
            value: dataRow[i].source_record_num
              ? dataRow[i].source_record_num
              : "",
            style: text_Default,
          },
          {
            value: dataRow[i].target_record_num
              ? dataRow[i].target_record_num
              : "",
            style: text_Default,
          },
          {
            value: dataRow[i].schedule_mode ? dataRow[i].schedule_mode : "",
            style: text_Default,
          },
          {
            value: dataRow[i].transfer_status ? dataRow[i].transfer_status : "",
            style: text_Default,
          },
        ]);
      }
      exportAsExcel(dataExcel, "MSM02", [
        { s: { r: 3, c: 0 }, e: { r: 0, c: 9 } },
      ]);
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const exportFile = (dataExcel) => {
    var dateFormat = require("dateformat");
    let filename =
      "MSM02_" + dateFormat(new Date().setFullYear(2564), "yyyymmdd");

    const wb = {
      SheetNames: [filename],
      Sheets: {
        [filename]: excelSheetFromDataSet([
          {
            columns: null,
            data: dataExcel,
            merges: [{ s: { r: 1, c: 0 }, e: { r: 0, c: 10 } }],
            page: "MSM02",
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
    <>
      <Loading loading={loading} />

      <div className="datatable-crud-demo">
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
              zIndex: 1,
            }}
          >
            {/* <h1 className="p-m-0">{getTextMenu()}</h1> */}
            <div>
              <Button
                style={{ height: "35px", color: "green" }}
                label="ส่งออก Excel"
                icon="pi pi-file-excel"
                onClick={() => onCreateExcelClick()}
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
          <LPSMS02Search
            searchData={searchData}
            setSearchData={setSearchData}
            onGetDataList={onGetDataList}
            msDataSource={msDataSource}
            msDataTransferGroup={msDataTransferGroup}
            selectedTF={selectedTF}
            setSelectedTF={setSelectedTF}
            onGetTransferDataGroup={onGetTransferDataGroup}
          />

          <LPSMS02List dataTable={dataTable} setDialog={setDialog} />

          {dialog.dialog && (
            <LPSMS02Dialog dialog={dialog} setDialog={setDialog} />
          )}
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
      </div>
    </>
  );
}
