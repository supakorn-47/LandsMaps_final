import React from "react";
import { Chart } from "primereact/chart";
// import { Card } from "./ui/card";
import { Card } from "primereact/card";
export default function ServiceChart({ data, title }) {
  const chartData = {
    labels: data.map((item) =>
      item.service_name.length > 25
        ? item.service_name.substring(0, 25) + "..."
        : item.service_name
    ),
    datasets: [
      {
        label: "จำนวนการใช้งาน (ครั้ง)",
        data: data.map((item) => item.service_request_qty),
        backgroundColor: "#FF69B4	",
        borderColor: "#FF69B4",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "ค่าใช้จ่ายรวม (บาท)",
        data: data.map((item) => item.sum_service_rate_amt),
        backgroundColor: "#2a36b1",
        borderColor: "#2a36b1",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: "y",
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "system-ui",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            return data[index].service_name;
          },
          label: function (context) {
            const index = context.dataIndex;
            const service = data[index];
            const datasetLabel = context.dataset.label;

            if (datasetLabel.includes("จำนวนการใช้งาน")) {
              return `${datasetLabel}: ${service.service_request_qty.toLocaleString()} ครั้ง`;
            } else {
              return `${datasetLabel}: ฿${service.sum_service_rate_amt.toLocaleString()}`;
            }
          },
          afterBody: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const service = data[index];
            return `ค่าบริการต่อครั้ง: ฿${service.service_rate_amt}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + "K";
            }
            return value;
          },
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxTicksLimit: 10,
        },
      },
    },
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4">{title}</h3>
      <div className="h-[500px]">
        <Chart type="bar" data={chartData} options={options} height="450px" />
      </div>
    </Card>
  );
}
