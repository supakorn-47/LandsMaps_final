import React, { useState } from "react";
import { Chart } from "primereact/chart";
import CustomCard from "../../../components/CustomCard/CustomCard";

const PieChartComponent = ({ data }) => {
  const [allChartData, setAllChartData] = useState([]);
  // const dataChart= data.chartlist
  const [chartData] = useState({
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  });

  const [chartOptions] = useState({
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "Inter, sans-serif",
            size: 14,
          },
          padding: 20,
          usePointStyle: true,
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#374151",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} คน (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    cutout: "0%",
    radius: "80%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  });

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        style={{ position: "relative", width: "40%" }}
      />
    </div>
  );
};
export default PieChartComponent;
