import React from "react";
import { SummaryCard } from "./SummaryCard";
import "./SummaryOverview.css";

export default function DEAMOCK02SUMMARYCARD({ filteredData }) {
  // หาจำนวนหน่วยงานไม่ซ้ำ
  const agencies = [...new Set(filteredData.map((item) => item.agency))];

  // คำร้องขอทั้งหมด (รวม requestCount)
  const totalRequests = filteredData.reduce(
    (sum, item) => sum + item.requestCount,
    0
  );

  // % สำเร็จโดยเฉลี่ย (คิดจากจำนวนคำร้องขอที่ status === 'สำเร็จ')
  const successRequests = filteredData
    .filter((item) => item.status === "สำเร็จ")
    .reduce((sum, item) => sum + item.requestCount, 0);
  const averageSuccessRate = totalRequests
    ? ((successRequests / totalRequests) * 100).toFixed(1)
    : 0;

  // ปริมาณข้อมูลทั้งหมด (รวม dataMB)
  const totalDataMB = filteredData
    .reduce((sum, item) => sum + item.dataMB, 0)
    .toFixed(2);

  const summaryData = [
    {
      icon: "pi pi-building",
      title: "จำนวนหน่วยงานทั้งหมด",
      value: `${agencies.length} หน่วยงาน`,
      iconColor: "bg-blue",
    },
    {
      icon: "pi pi-chart-line",
      title: "คำร้องขอทั้งหมด",
      value: `${totalRequests.toLocaleString()} รายการ`,
      iconColor: "bg-green",
    },
    {
      icon: "pi pi-check-circle",
      title: "% สำเร็จโดยเฉลี่ย",
      value: `${averageSuccessRate}%`,
      iconColor: "bg-emerald",
    },
    {
      icon: "pi pi-database",
      title: "ปริมาณข้อมูลทั้งหมด",
      value: `${totalDataMB} MB`,
      iconColor: "bg-purple",
    },
  ];

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h2 className="overview-title">สรุปการใช้งานรวมทุกหน่วยงาน</h2>
      </div>

      <div className="p-nogutter summary-grid">
        {summaryData.map((item, index) => (
          <div key={index} className="summary-grid-item">
            <SummaryCard
              icon={item.icon}
              title={item.title}
              value={item.value}
              description={item.description}
              iconColor={item.iconColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
