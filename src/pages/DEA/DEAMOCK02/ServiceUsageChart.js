import React from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import "./ServiceUsageChart.css";

export function ServiceUsageChart({ filteredData }) {
  // console.log(...filteredData);

  const vibrantColors = [
    "#FF6B35",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#A8E6CF",
    "#FFD93D",
    "#6C5CE7",
    "#FD79A8",
  ];

  const sortedData = filteredData
    .sort((a, b) => b.dataMB - a.dataMB)
    .map((item, index) => ({
      ...item,
      shortName: item.serviceName,
      color: vibrantColors[index % vibrantColors.length],
    }));

  const chartData = {
    labels: sortedData.map((item) => item.shortName),
    datasets: [
      {
        label: "ปริมาณข้อมูล (MB)",
        backgroundColor: sortedData.map((item) => item.color),
        data: sortedData.map((item) => item.dataMB),
      },
    ],
  };
  function wrapLabel(text, maxChars) {
    const parts = text.match(new RegExp(`.{1,${maxChars}}`, "g"));
    return parts ? parts.join("\n") : text;
  }
  const chartOptions = {
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: false,

      tooltip: {
        callbacks: {
          label: function (context) {
            const item = sortedData[context.dataIndex];

            return `${item.serviceName}(${item.dataMB} MB). `;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // บังคับให้แสดงทุก label
          maxRotation: 0, // ไม่หมุน
          callback: function (val) {
            const label = this.getLabelForValue(val);
            return wrapLabel(label, 12);
          },
        },
      },
      y: {
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="usage-chart-container">
      <Card title="การใช้งานข้อมูลตาม API Service">
        <div style={{ width: "100%", height: "450px" }}>
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </Card>
    </div>
  );
}
