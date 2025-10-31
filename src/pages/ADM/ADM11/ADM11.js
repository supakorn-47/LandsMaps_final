import React, { useEffect, useState, useRef, useMemo } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Loading } from "../../../components/Loading/Loading";
import {
  formatDateTH,
  formatDateTH_full2,
  formatDateTH2,
} from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import ADM11Search from "./ADM11Search";
import ADM11List from "./ADM11List";
import ADM11ListSummary from "./ADM11ListSummary";
import { Dashboard } from "./Dashboard";

//SERVICE
import ServiceADM11 from "../../../service/ServiceADM/ServiceADM11";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";

//PDF
import {
  generatePdfOpenNewTab,
  generateTableADM11,
  generateTableADM11Sum,
} from "../../../utils/PDFMakeUtil";

import {
  exportAsExcel,
  styleTextHeaders,
  styleHeaders,
  text_Default,
  text_Center,
  text_Right,
} from "../../../utils/dataHelpers";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
// import Highcharts from "highcharts/highstock";
// import HighchartsReact from "highcharts-react-official";
// import HighchartsExporting from 'highcharts/modules/exporting'

var d = new Date();
d.setFullYear(2564);
const dataList = [
  {
    date: "2025-07-02T00:00:00.000Z",
    myLand: 1000,
    searchMyLand: 870,
    news: 450,
    satisfactionSurvey: 200,
    landDetail: 4000,
  },
  {
    date: "2025-07-09T00:00:00.000Z",
    myLand: 1240,
    searchMyLand: 500,
    news: 1000,
    satisfactionSurvey: 300,
    landDetail: 564,
  },
  {
    date: "2025-07-16T00:00:00.000Z",
    myLand: 4000,
    searchMyLand: 1203,
    news: 345,
    satisfactionSurvey: 400,
    landDetail: 445,
  },
  {
    date: "2025-07-23T00:00:00.000Z",
    myLand: 500,
    searchMyLand: 700,
    news: 675,
    satisfactionSurvey: 5000,
    landDetail: 455,
  },
  {
    date: "2025-07-27T00:00:00.000Z",
    myLand: 500,
    searchMyLand: 2000,
    news: 500,
    satisfactionSurvey: 500,
    landDetail: 500,
  },
];

export default function ADM11() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableSummary, setDataTableSummary] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [loading, setLoading] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [registerType, setRegisterType] = useState([]);
  const [First, setFirst] = useState(0);
  const [Rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [graphData, setGraphData] = useState({});

  // SEARCH
  let date = new Date();
  date.setDate(date.getDate() - 7);
  const [searchData, setSearchData] = useState({
    request_dtm_from: date,
    response_dtm_to: new Date(),
    register_type_seq: -1,
    totalRecords: 0,
    pageofnum: 0,
    rowofpage: 10000,
  });

  const onADM11GetDataList = (object) => {
    setLoading(true);
    setFirst(0);
    setRows(10);
    ServiceADM11.GetDataList(object).then(
      (res) => {
        //กราฟวงกลม
        let indexPie = 0;
        let _arrPie = [];
        res.result.pie_series.labels.forEach((element) => {
          _arrPie.push({
            name: element,
            y: res.result.pie_series.datasets[0].data[indexPie],
          });
          indexPie++;
        });

        //กราฟแท่ง
        let _arrBar = [];
        res.result.bar_series.datasets.forEach((element, i) => {
          let colorList = [
            "#64E572",
            "#ED561B",
            "#24CBE5",
            "#FF9655",
            "#8085e9",
            "#6AF9C4",
          ];
          _arrBar.push({
            name: element.label,
            data: element.data,
            color: colorList[i],
          });
        });

        let categories = [];
        categories = res.result.bar_series.labels;

        //กราฟเส้น
        let _arrLine = [];
        res.result.chart_series.datasets.forEach((element, i) => {
          let borderList = [
            "#64E572",
            "#ED561B",
            "#24CBE5",
            "#FF9655",
            "#8085e9",
            "#6AF9C4",
          ];
          let bgList = [
            "#64e5721f",
            "#ed561b30",
            "#24cbe51f",
            "#ff965524",
            "#8085e917",
            "#6af9c424",
          ];
          _arrLine.push({
            ...element,
            backgroundColor: bgList[i],
            borderColor: borderList[i],
          });
        });
        let _newLine = { ...res.result.chart_series, datasets: _arrLine };

        setGraphData({
          ...res.result,
          newDataPie: _arrPie,
          newDataBar: _arrBar,
          categories: categories,
          chart_series: _newLine,
        });

        if (res.status === 200) {
          let temp = [];
          let index = 1;
          // res.result.datalist.forEach((element) => {
          //   temp.push({
          //     ...element,
          //     index: index,
          //   });
          //   index++;
          // });
          dataList.forEach((element) => {
            temp.push({
              ...element,
              index: index,
            });
            index++;
          });
          setDataTable(temp);
          setDataTableReport(
            res.result.datalist.sort((a, b) =>
              new Date(a) < new Date(b) ? 1 : -1
            )
          );
          onGetDataListSummary();
          // setTotalRecords(res.totalRecords); //จำนวนรายการ
          setTotalRecords(dataList.length);
          setLoading(false);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด GetDataList`,
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
          showMessages(
            "error",
            `เกิดข้อผิดพลาด GetDataList`,
            `${JSON.stringify(err.response.data)}`
          );
        }
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    onADM11GetDataList(searchData);

    masterService("GetRegisterType?mode=0", {}, "GET").then(
      (res) => {
        setRegisterType(res.result);
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด GetRegisterType`,
          `${JSON.stringify(err.response.data)}`
        );
      }
    );

    // onGetDataListSummary();
  }, []);

  const onGetDataListSummary = () => {
    setLoading(true);
    ServiceADM11.GetDataListSummary(searchData).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          // let temp = [];
          // let index = 1;
          // console.log("res.result:", res.result);
          // res.result.datalist.forEach((element) => {
          //   temp.push({
          //     ...element,
          //     index: index,
          //   });
          //   index++;
          // });

          // res.result.datalist = temp;

          const availableResult = {
            ...res.result,
            datalist:
              res.result.datalist.map((data, idx) => ({
                index: idx + 1,
                ...data,
              })) || [],
          };

          // console.log("availableResult:", availableResult);

          setDataTableSummary(availableResult);
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

  //Nextpage
  const onPageChange = (e) => {
    setLoading(true);
    setFirst(e.first);
    setRows(e.rows);
    let search_data = {
      ...searchData,
      pageofnum: e.first,
      rowofpage: e.rows,
      totalRecords: totalRecords,
    };

    ServiceADM11.GetDataList(search_data).then(
      (res) => {
        if (res.status === 200) {
          // setDataTable(res.result.datalist);
          setDataTable(dataList);

          setLoading(false);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด GetDataList`,
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
          showMessages(
            "error",
            `เกิดข้อผิดพลาด GetDataList`,
            `${JSON.stringify(err.response.data)}`
          );
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
    if (activeIndex === 1) {
      console.log("else export:", dataTableSummary);
      if (dataTableSummary.datalist.length > 0) {
        var content = {
          pageSize: "A4",
          pageOrientation: "landscape",
          content: [generateTableADM11Sum(searchData, dataTableSummary)],
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
    } else {
      // setLoading(true)
      let data = dataTableReport;
      let _arr = [];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let data_status =
            data[i].response_status == 1 ? "ติดต่อได้" : "ติดต่อไม่ได้";
          _arr.push([
            {
              text: i + 1,
              style: { alignment: "center", fontSize: 12 },
            },
            {
              text: formatDateTH(data[i].log_user_dtm, true),
              style: { alignment: "center", fontSize: 12 },
            },
            {
              text: data[i].ip_address,
              style: { alignment: "center", fontSize: 12 },
            },
            {
              text: data[i].personal_nameth,
              style: { fontSize: 12 },
            },
            {
              text: data[i].register_type_name,
              style: { fontSize: 12 },
            },
            {
              text: data[i].department_name,
              style: { fontSize: 12 },
            },
            {
              text: data_status,
              style: { alignment: "center", fontSize: 12 },
            },
          ]);
        }
        var content = {
          pageSize: "A4",
          pageOrientation: "landscape",
          content: [generateTableADM11(searchData, _arr)],
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
    }
  };

  const onExportExcelClick = async () => {
    if (activeIndex === 1) {
      setLoading(true);
      // let dataRow = dataTable
      let dataExcel = [];
      let headerText = [
        {
          text:
            "รายงานสรุปประวัติการใช้งานระบบ\n" +
            formatDateTH_full2(searchData.request_dtm_from, true) +
            " ถึง " +
            formatDateTH_full2(searchData.response_dtm_to, true),
          style: styleTextHeaders,
        },
        {
          text: "",
          style: styleTextHeaders,
        },
      ];
      for (let i = 0; i < headerText.length; i++) {
        dataExcel.push([
          { value: headerText[i].text, style: headerText[i].style },
        ]);
      }
      dataExcel.push([]);
      dataExcel.push([]);
      let _headerCol = [];
      _headerCol.push({
        value: "ลำดับ",
        style: styleHeaders,
      });
      dataTableSummary.header.forEach((element) => {
        _headerCol.push({
          value: element,
          style: styleHeaders,
        });
      });
      dataExcel.push(_headerCol);
      let _Textarr = [];
      let index = 0;
      dataTableSummary.datalist.forEach((element) => {
        index = 0;
        _Textarr = [
          {
            value: element.index,
            style: text_Center,
          },
        ];
        for (var key in element) {
          if (key === "data_0") {
            _Textarr.push({
              value: element[key],
              style: text_Center,
            });
          } else if (key !== "index") {
            _Textarr.push({
              value: element[key],
              style: text_Right,
            });
          }
          index++;
        }
        dataExcel.push(_Textarr);
      });
      exportAsExcel(dataExcel, "ADM11", [
        { s: { r: 3, c: 0 }, e: { r: 0, c: _headerCol.length - 1 } },
      ]);
      setLoading(false);
    } else {
      setLoading(true);
      let _exportData = [];
      let index = 1;
      dataTableReport.forEach((element) => {
        let data_status =
          element.response_status == 1 ? "ติดต่อได้" : "ติดต่อไม่ได้";
        _exportData.push({
          index: index,
          log_user_dtm: formatDateTH(element.log_user_dtm, true),
          ip_address:
            element.ip_address === undefined ? "" : element.ip_address,
          personal_nameth:
            element.personal_nameth === undefined
              ? ""
              : element.personal_nameth,
          register_type_name:
            element.register_type_name === undefined
              ? ""
              : element.register_type_name,
          department_name:
            element.department_name === undefined
              ? ""
              : element.department_name,
          data_status: data_status,
        });
        index++;
      });

      let fileName = `ADM11-${new Date().getTime().toString()}.xlsx`;
      let txtHead =
        "รายงานตรวจสอบประวัติการใช้งานระบบ" +
        "\n" +
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.response_dtm_to, true);
      let json_data = {
        nameTemplate: "ADM11",
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
    }
  };

  const onExportWordClick = async () => {
    if (activeIndex === 1) {
      let _exportData = [];
      let index = 1;
      dataTableSummary.datalist.forEach((element) => {
        _exportData.push({
          d1: index,
          d2: element.data_0,
          d3: element.data_1,
          d4: element.data_2,
          d5: element.data_3,
          d6: element.data_5,
          d7: element.data_4,
          d8: element.data_6,
          d9: element.data_30,
        });
        index++;
      });

      let fileName = `ADM11-${new Date().getTime().toString()}.docx`;
      let txtHead =
        "รายงานสรุปประวัติการใช้งานระบบ" +
        "\n" +
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.response_dtm_to, true);
      let json_data = {
        nameTemplate: "ADM11_Sum.docx",
        nameFile: fileName,
        data: {
          header: txtHead,
          t: _exportData,
        },
      };
      await masterGenSpreadsheet("docxtemplater", json_data).then((res) => {
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
    } else {
      let _exportData = [];
      let index = 1;
      dataTable.forEach((element) => {
        let data_status =
          element.response_status == 1 ? "ติดต่อได้" : "ติดต่อไม่ได้";
        _exportData.push({
          d1: index,
          d2: formatDateTH(element.log_user_dtm, true),
          d3: element.ip_address === null ? "" : element.ip_address,
          d4: element.personal_nameth === null ? "" : element.personal_nameth,
          d5:
            element.register_type_name === null
              ? ""
              : element.register_type_name,
          d6: element.department_name === null ? "" : element.department_name,
          d7: data_status,
        });
        index++;
      });

      let fileName = `ADM11-${new Date().getTime().toString()}.docx`;
      let txtHead =
        "รายงานตรวจสอบประวัติการใช้งานระบบ" +
        "\n" +
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.response_dtm_to, true);
      let json_data = {
        nameTemplate: "ADM11.docx",
        nameFile: fileName,
        data: {
          header: txtHead,
          t: _exportData,
        },
      };
      await masterGenSpreadsheet("docxtemplater", json_data).then((res) => {
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
    }
  };

  const availableExportedData = useMemo(() => {
    if (activeIndex === 1) {
      return dataTableSummary?.datalist?.length > 0;
    } else if (activeIndex === 2) {
      return dataTableReport?.length > 0;
    }
  }, [activeIndex]);

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ประวัติการใช้งานระบบ",
              actionButton: (
                <div>
                  <>
                    <Button
                      style={{ height: "35px", color: "green" }}
                      label={`ส่งออก Excel`}
                      icon="pi pi-file-excel"
                      onClick={() => onExportExcelClick()}
                      className="p-button-info p-button-rounded p-button-outlined"
                      tooltip={`คลิกเพื่อ ส่งออก${
                        activeIndex === 1 ? "รายงานสรุป" : "รายงานประวัติ"
                      } Excel (ข้อมูลไม่เกิน 10,000 รายการ)`}
                      tooltipOptions={{
                        position: "top",
                        className: "custom-tooltip",
                      }}
                      // disabled={!availableExportedData}
                    />
                    <Button
                      style={{ height: "35px", marginLeft: "5px" }}
                      label={`ส่งออก PDF`}
                      icon="pi pi-file-pdf"
                      onClick={() => onCreatePDFClick()}
                      className="p-button-danger p-button-rounded p-button-outlined"
                      tooltip={`คลิกเพื่อ ส่งออก${
                        activeIndex === 1 ? "รายงานสรุป" : "รายงานประวัติ"
                      } PDF (ข้อมูลไม่เกิน 10,000 รายการ)`}
                      tooltipOptions={{
                        position: "top",
                        className: "custom-tooltip",
                      }}
                      // disabled={!availableExportedData}
                    />
                    {/* <Button
                        style={{
                          height: "35px",
                          marginLeft: "5px",
                          color: "blue",
                        }}
                        label={`ส่งออก Word`}
                        icon="pi pi-file"
                        onClick={() => onExportWordClick()}
                        className="p-button p-button-rounded p-button-outlined"
                        tooltip={`คลิกเพื่อ ส่งออก${
                          activeIndex === 1 ? "รายงานสรุป" : "รายงานประวัติ"
                        } Word (ข้อมูลไม่เกิน 10,000 รายการ)`}
                        tooltipOptions={{
                          position: "top",
                          className: "custom-tooltip",
                        }}
                        disabled={!availableExportedData}
                      /> */}
                  </>
                </div>
              ),
            }}
          />
        }
        body={
          <ADM11Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onADM11GetDataList(searchData)}
            registerType={registerType}
          />
        }
      />

      {/* <div className='layout-dashboard'>
                        <div className="p-grid">
                            <div className='p-col-3'>
                                <div class="overview-box sales" onClick={()=> setActiveIndex(1)}>
                                    <i class="overview-icon pi pi-list"></i>
                                    <span class="overview-title">จำนวนข้อมูลทั้งหมด</span>
                                    <div class="overview-numbers">{`${dataTable.length} รายการ`}</div>
                                </div>
                            </div>
                            <div className='p-col-3'>
                                <div class="overview-box views">
                                    <i class="overview-icon pi pi-desktop"></i>
                                    <span class="overview-title">จำนวนหน่วยงานทั้งหมด</span>
                                    <div class="overview-numbers">4 หน่วยงาน</div>
                                </div>
                            </div>
                        </div>
                    </div> */}

      <CustomCard>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="Dashboard">
            <Dashboard graphData={graphData} />
          </TabPanel>
          {/* <TabPanel header="ตารางสรุปประวัติการใช้งาน">
            <ADM11ListSummary
              dataTableSummary={dataTableSummary}
              setDialog={setDialog}
            />
          </TabPanel> */}
          <TabPanel header="ตารางประวัติการใช้งาน">
            <ADM11List
              dataTable={dataTable}
              // setDialog={setDialog}
              onPageChange={(e) => onPageChange(e)}
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
