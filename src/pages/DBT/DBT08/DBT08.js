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
import DBT08List from "./DBT08List";
// import LPASM03Dialog from "./LPASM03Dialog";

//SERVICE
import {
  ADM03GetDataList,
  ADM03CreateData,
  ADM03UpdateData,
} from "../../../service/ServiceADM/ServiceADM03";
import {
  masterService,
  // masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateTableADM3,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";

//EXCEL
// import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

// import {
//   strToArrBuffer,
//   excelSheetFromAoA,
//   excelSheetFromDataSet,
// } from "../../../utils/dataHelpers";
// import { URL_API_EXPORT } from "../../../service/Config";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function DBT08() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  const [finalDataList, setFinalDataList] = useState([]);

  useEffect(() => {
    onADM03GetDataList();

    // ประเภทผู้ใช้งาน
    masterService("GetTypeRequestResponse?mode=1", {}, "GET").then(
      (res) => {
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

    masterService(`GetDepartment?mode=1`, {}, "GET").then((res) => {});
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
    const sorted = indexedData.sort((a, b) => b - a);
    const topTen = sorted.slice(0, 10);
    setFinalDataList(topTen);
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
                title: "รายงานรายงานจัดอันดับการใช้บริการสูงสุด 10 อันดับ",
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
          body={<DBT08List dataTable={finalDataList} />}
        />
      </div>
    </div>
  );
}
