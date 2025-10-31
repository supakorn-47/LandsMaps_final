import React, { useEffect, useState, useRef, useMemo } from "react";
import DGR04Chart from "./DGR04Chart";
import DGR04Search from "./DGR04Search";
import { Toast } from "primereact/toast";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import * as XLSX from "xlsx";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
//PDF
import {
  generateTableDGR04,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";
import { Loading } from "../../../components/Loading/Loading";
import serviceData from "./dataList.json";
export default function DGR04() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDate, setSelectedDate] = useState({
    request_dtm_from: new Date(),
    response_dtm_to: new Date(),
  });
  const [filteredData, setFilteredData] = useState(serviceData);
  const [dataFilterDepartMent, setDataFilterDepartMent] = useState([]);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const onSearch = () => {
    const from = new Date(selectedDate.request_dtm_from);
    from.setHours(0, 0, 0, 0);
    const to = new Date(selectedDate.response_dtm_to);
    to.setHours(23, 59, 59, 999);

    const filtered = serviceData
      .map((dept) => {
        // กรอง service_rates ตามวันที่
        const filteredRates = dept.service_rates.filter((s) => {
          const d = new Date(s.date);

          return d >= from && d <= to;
        });

        return { ...dept, service_rates: filteredRates };
      })
      .filter((dept) => dept.service_rates.length > 0); // ลบ dept ที่ไม่มี service

    setFilteredData(filtered);
  };

  // กรองตามหน่วยงาน
  const filteredByDepartment = useMemo(() => {
    if (selectedDepartment === "all") {
      // รวม service_rates ทุก department

      const result = filteredData.map((dept) => ({
        ...dept,
        service_rates: dept.service_rates || [],
      }));
      // console.log(result);

      // setDataFilterDepartMent(result);
      return result;
    }
    const data = filteredData.filter(
      (dept) => dept.department_name_th === selectedDepartment
    );

    setDataFilterDepartMent(data);

    return data;
  }, [filteredData, selectedDepartment]);

  const allServices = filteredByDepartment.flatMap(
    (dept) => dept.service_rates
  );
  // console.log(allServices);

  const totalServices = allServices.length;
  const totalUsage = allServices.reduce(
    (sum, s) => sum + s.service_request_qty,
    0
  );
  const totalCost = allServices.reduce(
    (sum, s) => sum + s.sum_service_rate_amt,
    0
  );
  const averageCostPerService =
    totalServices > 0 ? totalCost / totalServices : 0;

  // const TOP_N = 10;
  // const topServices = [...allServices]
  //   .sort((a, b) => b.service_request_qty - a.service_request_qty)
  //   .slice(0, TOP_N);

  const departments = Array.from(
    new Set(serviceData.map((dept) => dept.department_name_th))
  ).map((name) => {
    const dept = serviceData.find((d) => d.department_name_th === name);
    return {
      department_name_th: dept?.department_name_th || "",
      department_name_en: dept?.department_name_en || "",
    };
  });

  useEffect(() => {
    onSearch(); // initial filter by date
  }, []);
  const headerCells = [
    "ลำดับ",
    "วันที่",
    "ชื่อบริการ",
    "ประเภทบริการ",
    "อัตราค่าบริการต่อหน่วย",
    "จำนวนที่ร้องขอ(request",
    "จำนวนสูงสุดที่ร้องขอได้(request max",
    "รวมค่าบริการ",
  ];
  const onExportExcelClick = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;
    const finalData = allServices;
    finalData.forEach((element) => {
      _exportData.push([
        index,
        element.date,
        element.service_name,
        element.service_type,
        element.service_rate_amt,
        element.service_request_qty,
        element.service_request_maxqty,
        element.sum_service_rate_amt,
      ]);
      index++;
    });
    // สร้าง worksheet
    const ws = XLSX.utils.json_to_sheet(_exportData);
    // เพิ่มข้อมูลกรองตามหน่วยงาน
    const departmentText = `หน่วยงานที่กรอง: ${
      selectedDepartment === "all" ? "ทั้งหมด" : selectedDepartment
    }`;
    // เพิ่มหัวรายงาน
    const headerText = `รายงานภาพรวมการให้บริการ ณ วันที่ ${formatDateTH_full2(
      selectedDate.request_dtm_from
    )} เวลา 00:00 น. ถึง วันที่ ${formatDateTH_full2(
      selectedDate.response_dtm_to
    )} \n${departmentText}`;

    // เพิ่มหัวรายงานและกรองตามหน่วยงาน
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
  const onCreatePDFClick = async () => {
    let data = allServices || [];

    if (!Array.isArray(data) || data.length === 0) {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
      return;
    }

    let _arr = data?.map((item, index) => [
      { text: index + 1, style: { alignment: "center", fontSize: 12 } },
      { text: item.date || "-", style: { fontSize: 12 } },
      { text: item.sum_service_rate_amt || "-", style: { fontSize: 12 } },
      { text: item.service_name || "-", style: { fontSize: 12 } },
      {
        text: item.service_rate_amt || "-",
        style: { alignment: "center", fontSize: 12 },
      },
      { text: item.service_request_qty || "-", style: { fontSize: 12 } },
      { text: item.service_request_maxqty || "-", style: { fontSize: 12 } },
      { text: item.sum_service_rate_amt || "-", style: { fontSize: 12 } },
    ]);

    var content = {
      pageSize: "A4",
      pageOrientation: "landscape",
      content: [generateTableDGR04(_arr)],
      pageMargins: [20, 20, 40, 40],
      style: "tableExample",
    };

    generatePdfOpenNewTab(true, content, () => {
      setLoading(false);
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
  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ภาพรวมการใช้งาน Service",
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
                    disabled={allServices?.length === 0}
                  />
                  <Button
                    style={{ height: "35px", marginLeft: "5px" }}
                    label="ส่งออก PDF"
                    icon="pi pi-file-pdf"
                    onClick={() => onCreatePDFClick()}
                    className="p-button-danger p-button-rounded p-button-outlined"
                    tooltip="คลิกเพื่อ ส่งออก PDF"
                    tooltipOptions={{ position: "top" }}
                    disabled={allServices?.length === 0}
                  />
                </div>
              ),
            }}
          />
        }
        body={
          <DGR04Search
            searchData={selectedDate}
            setSearchData={setSelectedDate}
            onSearch={onSearch}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departments={departments}
          />
        }
      />
      <CustomCard>
        <DGR04Chart
          averageCostPerService={averageCostPerService}
          totalCost={totalCost}
          totalServices={totalServices}
          totalUsage={totalUsage}
          allServices={allServices}
          selectedDepartment={selectedDepartment}
        />
      </CustomCard>
    </div>
  );
}
