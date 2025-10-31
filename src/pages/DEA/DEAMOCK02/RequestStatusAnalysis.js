import React from "react";
import { Chart } from "primereact/chart";
import "./RequestStatusAnalysis.css";

export function RequestStatusAnalysis({ filteredData }) {
  // สรุปจำนวนสำเร็จ / ล้มเหลวทั้งหมด
  let totalSuccess = 0;
  let totalFailure = 0;

  // เตรียมข้อมูลต่อช่วง (สมมุติ group by date)
  const statusByDate = {};

  filteredData.forEach((item) => {
    const date = item.date;
    const count = item.requestCount || 0;

    if (!statusByDate[date]) {
      statusByDate[date] = { success: 0, failure: 0 };
    }

    if (item.status === "สำเร็จ") {
      statusByDate[date].success += count;
      totalSuccess += count;
    } else {
      statusByDate[date].failure += count;
      totalFailure += count;
    }
  });

  const totalRequests = totalSuccess + totalFailure;
  const overallSuccessRate =
    totalRequests > 0
      ? ((totalSuccess / totalRequests) * 100).toFixed(1)
      : "0.0";

  // เตรียมข้อมูลสำหรับกราฟ
  const chartData = {
    labels: Object.keys(statusByDate),
    datasets: [
      {
        label: "สำเร็จ",
        backgroundColor: "#10b981",
        data: Object.values(statusByDate).map((d) => d.success),
      },
      {
        label: "ล้มเหลว",
        backgroundColor: "#ef4444",
        data: Object.values(statusByDate).map((d) => d.failure),
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${
              tooltipItem.dataset.label
            }: ${tooltipItem.raw.toLocaleString()}`;
          },
          afterBody: (tooltipItems) => {
            const success =
              tooltipItems.find((t) => t.dataset.label === "สำเร็จ")?.raw || 0;
            const failure =
              tooltipItems.find((t) => t.dataset.label === "ล้มเหลว")?.raw || 0;
            const total = success + failure;
            const rate =
              total > 0 ? ((success / total) * 100).toFixed(1) : "0.0";
            return [`อัตราสำเร็จ: ${rate}%`];
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${(value / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div>
      <div>
        <h3>สถิติสถานะการร้องขอการแลกเปลี่ยนข้อมูล</h3>
        <p className="subtitle">
          ข้อมูลการเรียกใช้ API แยกตามสถานะสำเร็จและล้มเหลว
        </p>
      </div>
      <div className="analysis-container">
        <div className="stats-grid">
          <div className="stat-box green">
            <div className="stat-number">{totalSuccess.toLocaleString()}</div>
            <div className="stat-label">คำร้องขอสำเร็จ</div>
          </div>
          <div className="stat-box red">
            <div className="stat-number">{totalFailure.toLocaleString()}</div>
            <div className="stat-label">คำร้องขอล้มเหลว</div>
          </div>
        </div>
      </div>
      <div>
        <Chart
          type="bar"
          data={chartData}
          options={chartOptions}
          height={400}
        />
      </div>
    </div>
  );
}
