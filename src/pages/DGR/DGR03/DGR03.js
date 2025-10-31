import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";
//PAGE
import DGR03List from "./DGR03List";
// import LPASM03Dialog from "./LPASM03Dialog";

//SERVICE
import {
  ADM03GetDataList,
  ADM03CreateData,
  ADM03UpdateData,
  ADM03CancelData,
  ADM03UpdateServiceUse,
  ADM03GetServiceReqAndRes,
  ADM03AddServiceReqAndRes,
  ADM03UpdateServiceReqAndRes,
  ADM03DeleteServiceReqAndRes,
  updateOrder,
  updateOrderList,
  updateServicePublic,
} from "../../../service/ServiceADM/ServiceADM03";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateTableADM3,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import {
  strToArrBuffer,
  excelSheetFromAoA,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";
import { URL_API_EXPORT } from "../../../service/Config";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function DGR03() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [finalDataList, setFinalDataList] = useState([]);
  //REQ
  const [reqAndResList, setReqAndResList] = useState([]);

  //RES

  // 'SOAP', 'REST', 'WMS', 'WMTS'
  const [serviceOption, setServiceOption] = useState([
    { label: "REST", value: "REST" },
    { label: "WMS", value: "WMS" },
    { label: "GEOJSON", value: "GEOJSON" },
  ]);
  // 'TEXT', 'SPATIAL'
  const [dataOption, setDataOption] = useState([
    { label: "TEXT", value: "TEXT" },
    { label: "SPATIAL", value: "SPATIAL" },
  ]);

  const [lastServiceSeq, setLastServiceSeq] = useState(0);

  const [typeRequestResponse, setTypeRequestResponse] = useState(0);
  const [optionDepartment, setOptionDepartment] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    onADM03GetDataList();

    // ประเภทผู้ใช้งาน
    masterService("GetTypeRequestResponse?mode=1", {}, "GET").then(
      (res) => {
        setTypeRequestResponse(res.result);
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

    masterService(`GetDepartment?mode=1`, {}, "GET").then((res) => {
      setOptionDepartment(res.result);
    });
  }, []);

  useEffect(() => {
    if (!Array.isArray(dataTable) || dataTable.length === 0) {
      setFinalDataList([]); // เคลียร์ค่าเป็น array ว่างถ้าไม่มีข้อมูล
      return;
    }

    const aggregatedData = dataTable.reduce((acc, curr) => {
      const deptName = curr.department_name?.trim() || "Unknown";
      const existing = acc.find((item) => item.department_name === deptName);
      if (existing) {
        existing.service_amount += 1;
        if (curr.service_type === "REST") existing.service_rest += 1;
        else if (curr.service_type === "WMS") existing.service_wms += 1;
        else if (curr.service_type === "GEOJSON") existing.service_geojson += 1;
      } else {
        acc.push({
          department_name: deptName,
          department_seq: curr.department_seq,
          service_data_type: curr.service_data_type,
          service_amount: 1,
          service_rest: curr.service_type === "REST" ? 1 : 0,
          service_wms: curr.service_type === "WMS" ? 1 : 0,
          service_geojson: curr.service_type === "GEOJSON" ? 1 : 0,
        });
      }

      return acc;
    }, []);
    const indexedData = aggregatedData.map((item, idx) => ({
      index: idx + 1,
      ...item,
    }));

    setFinalDataList(indexedData);
  }, [dataTable]);

  const onADM03GetDataList = () => {
    setLoading(true);
    ADM03GetDataList().then(
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
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.errors.message
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
        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );
  };

  const validation = (object) => {
    if (
      object.service_name === "" ||
      object.service_id === "" ||
      object.service_protocol === "" ||
      object.service_host === "" ||
      object.service_path === "" ||
      object.service_type === null ||
      object.service_method === null ||
      object.service_data_type === null ||
      object.department_seq === "-1" ||
      object.department_seq === -1 ||
      object.service_url === "" ||
      object.service_url === null ||
      object.service_url === undefined
    ) {
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
      ADM03CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "บันทึกข้อมูลการให้บริการ");
            // setDataTable(res.result);
            onADM03GetDataList();
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
      console.log("submitForm", submitForm);
      ADM03UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขข้อมูลการให้บริการ");
            // setDataTable(res.result);
            onADM03GetDataList();
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
  const onCreatePDFClick = async () => {
    let data = finalDataList || [];

    if (!Array.isArray(data) || data.length === 0) {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
      return;
    }

    let _arr = data.map((item, index) => [
      { text: index + 1, style: { alignment: "center", fontSize: 12 } },
      { text: item.department_name || "-", style: { fontSize: 12 } },
      { text: item.service_amount || "-", style: { fontSize: 12 } },
      {
        text: item.service_rest || "-",
        style: { alignment: "center", fontSize: 12 },
      },
      { text: item.service_wms || "-", style: { fontSize: 12 } },
      { text: item.service_geojson || "-", style: { fontSize: 12 } },
      {
        text: item.service_data_type || "-",
        style: { alignment: "center", fontSize: 12 },
      },
    ]);

    var content = {
      pageSize: "A4",
      pageOrientation: "landscape",
      content: [generateTableADM3(_arr)],
      pageMargins: [20, 20, 40, 40],
      style: "tableExample",
    };

    generatePdfOpenNewTab(true, content, () => {
      setLoading(false);
    });
  };
  const headerCells = [
    "ลำดับ",
    "หน่วยงาน",
    "ServiceAmount	",
    "REST API	",
    "WMS",
    " GEOJSON",
    " ประเภทข้อมูล",
  ];
  const onExportExcelClick = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;

    finalDataList.forEach((element) => {
      _exportData.push([
        index,
        element.department_name,
        element.service_amount,
        element.service_rest,
        element.service_wms,
        element.service_geojson,
        element.service_data_type,
      ]);
      index++;
    });
    // สร้าง worksheet
    const ws = XLSX.utils.json_to_sheet(_exportData);

    // เพิ่มหัวรายงาน
    const headerText = `รายงานกำหนดข้อมูลการให้บริการ ณ วันที่ ${formatDateTH_full2(
      new Date()
    )} เวลา 00:00 น. ถึง วันที่ ${formatDateTH_full2(new Date())}`;

    XLSX.utils.sheet_add_aoa(ws, [[headerText]], { origin: "A1" });
    // แถว 2: headerCells
    XLSX.utils.sheet_add_aoa(ws, [headerCells], { origin: "A2" });

    // แถว 3+: ข้อมูล
    XLSX.utils.sheet_add_aoa(ws, _exportData, { origin: "A3" });

    // Merge cell แถว 1
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headerCells.length - 1 } },
    ];

    // สร้าง workbook และ append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "รายงาน");

    // ดาวน์โหลดไฟล์
    const fileName = `ADM03-${new Date().getTime()}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setLoading(false);

    // let fileName = `ADM03-${new Date().getTime().toString()}.xlsx`;
    // let txtHead =
    //   "รายงานกำหนดข้อมูลการให้บริการ" +
    //   "\n" +
    //   "รายงาน ณ " +
    //   formatDateTH_full2(new Date(), true);
    // let json_data = {
    //   nameTemplate: "ADM03",
    //   namefileExport: fileName,
    //   sumCell: [false],
    //   footerCell: [false],
    //   list: [
    //     {
    //       headCell: ["A", 1, txtHead],
    //       dateCell: false,
    //       bodyCell: ["A", 4],
    //       sheetName: "รายงาน",
    //       data: _exportData,
    //     },
    //   ],
    // };

    // await masterGenSpreadsheet("spreadsheet", json_data).then((res) => {
    //   setLoading(false);
    //   let url = "";
    //   if (window.location.hostname.indexOf("localhost") !== -1) {
    //     url = `http://localhost:30004/export/downloadfile?filename=${fileName}`;
    //   } else {
    //     url = URL_API_EXPORT(`export/downloadfile?filename=${fileName}`);
    //   }
    //   fetch(url).then((response) => {
    //     response.blob().then((blob) => {
    //       let url = window.URL.createObjectURL(blob);
    //       let a = document.createElement("a");
    //       a.href = url;
    //       a.download = fileName;
    //       a.click();
    //     });
    //   });
    // });
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        <Toast ref={toast} position="top-right" />
        <CustomCard
          title={
            <PageHeader
              config={{
                title: "รายงานการใช้งาน Service ของหน่วยงาน",
                actionButton: (
                  <div>
                    <Button
                      style={{ height: "35px", color: "green" }}
                      label="ส่งออก Excel"
                      icon="pi pi-file-excel"
                      onClick={() => onExportExcelClick()}
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
          body={<DGR03List dataTable={finalDataList} />}
        />

        {/* <LPASM03Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={(e) => submitForm(e)}
          submitted={submitted}
          setSubmitted={setSubmitted}
          serviceOption={serviceOption}
          dataOption={dataOption}
          reqAndResList={reqAndResList}
          // setReqAndResList={setReqAndResList}
          onAddServiceReqAndRes={(a, b) => onAddServiceReqAndRes(a, b)}
          onUpdateServiceReqAndRes={(a, b) => onUpdateServiceReqAndRes(a, b)}
          onDeleteServiceReqAndRes={(a, b) => onDeleteServiceReqAndRes(a, b)}
          onRowReorder={onRowReorder}
          typeRequestResponse={typeRequestResponse}
          optionDepartment={optionDepartment}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          showMessages={showMessages}
          setDialogPDF={setDialogPDF}
        /> */}
      </div>
      {/* 
      <Dialog
        header={`${
          dialogPDF.formObject === undefined
            ? "PDF"
            : `JSON file ${dialogPDF.formObject.service_name} - ${dialogPDF.formObject.service_file_name}`
        }`}
        visible={dialogPDF.open}
        blockScroll={true}
        footer={renderFooter()}
        modal
        maximizable
        maximized
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
      </Dialog> */}
      {/* <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        textContent="คุณต้องการยกเลิกข้อมูล ใช่หรือไม่ ?"
      /> */}
    </div>
  );
}
