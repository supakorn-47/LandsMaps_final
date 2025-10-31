import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import ServiceLPADM05 from "../../../service/ServiceADM/ServiceLPADM05";

export default function LPADM05() {
  const [graphData, setGraphData] = useState({
    chart_series: { labels: [], datasets: [] },
    newDataBar: [],
    newDataPie: [],
    categories: [],
  });

  const [lineOptions, setLineOptions] = useState({});


  useEffect(() => {
    // fetchDashboardData();

    setLineOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#495057" },
          grid: { color: "#ebedef" },
        },
        y: {
          ticks: { color: "#495057" },
          grid: { color: "#ebedef" },
        },
      },
    });
  }, []);

 
  const fetchDashboardData = async () => {
    try {
      const res = await ServiceLPADM05.getDataList(); // ใช้เส้น /Get ของ LPADM05
      if (res.status === 200 && res.data?.result) {
        const result = res.data.result;


        const categories = result.map((x) => x.date || "ไม่ระบุ");
        const counts = result.map((x) => x.total_usage || 0);

        const chart_series = {
          labels: categories,
          datasets: [
            {
              label: "จำนวนการเข้าใช้งาน",
              data: counts,
              fill: false,
              borderColor: "#42A5F5",
            },
          ],
        };

        const newDataBar = [
          {
            name: "จำนวนการเข้าใช้งาน",
            data: counts,
          },
        ];

        const newDataPie = [
          {
            name: "จำนวนการเข้าใช้งานรวม",
            y: counts.reduce((a, b) => a + b, 0),
          },
        ];

        setGraphData({
          chart_series,
          newDataBar,
          newDataPie,
          categories,
        });
      }
    } catch (err) {
      console.error("[API Error: Dashboard]", err);
    }
  };

  /*───────────────────────────────
   🔹 Highcharts Options
  ────────────────────────────────*/
  const optionsBar = {
    chart: { type: "column" },
    title: { text: "", align: "left" },
    xAxis: { categories: graphData.categories },
    yAxis: {
      min: 0,
      title: { text: "จำนวนการเข้าใช้งาน" },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "",
          color:
            (Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color) ||
            "gray",
          textOutline: "none",
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "white",
      borderColor: "#CCC",
      shadow: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat:
        "{series.name}: {point.y}<br/>ทั้งหมด: {point.stackTotal} ครั้ง",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: { enabled: true },
      },
    },
    series: graphData.newDataBar,
  };

  const optionsPie = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: { text: "", align: "left" },
    tooltip: { pointFormat: "{series.name}: <b>{point.y}</b> ครั้ง" },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y} ครั้ง",
        },
        showInLegend: true,
      },
    },
    colors: ["#64E572", "#ED561B", "#24CBE5", "#FF9655", "#8085e9", "#6AF9C4"],
    series: [
      {
        name: "จำนวนการใช้งาน",
        colorByPoint: true,
        data: graphData.newDataPie,
      },
    ],
  };


  return (
    <div className="p-grid card">
      <div className="p-col-12">
        {/* 🔹 Line Chart */}
        <Chart
          type="line"
          data={graphData.chart_series}
          options={lineOptions}
        />
      </div>

      <div className="p-col-7" style={{ marginTop: "30px" }}>
        {/* 🔹 Bar Chart */}
        <HighchartsReact highcharts={Highcharts} options={optionsBar} />
      </div>

      <div
        className="p-col-5"
        style={{ alignSelf: "center", marginTop: "30px" }}
      >
        {/* 🔹 Pie Chart */}
        <HighchartsReact highcharts={Highcharts} options={optionsPie} />
      </div>
    </div>
  );
};
