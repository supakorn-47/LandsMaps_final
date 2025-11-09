import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Iframe from "react-iframe";
import CustomCard from "../../../components/CustomCard/CustomCard";
import ServiceLPADM05 from "../../../service/ServiceADM/ServiceLPADM05";
import PageHeader from "../../../components/PageHeader/PageHeader";
import {
  exportAsExcel,
  styleTextHeaders,
  styleHeaders,
  text_Right,
} from "../../../utils/dataHelpers";
import {
  generatePdfOpenNewTab,
  generateTableADM11,
  generateTableADM11Sum,
} from "../../../utils/PDFMakeUtil";

import LPADM05List from "./LPADM05List";
import { LPADM05ListSummary } from "./LPADM05ListSummary";
import LPADM05Search from "./LPADM05Search";

export default function LPADM05() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [graphData, setGraphData] = useState({
    categories: [],
    counts: [],
    pieTotal: 0,
  });
  const [dataTable, setDataTable] = useState([]);
  const [dataTableSummary, setDataTableSummary] = useState({
    header: [],
    datalist: [],
  });
  const [First, setFirst] = useState(0);
  const [Rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptMap, setDeptMap] = useState(new Map());
  const [searchData, setSearchData] = useState({
    request_dtm_from: new Date(),
    response_dtm_to: new Date(),
    register_type_seq: "",
    department_seq: 0,
    totalRecords: 0,
    pageofnum: 0,
    rowofpage: 10000,
  });

  useEffect(() => {
    loadDepartments();
    fetchAll(searchData);
  }, []);

  const extractArray = (res) => {
    if (Array.isArray(res?.data?.result)) return res.data.result;
    if (Array.isArray(res?.result)) return res.result;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data?.result?.datalist))
      return res.data.result.datalist;
    if (Array.isArray(res?.result?.datalist)) return res.result.datalist;
    return [];
  };

  const loadDepartments = async () => {
    try {
      const res = await ServiceLPADM05.GetDepartmentList({
        pageofnum: 0,
        rowofpage: 10000,
      });
      const list = res?.data?.result || res?.result || res?.data || res || [];
      const m = new Map();
      list.forEach((x) => {
        const key = Number(x?.department_seq || 0);
        const nameTH = x?.department_name_th;
        const name = nameTH || x?.department_name || `หน่วยงาน ${key}`;
        m.set(key, name);
      });
      setDeptMap(m);
    } catch {
      setDeptMap(new Map());
    }
  };

  const fetchAll = async (criteria) => {
    await Promise.all([
      fetchDashboardData(criteria),
      fetchTable(criteria),
      fetchSummary(criteria),
    ]);
  };

  const fetchTable = async (criteria) => {
    try {
      const res = await ServiceLPADM05.GetDataList(criteria);
      const list = extractArray(res);
      setDataTable(list);
      setTotalRecords(list.length || 0);
    } catch {
      setDataTable([]);
      setTotalRecords(0);
    }
  };

  const fetchSummary = async (criteria) => {
    try {
      const res = await (ServiceLPADM05.GetDataListSummary
        ? ServiceLPADM05.GetDataListSummary(criteria)
        : ServiceLPADM05.GetDataList(criteria));
      const result = res?.data?.result ||
        res?.result || { header: [], datalist: [] };
      setDataTableSummary({
        header: result?.header || [],
        datalist: result?.datalist || [],
      });
    } catch {
      setDataTableSummary({ header: [], datalist: [] });
    }
  };

  const fetchDashboardData = async (criteria) => {
    try {
      const res = await ServiceLPADM05.GetDataList(criteria);
      const list = extractArray(res);
      const map = new Map();
      for (const r of list) {
        const d = r.date ?? r.log_date ?? "ไม่ระบุ";
        const v = Number(r.total_usage ?? r.count ?? 0);
        map.set(d, (map.get(d) ?? 0) + v);
      }
      const categories = Array.from(map.keys());
      const counts = Array.from(map.values());
      const pieTotal = counts.reduce((a, b) => a + b, 0);
      setGraphData({ categories, counts, pieTotal });
    } catch {
      setGraphData({ categories: ["-"], counts: [0], pieTotal: 0 });
    }
  };

  const onSearch = () => {
    setFirst(0);
    const next = {
      ...searchData,
      department_seq: Number(searchData.department_seq || 0),
    };
    fetchAll(next);
  };

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
    const next = {
      ...searchData,
      department_seq: Number(searchData.department_seq || 0),
      pageofnum: e.first,
      rowofpage: e.rows,
      totalRecords: totalRecords,
    };
    fetchTable(next);
  };

  /** ✅ Excel Export */
  const onExportExcelClick = () => {
    const data = activeIndex === 1 ? dataTableSummary.datalist : dataTable;
    if (!data?.length) {
      alert("ไม่พบข้อมูลสำหรับส่งออก");
      return;
    }

    const sheetName = activeIndex === 1 ? "รายงานสรุป" : "รายงานประวัติ";
    const dataExcel = [];
    const title = [
      {
        text: `รายงาน${sheetName}การใช้งานระบบ\nระหว่างวันที่ ${searchData.request_dtm_from.toLocaleDateString(
          "th-TH"
        )} ถึง ${searchData.response_dtm_to.toLocaleDateString("th-TH")}`,
        style: styleTextHeaders,
      },
    ];

    dataExcel.push([{ value: title[0].text, style: styleTextHeaders }]);
    dataExcel.push([]);
    const headers = Object.keys(data[0]);
    const headerRow = headers.map((h) => ({
      value: h,
      style: styleHeaders,
    }));
    dataExcel.push(headerRow);

    data.forEach((row) => {
      const values = headers.map((key) => ({
        value: row[key],
        style: text_Right,
      }));
      dataExcel.push(values);
    });

    exportAsExcel(dataExcel, sheetName, [
      { s: { r: 2, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    ]);
  };

  /** ✅ PDF Export */
  const onCreatePDFClick = () => {
    const data = activeIndex === 1 ? dataTableSummary.datalist : dataTable;
    if (!data?.length) {
      alert("ไม่พบข้อมูลสำหรับส่งออก");
      return;
    }

    const content = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [20, 20, 40, 40],
      content: [
        activeIndex === 1
          ? generateTableADM11Sum(searchData, dataTableSummary)
          : generateTableADM11(searchData, data),
      ],
    };

    generatePdfOpenNewTab(true, content, (dataUrl) => {
      setDialogPDF({ open: true, pdfURL: dataUrl });
    });
  };

  const optionsLine = {
    chart: { type: "line" },
    title: { text: "" },
    xAxis: { categories: graphData.categories },
    yAxis: { title: { text: "จำนวนการเข้าใช้งาน" }, min: 0 },
    tooltip: { shared: true },
    legend: { enabled: true },
    series: [
      {
        name: "จำนวนการเข้าใช้งาน",
        data: graphData.counts,
        marker: { enabled: true },
      },
    ],
  };

  const optionsBar = {
    chart: { type: "column" },
    title: { text: "" },
    xAxis: { categories: graphData.categories },
    yAxis: { min: 0, title: { text: "จำนวนการเข้าใช้งาน" } },
    plotOptions: { column: { dataLabels: { enabled: true } } },
    tooltip: { shared: true },
    series: [{ name: "จำนวนการเข้าใช้งาน", data: graphData.counts }],
  };

  const optionsPie = {
    chart: { type: "pie" },
    title: { text: "" },
    tooltip: { pointFormat: "{series.name}: <b>{point.y}</b> ครั้ง" },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y} ครั้ง",
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "จำนวนรวม",
        colorByPoint: true,
        data: [{ name: "ทั้งหมด", y: graphData.pieTotal }],
      },
    ],
  };

  return (
    <div className="page-wrapper">
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ประวัติการใช้งานระบบ",
              // ✅ แสดงปุ่มเฉพาะตอนอยู่ Tab 1 หรือ 2 เท่านั้น
              actionButton: activeIndex > 0 && (
                <>
                  <Button
                    style={{ height: "35px", color: "green" }}
                    label="ส่งออก Excel"
                    icon="pi pi-file-excel"
                    onClick={() => onExportExcelClick()}
                    className="p-button-success p-button-rounded p-button-outlined"
                  />
                  <Button
                    style={{ height: "35px", marginLeft: "5px" }}
                    label="ส่งออก PDF"
                    icon="pi pi-file-pdf"
                    onClick={() => onCreatePDFClick()}
                    className="p-button-danger p-button-rounded p-button-outlined"
                  />
                </>
              ),
            }}
          />
        }
        body={
          <LPADM05Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={onSearch}
            registerType={[]}
            departments={departments}
          />
        }
      />

      <CustomCard>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          style={{ padding: "20px", borderRadius: "10px" }}
        >
          <TabPanel header="Dashboard">
            <div className="p-grid card">
              <div className="p-col-12">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={optionsLine}
                />
              </div>
              <div className="p-col-7" style={{ marginTop: 30 }}>
                <HighchartsReact highcharts={Highcharts} options={optionsBar} />
              </div>
              <div
                className="p-col-5"
                style={{ alignSelf: "center", marginTop: 30 }}
              >
                <HighchartsReact highcharts={Highcharts} options={optionsPie} />
              </div>
            </div>
          </TabPanel>

          <TabPanel header="ตารางสรุปประวัติการใช้งาน">
            <LPADM05ListSummary dataTableSummary={dataTableSummary} />
          </TabPanel>

          <TabPanel header="ตารางประวัติการใช้งาน">
            <LPADM05List
              dataTable={dataTable}
              onPageChange={onPageChange}
              First={First}
              Rows={Rows}
              totalRecords={totalRecords}
            />
          </TabPanel>
        </TabView>
      </CustomCard>

      {dialogPDF && (
        <Dialog
          header="PDF"
          visible={dialogPDF.open}
          blockScroll={true}
          maximized={true}
          onHide={() => setDialogPDF({ open: false, pdfURL: null })}
        >
          <Iframe
            url={dialogPDF.pdfURL}
            width="100%"
            height={window.innerHeight - 110}
            display="initial"
            position="relative"
          />
        </Dialog>
      )}
    </div>
  );
}
