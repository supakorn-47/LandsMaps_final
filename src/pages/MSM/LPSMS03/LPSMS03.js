import React, { useEffect, useRef, useState } from "react";

import { getTextMenu } from "../../../utils/MenuUtil";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import Dashboards from "@highcharts/dashboards";
import { Card } from "primereact/card";
import { dataList } from "./data";
import LPSMS03List from "./LPSMS03List";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import LPSMS03Search from "./LPSMS03Search";

// import './chart.css';
// import DataGrid from '@highcharts/dashboards/datagrid';
// import LayoutModule from '@highcharts/dashboards/modules/layout';

// LayoutModule(Dashboards);

// Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
// Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

// Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
// Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

export default function LPSMS03() {
  const [dataTable, setDataTable] = useState([]);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    onGetDataList();
  }, []);

  const onGetDataList = () => {
    // let transfer_data_group_seq = "-1";
    // let index2 = 1;
    // if (selectedTF !== null && selectedTF !== "" && selectedTF !== undefined) {
    //     transfer_data_group_seq = "";
    //     selectedTF.forEach(element => {
    //         if (selectedTF.length === index2 || selectedTF.length === 1) {
    //             transfer_data_group_seq += element + ""
    //         } else {
    //             transfer_data_group_seq += element + ","
    //         }
    //         index2++
    //     });
    // }

    let temp = [];
    let index = 1;
    dataList.forEach((element) => {
      temp.push({
        ...element,
        index: index,
      });
      index++;
    });
    setDataTable(temp);
  };

  const options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    colors: ["#900091", "#909191", "#a4d3fd", "#195594"],
    xAxis: {
      categories: [
        "ข้อมูลเอกสารสิทธิที่ดิน + ข้อมูลผู้ถือกรรมสิทธิ์ (อ.ช.2)ประเมิน",
        "ข้อมูลตรวจสอบทรัพย์",
        "ข้อมูลเอกสารสิทธิที่ดิน + ข้อมูลผู้ถือกรรมสิทธิ์ (สิ่งปลูกสร้าง)",
      ],
      crosshair: true,
      accessibility: {
        description: "Countries",
      },
    },
    yAxis: {
      min: 10000,
      max: 100000,
      title: {
        text: "จำนวนการใช้งาน (ครั้ง)",
      },
    },
    tooltip: {
      valueSuffix: "",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "2565",
        data: [22000, 12000, 60000],
      },
      {
        name: "2566",
        data: [28000, 30000, 25000],
      },
      {
        name: "2567",
        data: [38774, 28000, 55000],
      },
      {
        name: "2568",
        data: [45321, 52000, 78000],
      },
    ],
  };

  const optionLineChart1 = {
    title: {
      text: "",
      align: "left",
    },

    subtitle: {
      text: "",
      align: "left",
    },

    yAxis: {
      title: {
        text: "จำนวนการใช้งาน (ครั้ง)",
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 2010 to 2022",
      },
    },

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
        pointStart: 2010,
      },
    },

    series: [
      {
        name: "ข้อมูลเอกสารสิทธิที่ดิน + ข้อมูลผู้ถือกรรมสิทธิ์ (อ.ช.2)",
        data: [
          43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
          161454, 154610, 168960, 171558,
        ],
      },
      {
        name: "ข้อมูลตรวจสอบทรัพย์",
        data: [
          24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
          31050, 33099, 33473,
        ],
      },
      {
        name: "ข้อมูลเอกสารสิทธิที่ดิน + ข้อมูลผู้ถือกรรมสิทธิ์ (สิ่งปลูกสร้าง)",
        data: [
          11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213,
          25663, 28978, 30618,
        ],
      },
      {
        name: "ข้อมูลเอกสารสิทธิที่ดิน + ข้อมูลผู้ถือกรรมสิทธิ์ (น.ส.3)",
        data: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          11164,
          11218,
          10077,
          12530,
          16585,
        ],
      },
      {
        name: "ข้อมูลเอกสารสิทธิที่ดิน + ข้อมูลผู้ถือกรรมสิทธิ์ (น.ส.3ก)",
        data: [
          21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
          10073, 11471, 11648,
        ],
      },
    ],

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
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ข้อมูลให้บริการ API Service",
            }}
          />
        }
        body={
          <LPSMS03Search
            startDate={searchData.startDate}
            endDate={searchData.endDate}
            onSearch={onGetDataList}
            setSearchData={searchData}
          />
        }
      />
      <CustomCard>
        <div className="">
          <HighchartsReact highcharts={Highcharts} options={optionLineChart1} />

          <LPSMS03List dataTable={dataTable} />
        </div>
      </CustomCard>
    </div>
  );
}
