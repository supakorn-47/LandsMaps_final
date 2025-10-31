import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import ADM14Search from "./ADM14Search";
import ADM14List from "./ADM14List";
import { getTextMenu } from "../../../utils/MenuUtil";

import { getDataList } from "../../../service/ServiceADM/ServiceADM14";
import {
  masterService,
  masterServiceWebPortal,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";
import { ADM14Dialog } from "./ADM14Dialog";

import {
  generateTableADM16,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import { URL_API_EXPORT } from "../../../service/Config";

let dates = new Date();
dates.setDate(1);

export default function ADM14() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [popUp, setPopup] = useState({
    open: false,
  });
  const [optionProvince, setOptionProvince] = useState([]);
  const [optionLandoffice, setOptionLandoffice] = useState([]);
  const [optionErrorType, setOptionErrorType] = useState([]);
  const [optionErrorQuestionStatus, setErrorQuestionStatus] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [searchData, setSearchData] = useState({
    error_type_seq: -1,
    landoffice_id: "-1",
    question_dt_start: dates,
    question_dt_end: new Date(),
    error_question_status: "-1",

    start: 0,
    length: 1000000,
    recordsTotal: 0,

    province_seq: "-1",
  });
  const [changes, setchanges] = useState(0);

  useEffect(() => {
    onGetDataList();
    onGetMaster();
    onGetErrorType();
    onGetErrorQuestionStatus();
  }, []);

  const onGetDataList = () => {
    setLoading(true);
    getDataList(searchData).then(
      (res) => {
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.data.forEach((element) => {
            temp.push({
              ...element,
              index: index,
            });
            index++;
          });
          setDataTable(temp);
        }
        setLoading(false);
      },
      function (err) {
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          // window.location.href = '/login'
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
      }
    );
  };

  const onGetMaster = (_VALUE = 0) => {
    masterService(`GetProvince?mode=${_VALUE}`, {}, "GET").then((res) => {
      setOptionProvince(res.result);
    });
  };

  const onGetMasterLandoffice = (province_seq) => {
    masterService(
      `GetLandoffice?mode=1&province_seq=${province_seq}`,
      {},
      "GET"
    ).then((res) => {
      setOptionLandoffice(res.result);
      setSearchData({ ...searchData, province_seq: province_seq });
    });
  };

  const onGetErrorType = () => {
    masterService(`GetErrorType?mode=0`, {}, "GET").then((res) => {
      setOptionErrorType(res.data);
    });
  };

  const onGetErrorQuestionStatus = () => {
    masterService(`GetErrorQuestionStatus?mode=0`, {}, "GET").then((res) => {
      setErrorQuestionStatus(res.data);
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

  const onExportExcelClick = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;
    dataTable.forEach((element) => {
      // let record_status = element.record_status === 'N' ? "ใช้งาน" : "ไม่ใช้งาน"
      _exportData.push({
        index: index,
        error_question_date: element.error_question_date,
        agency_name: element.agency_name,
        register_name: element.register_name,
        landoffice_name: element.landoffice_name,
        error_type_name: element.error_type_name,
        error_question_subject: element.error_question_subject,
        error_type_desc: element.error_type_desc,
        error_question_status: element.error_question_status,
      });
      index++;
    });

    let fileName = `ADM16-${new Date().getTime().toString()}.xlsx`;
    let txtHead =
      "ตรวจสอบติดตามการเเจ้งข้อผิดพลาด" +
      "\n" +
      formatDateTH_full2(searchData.question_dt_start, true) +
      " ถึง " +
      formatDateTH_full2(searchData.question_dt_end, true);
    let json_data = {
      nameTemplate: "ADM16",
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

  const onCreatePDFClick = () => {
    // setLoading(true)
    let data = dataTable;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let record_status =
          data[i].record_status == "N" ? "ใช้งาน" : "ไม่ใช้งาน";
        _arr.push([
          {
            text: data[i].index,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].error_question_date,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].agency_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].register_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].landoffice_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].error_type_name,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].error_question_subject,
            style: { fontSize: 12 },
          },
          {
            text: data[i].error_type_desc,
            style: { fontSize: 12 },
          },
          {
            text: data[i].error_question_status,
            style: { fontSize: 12 },
          },
        ]);
      }
      var content = {
        pageSize: "A4",
        pageOrientation: "landscape",
        content: [generateTableADM16(searchData, _arr)],
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
          <ADM14Search
            optionProvince={optionProvince}
            searchData={searchData}
            setSearchData={setSearchData}
            optionLandoffice={optionLandoffice}
            onGetMasterLandoffice={onGetMasterLandoffice}
            optionErrorType={optionErrorType}
            optionErrorQuestionStatus={optionErrorQuestionStatus}
            onGetDataList={onGetDataList}
            setchanges={setchanges}
            changes={changes}
          />
          <br />
          <ADM14List dataTable={dataTable} popUp={popUp} setPopup={setPopup} />
        </div>
      </div>
      {popUp.open && <ADM14Dialog popUp={popUp} setPopup={setPopup} />}
    </>
  );
}
