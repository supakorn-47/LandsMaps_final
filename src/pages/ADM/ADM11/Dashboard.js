import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { formatDateTH } from "../../../utils/DateUtil";


export const Dashboard = (props) => {
  const [lineOptions, setLineOptions] = useState({});
  const [stackedOptions, setStackedOptions] = useState({});
  const [pieData, setPieData] = useState([]);
  const [graph, setGraph] = useState({ title: { text: "" } });

 

  useEffect(() => {
    const dates = [
      new Date("2025-07-02"),
      new Date("2025-07-09"),
      new Date("2025-07-16"),
      new Date("2025-07-23"),
      new Date("2025-07-27"),
    ];
    const rawSeries = [
      {
        name: "ที่ดินของฉัน",
        data: [4200, 5100, 4900, 5300, 5000],
      },
      {
        name: "ค้นหาที่ดินของฉัน",
        data: [3800, 4000, 4100, 4200, 3900],
      },
      {
        name: "ดูรายละเอียดที่ดิน",
        data: [2200, 2500, 2300, 2600, 2400],
      },
      {
        name: "ข่าวสาร",
        data: [700, 1200, 900, 1500, 1300],
      },
      {
        name: "แบบความพึงพอใจ",
        data: [100, 200, 150, 180, 120],
      },
    ];

    const series = rawSeries.map((item) => ({
      name: item.name,
      data: item.data.map((value, index) => [dates[index].getTime(), value]),
    }));

    // Set thousands separator
    Highcharts.setOptions({
      lang: { thousandsSep: "," },
    });

    

    setGraph({
      chart: {
        type: "area",
      },
      //   categories: series.map((item) => item.feature),
      colors: ["#FF69B4", "#ff5722", "#ffeb3b", "#8bc34a", "#29b6f6"],
      title: {
        text: "กราฟแสดงปริมาณการใช้งานของ API",
      },
      subtitle: {
        text:
          "วันที่ " +
          formatDateTH(new Date("2025/7/2")) +
          " - " +
          formatDateTH(new Date("2025/7/27")),
      },
      xAxis: {
        type: "datetime",
        title: { text: "วันที่" },
        labels: { format: "{value:%d %b}" },
      },
      yAxis: {
        title: {
          text: "จำนวนการใช้งาน (ครั้ง)",
        },
      },
      tooltip: {
        shared: true,
        crosshairs: true,
      },
      series: series,
      credits: {
        enabled: false,
      },
    });
  }, []);

  const renderLine = () => {
    return (
      <>
        <Chart
          type="line"
          data={props.graphData.chart_series}
          options={lineOptions}
        />
      </>
    );
  };

  return (
    <div>
      <div className="p-grid card">
        <div className="p-col-12">
          <HighchartsReact
            highcharts={Highcharts}
            options={graph}
            ref={React.createRef()}
          />
        </div>
      </div>
    </div>
  );
};

