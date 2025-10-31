import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart"; // PrimeReact ยังใช้ chart.js v2
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
export default function HorizontalBarChartV2({ filteredData }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (!filteredData || filteredData === 0) return;

    // รวมปริมาณข้อมูลตามหน่วยงาน
    const usageByAgency = filteredData.reduce((acc, curr) => {
      const agency = curr.agency;
      const dataSize = curr.dataMB || 0;
      if (!acc[agency]) acc[agency] = 0;
      acc[agency] += dataSize;
      return acc;
    }, {});
    // จัดเรียงตามปริมาณข้อมูลมากไปน้อย
    const sorted = Object.entries(usageByAgency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // top 10 agencies

    const labels = sorted.map(([agency]) => agency);
    const values = sorted.map(([, value]) => Number(value.toFixed(2)));
    const data = {
      labels: labels,
      datasets: [
        {
          label: "ปริมาณข้อมูล (MB)",
          data: values,
          backgroundColor: [
            "#6366F1",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#06B6D4",
            "#84CC16",
          ],
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value + " MB";
              },
            },
            gridLines: {
              color: "#eee",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#374151",
              fontSize: 12,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [filteredData]);

  return (
    <div style={{ height: "400px" }}>
      <h3>ปริมาณข้อมูลต่อหน่วยงาน</h3>
      <Chart
        type="horizontalBar"
        data={chartData}
        options={chartOptions}
        height="200px"
      />
    </div>
  );
}
