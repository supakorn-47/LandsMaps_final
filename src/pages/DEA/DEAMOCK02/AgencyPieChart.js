import React from "react";
import { Chart } from "primereact/chart";
import "./AgencyPieChart.css";

export function AgencyPieChart({ filteredData }) {
  // รวม requestCount ของแต่ละหน่วยงาน (ชื่อซ้ำจะถูกรวมกัน)
  const aggregatedData = filteredData.reduce((acc, curr) => {
    const agency = curr.agency;
    if (!acc[agency]) {
      acc[agency] = { agency: agency, requestCount: 0 };
    }
    acc[agency].requestCount += curr.requestCount;
    return acc;
  }, {});

  // แปลงจาก object เป็น array
  const aggregatedArray = Object.values(aggregatedData);

  // คำนวณผลรวมทั้งหมด
  const totalRequestCount = aggregatedArray.reduce(
    (sum, a) => sum + a.requestCount,
    0
  );

  // ถ้าไม่มีข้อมูลกัน error
  if (aggregatedArray.length === 0) return <p>ไม่มีข้อมูล</p>;

  // หน่วยงานที่ request เยอะสุด
  const topAgency = aggregatedArray.reduce((max, a) =>
    a.requestCount > max.requestCount ? a : max
  );

  // const topAgencyPercentage = (
  //   (topAgency.requestCount / totalRequestCount) *
  //   100
  // ).toFixed(1);

  // กำหนดข้อมูลกราฟ
  const pieChartData = {
    labels: aggregatedArray.map((a) => a.agency),
    datasets: [
      {
        data: aggregatedArray.map((a) => a.requestCount),
        backgroundColor: [
          "#6366F1",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
          "#84CC16",
          "#EC4899",
          "#F97316",
          "#0EA5E9",
          "#A855F7",
          "#14B8A6",
          "#F43F5E",
          "#22C55E",
        ],
        borderWidth: 1,
      },
    ],
  };

  // กำหนด options กราฟ
  const pieChartOptions = {
    legend: {
      display: true,
      position: "right",
      labels: {
        fontSize: 10,
        usePointStyle: true,
        generateLabels: function (chart) {
          const data = chart.data;
          if (!data.labels.length) return [];

          return data.labels.map((label, i) => {
            const value = data.datasets[0].data[i];
            const bgColor = data.datasets[0].backgroundColor[i];
            return {
              text: `${label} (${value.toLocaleString()} รายการ)`,
              fillStyle: bgColor,
              hidden: chart.getDatasetMeta(0).data[i].hidden,
              index: i,
            };
          });
        },
      },
      onClick: function (e, legendItem) {
        const index =
          legendItem.datasetIndex !== undefined
            ? legendItem.datasetIndex
            : legendItem.index;
        const chart = this.chart;
        const meta = chart.getDatasetMeta(0);
        meta.data[index].hidden = !meta.data[index].hidden;
        chart.update();
      },
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const value = dataset.data[tooltipItem.index];
          return `${data.labels[tooltipItem.index]}: ${value.toLocaleString()}`;
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="agency-container">
      <div className="agency-summary">
        <div>
          <h3>รวม {totalRequestCount.toLocaleString()} รายการ</h3>
          <p>{aggregatedArray.length} หน่วยงาน</p>
        </div>
        <div className="top-agency">
          <p className="text">หน่วยงานที่ร้องขอมากที่สุด:</p>
          <strong>{topAgency.agency}</strong>
          <strong>{topAgency.requestCount.toLocaleString()}รายการ</strong>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-box">
          <Chart
            type="pie"
            data={pieChartData}
            options={pieChartOptions}
            height="200px"
          />
        </div>
      </div>
    </div>
  );
}
