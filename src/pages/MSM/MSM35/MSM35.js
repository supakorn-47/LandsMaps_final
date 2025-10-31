import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Chart } from "primereact/chart";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { formatDateAPI, formatDateTH_full2 } from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";
//PAGE
import MSM35Search from "./MSM35Search";
import MSM35List from "./MSM35List";
import { MSM35Graph } from "./MSM35Graph";

//SERVICE
import MSM35Services from "../../../service/ServiceMSM/ServiceMSM35";
import { masterService } from "../../../service/ServiceMaster/MasterService";
import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";
import Highcharts from "highcharts";
import {
  generateHead_MSM35,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function MSM35() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataGraph, setDataGraph] = useState([]);
  const [dataGraphYears, setDataGraphYears] = useState([]);
  const [dataGraphDay, setDataGraphDay] = useState([]);
  const [searchData, setSearchData] = useState({
    year_start: "2566",
    year_end: "2566",
    table_name: "-1",
    graph_type: "MONTH",
    log_dtm: new Date(),
    source_schema: -1,
  });
  const [selectTableName, setSelectTableName] = useState([]);
  //YEAR,MONTH,DAY
  const [activeIndex, setActiveIndex] = useState(0);
  const [msDataTransferGroup, setMsDataTransferGroup] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [optionsYearByDay, setOptionsYearByDay] = useState();

  useEffect(() => {
    // onGetDataList(searchData, 0);
    onGetTransferDataGroup();
    onGetDataListDay();
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
    });
  };

  const onGetDataList = (body, index = 0) => {
    let table_name = "-1";
    let count = 0;
    if (selectTableName != undefined && selectTableName.length > 0) {
      table_name = "";
      selectTableName.forEach((element) => {
        if (
          selectTableName.length === count + 1 ||
          selectTableName.length === 1
        ) {
          table_name += element + "";
        } else {
          table_name += element + ",";
        }
        count++;
      });
    }
    let data = {};
    if (index === 1) {
      data = {
        year_start: body.year_start,
        year_end: body.year_start,
        table_name: table_name,
        graph_type: "MONTH",
      };
    } else if (index === 2) {
      data = {
        year_start: body.year_start,
        year_end: body.year_end,
        table_name: table_name,
        graph_type: "YEAR",
      };
    }

    setLoading(true);
    MSM35Services.GetDataList(data).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          // setDataTable(res.result.dataList)
          if (index === 1) {
            setDataGraph(res.result);
            setDataTable(res.result.dataMonthList);
          } else if (index === 2) {
            setDataTable(res.result.dataYearList);
            //! รายปี
            setDataGraphYears({
              chart: {
                type: "spline",
              },
              title: {
                text: `รายงานจำนวนข้อมูลและผลต่างข้อมูลรายปี ${body.year_start} ถึง ${body.year_end}`,
                align: "center",
              },
              yAxis: {
                title: {
                  text: "จำนวนข้อมูล",
                },
              },

              xAxis: res.result.categories,

              legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
              },

              plotOptions: {
                series: {
                  label: {
                    connectorAllowed: false,
                  },
                },
              },
              series: res.result.series,
              responsive: {
                rules: [
                  {
                    condition: {
                      maxWidth: 500,
                    },
                    chartOptions: {
                      legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "bottom",
                      },
                    },
                  },
                ],
              },
            });
          }
          setActiveIndex(index);
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

  const onGetDataListDay = (body = {}, index = 0) => {
    let table_name = "-1";
    let count = 0;
    if (selectTableName != undefined && selectTableName.length > 0) {
      table_name = "";
      selectTableName.forEach((element) => {
        if (
          selectTableName.length === count + 1 ||
          selectTableName.length === 1
        ) {
          table_name += element + "";
        } else {
          table_name += element + ",";
        }
        count++;
      });
    }

    setLoading(true);
    MSM35Services.GetDataListDay({
      log_dtm: formatDateAPI(searchData.log_dtm, false),
      table_name: table_name,
    }).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          setDataGraphDay(res.result);
          setDataTable(res.result.dataDayList);
          setActiveIndex(index);
          setOptionsYearByDay({
            chart: {
              zoomType: "xy",
              style: {
                fontFamily: "CSChatThaiUI",
              },
            },
            title: {
              text: `รายงานจำนวนข้อมูลและผลต่างข้อมูลรายวัน ${formatDateTH_full2(
                searchData.log_dtm
              )}`,
              align: "center",
            },
            xAxis: [
              {
                ...res.result.categories,
                crosshair: true,
              },
            ],
            yAxis: [
              {
                title: {
                  text: "ผลต่างข้อมูลเทียบวันก่อนหน้า",
                  style: {
                    color: Highcharts.getOptions().colors[1],
                  },
                },
                labels: {
                  format: "{value}",
                  style: {
                    color: Highcharts.getOptions().colors[1],
                  },
                },
                opposite: true,
                min: 0,
              },
              {
                title: {
                  text: "จำนวนข้อมูล",
                  style: {
                    color: Highcharts.getOptions().colors[1],
                  },
                },
                labels: {
                  format: "{value} bn",
                  style: {
                    color: Highcharts.getOptions().colors[1],
                  },
                  enabled: true,
                },
              },
            ],
            plotOptions: {
              series: {
                dataLabels: {
                  enabled: true,
                },
              },
            },
            tooltip: {
              shared: true,
            },
            legend: {
              align: "center",
              // x: 80,
              verticalAlign: "bottom",
              // y: 80,
              // floating: true,
              backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor ||
                "rgba(255,255,255,0.25)",
            },
            series: res.result.series,
          });
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

  //! TAB DEFAULT ON CLICK
  const onTabChangeClick = (index) => {
    if (index === 1) {
      let body = {
        // ...searchData,
        year_start: `${new Date().getFullYear() + 543}`,
        year_end: `${new Date().getFullYear() + 543}`,
        graph_type: "MONTH",
        table_name: "-1",
        source_schema: "-1",
      };
      onGetDataList(body, index);
      setSearchData(body);
    } else if (index === 2) {
      let body = {
        year_start: `${new Date().getFullYear() + 543 - 1}`,
        year_end: `${new Date().getFullYear() + 543}`,
        table_name: "-1",
        graph_type: "YEAR",
        source_schema: "-1",
      };
      onGetDataList(body, index);
      setSearchData(body);
    } else if (index === 0) {
      onGetDataListDay(
        {
          log_dtm: formatDateAPI(new Date()),
          table_name: -1 + "",
        },
        index
      );
      setSearchData({
        log_dtm: new Date(),
        table_name: -1 + "",
        source_schema: "-1",
      });
    }
    onGetTransferDataGroup();
    setSelectTableName([]);
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  // ! ##################################### EXCEL #####################################
  const onExportExcelClick = async () => {
    switch (activeIndex) {
      case 1:
        exportMonth("EXCEL");
        break;

      case 2:
        exprotYear("EXCEL");
        break;

      case 0:
        exportDay("EXCEL");
        break;

      default:
        break;
    }
  };
  //* เดือน
  const exportMonth = async (_TYPE = "") => {
    if (_TYPE === "EXCEL") {
      setLoading(true);
      let _exportData = [];
      let index = 1;
      dataTable.forEach((element) => {
        _exportData.push({
          index: element.rownum,
          table_name: element.table_name,

          m01_records: element.m01_records === null ? "-" : element.m01_records,
          m01_diff_lm: element.m01_diff_lm === null ? "-" : element.m01_diff_lm,

          m02_records: element.m02_records === null ? "-" : element.m02_records,
          m02_diff_lm: element.m02_diff_lm === null ? "-" : element.m02_diff_lm,

          m03_records: element.m03_records === null ? "-" : element.m03_records,
          m03_diff_lm: element.m03_diff_lm === null ? "-" : element.m03_diff_lm,

          m04_records: element.m04_records === null ? "-" : element.m04_records,
          m04_diff_lm: element.m04_diff_lm === null ? "-" : element.m04_diff_lm,

          m05_records: element.m05_records === null ? "-" : element.m05_records,
          m05_diff_lm: element.m05_diff_lm === null ? "-" : element.m05_diff_lm,

          m06_records: element.m06_records === null ? "-" : element.m06_records,
          m06_diff_lm: element.m06_diff_lm === null ? "-" : element.m06_diff_lm,

          m07_records: element.m07_records === null ? "-" : element.m07_records,
          m07_diff_lm: element.m07_diff_lm === null ? "-" : element.m07_diff_lm,

          m08_records: element.m08_records === null ? "-" : element.m08_records,
          m08_diff_lm: element.m08_diff_lm === null ? "-" : element.m08_diff_lm,

          m09_records: element.m09_records === null ? "-" : element.m09_records,
          m09_diff_lm: element.m09_diff_lm === null ? "-" : element.m09_diff_lm,

          m10_records: element.m10_records === null ? "-" : element.m10_records,
          m10_diff_lm: element.m10_diff_lm === null ? "-" : element.m10_diff_lm,

          m11_records: element.m11_records === null ? "-" : element.m11_records,
          m11_diff_lm: element.m11_diff_lm === null ? "-" : element.m11_diff_lm,

          m12_records: element.m12_records === null ? "-" : element.m12_records,
          m12_diff_lm: element.m12_diff_lm === null ? "-" : element.m12_diff_lm,
        });
        index++;
      });

      let fileName = `MSM35_Month-${new Date().getTime().toString()}.xlsx`;
      let txtHead = `รายงานจำนวนข้อมูลและผลต่างข้อมูลรายเดือน ปี ${searchData.year_start}`;
      let json_data = {
        nameTemplate: "MSM35_Month",
        namefileExport: fileName,
        sumCell: [false],
        footerCell: [false],
        list: [
          {
            headCell: ["A", 1, txtHead],
            dateCell: false,
            bodyCell: ["A", 5],
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
    } else if (_TYPE === "PDF") {
      let data = dataTable;
      let _arr = [];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          _arr.push([
            // {
            //     text: data[i].index,
            //     style: { alignment: "center", fontSize: 12 }
            // },
            // {
            //     text: data[i].error_question_date,
            //     style: { alignment: "center", fontSize: 12 }
            // },
            // {
            //     text: data[i].agency_name,
            //     style: { fontSize: 12 }
            // },
            // {
            //     text: data[i].register_name,
            //     style: { fontSize: 12 }
            // },
            // {
            //     text: data[i].landoffice_name,
            //     style: { fontSize: 12 }
            // },
            // {
            //     text: data[i].error_type_name,
            //     style: { alignment: "center", fontSize: 12 }
            // },
            // {
            //     text: data[i].error_question_subject,
            //     style: { fontSize: 12 }
            // },
            // {
            //     text: data[i].error_type_desc,
            //     style: { fontSize: 12 }
            // },
            // {
            //     text: data[i].error_question_status,
            //     style: { fontSize: 12 }
            // },
          ]);
        }
        var content = {
          pageSize: "A3",
          pageOrientation: "landscape",
          content: [generateHead_MSM35()],
          pageMargins: [20, 20, 40, 40],
          style: "tableExample",
        };
        generatePdfOpenNewTab(true, content, (dataUrl) => {
          setLoading(false);
        });
      } else {
        showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
        setLoading(false);
      }
    }
  };
  //* ปี
  const exprotYear = async () => {
    setLoading(true);
    let dataExportFinal = [];
    let fileName = `MSM35_Year-${new Date().getTime().toString()}.xlsx`;

    dataTable.forEach((list) => {
      let _exportData = [];
      let txtHead = `รายงานจำนวนข้อมูลและผลต่างข้อมูล ปี ${list.head_name}`;

      list.subList.forEach((element) => {
        _exportData.push({
          index: element.rownum,
          table_name: element.table_name,

          m01_records: element.m01_records === null ? "-" : element.m01_records,
          m01_diff_lm: element.m01_diff_lm === null ? "-" : element.m01_diff_lm,

          m02_records: element.m02_records === null ? "-" : element.m02_records,
          m02_diff_lm: element.m02_diff_lm === null ? "-" : element.m02_diff_lm,

          m03_records: element.m03_records === null ? "-" : element.m03_records,
          m03_diff_lm: element.m03_diff_lm === null ? "-" : element.m03_diff_lm,

          m04_records: element.m04_records === null ? "-" : element.m04_records,
          m04_diff_lm: element.m04_diff_lm === null ? "-" : element.m04_diff_lm,

          m05_records: element.m05_records === null ? "-" : element.m05_records,
          m05_diff_lm: element.m05_diff_lm === null ? "-" : element.m05_diff_lm,

          m06_records: element.m06_records === null ? "-" : element.m06_records,
          m06_diff_lm: element.m06_diff_lm === null ? "-" : element.m06_diff_lm,

          m07_records: element.m07_records === null ? "-" : element.m07_records,
          m07_diff_lm: element.m07_diff_lm === null ? "-" : element.m07_diff_lm,

          m08_records: element.m08_records === null ? "-" : element.m08_records,
          m08_diff_lm: element.m08_diff_lm === null ? "-" : element.m08_diff_lm,

          m09_records: element.m09_records === null ? "-" : element.m09_records,
          m09_diff_lm: element.m09_diff_lm === null ? "-" : element.m09_diff_lm,

          m10_records: element.m10_records === null ? "-" : element.m10_records,
          m10_diff_lm: element.m10_diff_lm === null ? "-" : element.m10_diff_lm,

          m11_records: element.m11_records === null ? "-" : element.m11_records,
          m11_diff_lm: element.m11_diff_lm === null ? "-" : element.m11_diff_lm,

          m12_records: element.m12_records === null ? "-" : element.m12_records,
          m12_diff_lm: element.m12_diff_lm === null ? "-" : element.m12_diff_lm,
        });
      });

      let jsonlist = {
        headCell: ["A", 1, txtHead],
        dateCell: false,
        bodyCell: ["A", 5],
        sheetName: `${list.head_name}`,
        data: _exportData,
      };
      dataExportFinal.push(jsonlist);
    });

    let json_data = {
      nameTemplate: "MSM35_Year",
      namefileExport: fileName,
      sumCell: [false],
      footerCell: [false],
      list: dataExportFinal,
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
  //* วัน
  const exportDay = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;
    dataTable.forEach((element) => {
      _exportData.push({
        index: element.rownum,
        table_name: element.table_name,

        h01_records: element.h01_records === null ? "-" : element.h01_records,
        h01_diff_lh: element.h01_diff_lh === null ? "-" : element.h01_records,

        h02_records: element.h02_records === null ? "-" : element.h02_records,
        h02_diff_lh: element.h02_diff_lh === null ? "-" : element.h02_diff_lh,

        h03_records: element.h03_records === null ? "-" : element.h03_records,
        h03_diff_lh: element.h03_diff_lh === null ? "-" : element.h03_diff_lh,

        h04_records: element.h04_records === null ? "-" : element.h04_records,
        h04_diff_lh: element.h04_diff_lh === null ? "-" : element.h04_diff_lh,

        h05_records: element.h05_records === null ? "-" : element.h05_records,
        h05_diff_lh: element.h05_diff_lh === null ? "-" : element.h05_diff_lh,

        h06_records: element.h06_records === null ? "-" : element.h06_records,
        h06_diff_lh: element.h06_diff_lh === null ? "-" : element.h06_diff_lh,

        h07_records: element.h07_records === null ? "-" : element.h07_records,
        h07_diff_lh: element.h07_diff_lh === null ? "-" : element.h07_diff_lh,

        h08_records: element.h08_records === null ? "-" : element.h08_records,
        h08_diff_lh: element.h08_diff_lh === null ? "-" : element.h08_diff_lh,

        h09_records: element.h09_records === null ? "-" : element.h09_records,
        h09_diff_lh: element.h09_diff_lh === null ? "-" : element.h09_diff_lh,

        h10_records: element.h10_records === null ? "-" : element.h10_records,
        h10_diff_lh: element.h10_diff_lh === null ? "-" : element.h10_diff_lh,

        h11_records: element.h11_records === null ? "-" : element.h11_records,
        h11_diff_lh: element.h11_diff_lh === null ? "-" : element.h11_diff_lh,

        h12_records: element.h12_records === null ? "-" : element.h12_records,
        h12_diff_lh: element.h12_diff_lh === null ? "-" : element.h12_diff_lh,

        h13_records: element.h13_records === null ? "-" : element.h13_records,
        h13_diff_lh: element.h13_diff_lh === null ? "-" : element.h13_diff_lh,

        h14_records: element.h14_records === null ? "-" : element.h14_records,
        h14_diff_lh: element.h14_diff_lh === null ? "-" : element.h14_diff_lh,

        h15_records: element.h15_records === null ? "-" : element.h15_records,
        h15_diff_lh: element.h15_diff_lh === null ? "-" : element.h15_diff_lh,

        h16_records: element.h16_records === null ? "-" : element.h16_records,
        h16_diff_lh: element.h16_diff_lh === null ? "-" : element.h16_diff_lh,

        h17_records: element.h17_records === null ? "-" : element.h17_records,
        h17_diff_lh: element.h17_diff_lh === null ? "-" : element.h17_diff_lh,

        h18_records: element.h18_records === null ? "-" : element.h18_records,
        h18_diff_lh: element.h18_diff_lh === null ? "-" : element.h18_diff_lh,

        h19_records: element.h19_records === null ? "-" : element.h19_records,
        h19_diff_lh: element.h19_diff_lh === null ? "-" : element.h19_diff_lh,

        h20_records: element.h20_records === null ? "-" : element.h20_records,
        h20_diff_lh: element.h20_diff_lh === null ? "-" : element.h20_diff_lh,

        h21_records: element.h21_records === null ? "-" : element.h21_records,
        h21_diff_lh: element.h21_diff_lh === null ? "-" : element.h21_diff_lh,

        h22_records: element.h22_records === null ? "-" : element.h22_records,
        h22_diff_lh: element.h22_diff_lh === null ? "-" : element.h22_diff_lh,

        h23_records: element.h23_records === null ? "-" : element.h23_records,
        h23_diff_lh: element.h23_diff_lh === null ? "-" : element.h23_diff_lh,

        h24_records: element.h24_records === null ? "-" : element.h24_records,
        h24_diff_lh: element.h24_diff_lh === null ? "-" : element.h24_diff_lh,
      });
      index++;
    });

    let fileName = `MSM35_Day-${new Date().getTime().toString()}.xlsx`;
    let txtHead = `รายงานจำนวนข้อมูลและผลต่างข้อมูล ${formatDateTH_full2(
      searchData.log_dtm
    )}`;
    let json_data = {
      nameTemplate: "MSM35_Day",
      namefileExport: fileName,
      sumCell: [false],
      footerCell: [false],
      list: [
        {
          headCell: ["A", 1, txtHead],
          dateCell: false,
          bodyCell: ["A", 5],
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

  // ! ##################################### PDF #####################################
  const onExportPDFClick = async () => {
    switch (activeIndex) {
      case 1:
        exportMonth("PDF");
        break;

      case 2:
        exprotYear("PDF");
        break;

      case 0:
        exportDay("PDF");
        break;

      default:
        break;
    }
  };

  return (
    // รายงานจำนวนข้อมูลและผลต่าง
    <div className="page-wrapper">
      <Loading loading={loading} />

      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "รายงานจำนวนข้อมูลและผลต่าง",
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
                  />
                  {/* <Button style={{ height: '35px', marginLeft: '5px' }} label="ส่งออก PDF" icon="pi pi-file-pdf" onClick={() => onExportPDFClick()} className="p-button-danger p-button-rounded p-button-outlined" tooltip="คลิกเพื่อ ส่งออก PDF" tooltipOptions={{ position: 'top' }} /> */}
                </div>
              ),
            }}
          />
        }
        body={
          <MSM35Search
            searchData={searchData}
            setSearchData={setSearchData}
            activeIndex={activeIndex}
            onGetDataList={onGetDataList}
            onGetDataListDay={onGetDataListDay}
            submitted={submitted}
            msDataTransferGroup={msDataTransferGroup}
            onGetTransferDataGroup={onGetTransferDataGroup}
            setSelectTableName={setSelectTableName}
            selectTableName={selectTableName}
          />
        }
      />

      <CustomCard>
        <MSM35Graph
          dataGraph={dataGraph}
          activeIndex={activeIndex}
          onTabChangeClick={onTabChangeClick}
          dataGraphYears={dataGraphYears}
          searchData={searchData}
          dataTable={dataTable}
          dataGraphDay={dataGraphDay}
          optionsYearByDay={optionsYearByDay}
        />
      </CustomCard>
    </div>
  );
}
