import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
import DGR05List from "./DGR05List";
import DGR05Chart from "./DGR05Chart";
import { Button } from "primereact/button";
import { Loading } from "../../../components/Loading/Loading";
import mockDataQuest from "./mockDataQuest.json";

//PDF
import {
  generateTableDGR05,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import * as XLSX from "xlsx";

export default function DGR05() {
  const toast = useRef(null);
  const [questList, setQuestList] = useState();
  const [authToken, setAuthToken] = useState("");
  const [getResultQuestion, setGetResultQuestion] = useState(null);
  const [getDataID, setGetDataID] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataList = async () => {
      let Sequences = [];
      let index = 1;
      try {
        if (mockDataQuest) {
          mockDataQuest.result.forEach((element) => {
            Sequences.push({
              ...element,
              index: index,
            });
            index++;
          });

          setQuestList(Sequences);
        } else {
          const getToken = await axios.get("/myLandsApi/Auth/GetToken");
          const token = getToken?.data?.result;
          setAuthToken(token);

          const response = await axios.get("/myLandsApi/PublicSurvey/GetList", {
            headers: {
              Authorization: `Bearer ${token}`, // ใส่ token
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          });
          if (response) {
            (response?.data?.result).forEach((element) => {
              Sequences.push({
                ...element,
                index: index,
              });
              index++;
            });

            setQuestList(Sequences);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataList();
    setLoading(false);
  }, []);

  // mock data setData for chart
  useEffect(() => {
    if (getDataID) {
      setGetResultQuestion(getDataID);
    }
  }, [getDataID]);
  // useEffect(() => {
  //   if (!getDataID || !authToken) return;

  //   async function fetchDetails() {
  //     try {
  //       const response = await axios.post(
  //         "/myLandsApi/PublicSurvey/GetSummaryReport",
  //         { surveyId: getDataID },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${authToken}`,
  //             "Content-Type": "application/json",
  //             "Cache-Control": "no-cache",
  //           },
  //         }
  //         // )
  //       );
  //       if (response) {
  //         setGetResultQuestion(response?.data?.result);
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching question details:", error);
  //     }
  //   }
  //   fetchDetails();
  // }, [getDataID]);
  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };
  const onCreatePDFClick = async () => {
    let data = questList || [];

    if (!Array.isArray(data) || data.length === 0) {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
      return;
    }

    let _arr = data.map((item, index) => [
      { text: index + 1, style: { alignment: "center", fontSize: 12 } },
      { text: item.formDate || "-", style: { fontSize: 12 } },
      { text: item.formStartDate || "-", style: { fontSize: 12 } },
      {
        text: item.formFinishDate || "-",
        style: { alignment: "center", fontSize: 12 },
      },
      { text: item.formNameTh || "-", style: { fontSize: 12 } },
      { text: item.formNameEn || "-", style: { fontSize: 12 } },
    ]);

    var content = {
      pageSize: "A4",
      pageOrientation: "landscape",
      content: [generateTableDGR05(_arr)],
      pageMargins: [20, 20, 40, 40],
      style: "tableExample",
    };

    generatePdfOpenNewTab(true, content, () => {
      setLoading(false);
    });
  };
  const headerCells = [
    "ลำดับ",
    "วันที่สร้างแบบสำรวจ",
    "วันที่เริ่มต้นสำรวจ",
    "วันที่สิ้นสุดสำรวจ",
    "หัวข้อแบบสำรวจ(ภาษาไทย)",
    "หัวข้อแบบสำรวจ(ภาษาอังกฤษ)",
  ];
  const onExportExcelClick = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;

    questList.forEach((element) => {
      _exportData.push([
        index,
        element.formDate,
        element.formStartDate,
        element.formFinishDate,
        element.formNameTh,
        element.formNameEn,
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
  const handleBack = () => {
    setGetResultQuestion(null); // ล้าง chart → แสดง list
    setGetDataID(null); // reset id
  };
  // console.log(mockDataQuest);

  return (
    <div>
      <Loading loading={loading} />
      {getResultQuestion ? (
        <CustomCard
          title={
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button
                icon="pi pi-chevron-left"
                className="p-button-text p-button-secondary p-mb-3 custom-back-button"
                onClick={handleBack}
                text
                raised
              />
              <PageHeader
                config={{
                  title: `${getResultQuestion?.form_name_th} (${getResultQuestion?.form_name_en})`,
                }}
              />
            </div>
          }
          body={
            <DGR05Chart
              data={getResultQuestion ?? mockDataQuest?.result?.report}
            />
          }
        ></CustomCard>
      ) : (
        <CustomCard
          title={
            <PageHeader
              config={{
                title: "รายงานแบบประเมินความพึงพอใจ",
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
                      disabled={questList?.length === 0}
                    />
                    <Button
                      style={{ height: "35px", marginLeft: "5px" }}
                      label="ส่งออก PDF"
                      icon="pi pi-file-pdf"
                      onClick={() => onCreatePDFClick()}
                      className="p-button-danger p-button-rounded p-button-outlined"
                      tooltip="คลิกเพื่อ ส่งออก PDF"
                      tooltipOptions={{ position: "top" }}
                      disabled={questList?.length === 0}
                    />
                  </div>
                ),
              }}
            />
          }
          body={<DGR05List dataTable={questList} setGetDataID={setGetDataID} />}
        ></CustomCard>
      )}
    </div>
  );
}
