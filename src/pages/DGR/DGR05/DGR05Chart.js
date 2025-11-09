import React, { useState, useEffect, useRef } from "react";
//import { useReactToPrint } from "react-to-print";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
//import { usePDF } from "react-to-pdf";
// import html2pdf from "html2pdf.js";
// import ReactToPdf from "react-to-pdf";
// import { jsPDF } from "jspdf";
// import { Subtitle } from "@highcharts/react";
// import "chart.js";
import "./print.css";
export default function DGR05Chart({ data }) {
  const [allChartData, setAllChartData] = useState([]);
  // const contentRef = useRef();

  // console.log(contentRef);

  // const printFn = useReactToPrint({
  //   contentRef: contentRef,
  //   documentTitle: "รายงานสรุปผลสำรวจ",
  // });

  useEffect(() => {
    if (!data || !data.chartlist) return; // <-- ป้องกัน undefined

    const chartlist = data.chartlist;
    const colors = [
      "#5677fc",
      "#ec407a",
      "#7e57c2",
      "#4BC0C0",
      "#9966FF",
      "#259b24",
      "#26a69a",
      "#cddc39",
      "#ffc107",
      "#f57c00",
    ];

    const charts = chartlist.map((chart) => {
      const labels = chart.series.data_th.map((item) => item.name || "ไม่ระบุ");
      const values = chart.series.data_th.map((item) => item.y);

      return {
        title: chart.title_th,
        subtitle: chart.total,
        chartData: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              hoverOffset: 10,
            },
          ],
        },
      };
    });

    setAllChartData(charts);
  }, [data]);

  const options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          generateLabels: function (chart) {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((sum, val) => sum + val, 0);

            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label}: ${percentage}%`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(1);
            const label = tooltipItem.label || "";
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };
  // const handlePrint = () => {
  //   setTimeout(() => {
  //     printFn(); // Delay the print function to allow charts to render
  //   }, 500); // Adjust the delay as necessary (500ms should be enough)
  // };
  //   const handlePrint = () => {
  //   setTimeout(() => {
  //     // ให้เวลาในการเรนเดอร์กราฟก่อนที่การพิมพ์จะเริ่ม
  //     contentRef.current && contentRef.current.toPdf(); // เรียกการพิมพ์หลังจากกราฟ render เสร็จ
  //   }, 500);
  // };

  // const handlePrint = () => {
  //   // ใช้ setTimeout เพื่อให้กราฟถูกเรนเดอร์เสร็จก่อน
  //   setTimeout(() => {
  //     const element = contentRef.current;
  //     html2pdf()
  //       .from(element) // เลือก element ที่ต้องการพิมพ์
  //       .set({
  //         margin: 10, // กำหนดขอบหน้า
  //         filename: "chart.pdf", // ตั้งชื่อไฟล์ PDF
  //         image: { type: "jpeg", quality: 0.98 }, // ปรับคุณภาพภาพ
  //         html2canvas: { scale: 4 }, // ปรับความละเอียดของภาพจาก DOM
  //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // กำหนดขนาดและทิศทางของหน้า
  //       })
  //       .save("chart.pdf"); // ตั้งชื่อไฟล์ PDF ที่จะบันทึก
  //   }, 500); // เพิ่มหน่วงเวลา 500ms ก่อนพิมพ์
  // };
  return (
    <div>
      <div>
        {allChartData.map((item, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <div>
              <h4>{`${index + 1}.` + item.title}</h4>
            </div>
            <p> {`ตอบ ${item.subtitle} ครั้ง`}</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Chart
                type="pie"
                data={item.chartData}
                options={options}
                style={{ width: 450 }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Button
          onClick={printFn}
          icon="pi pi-print"
          label="พิมพ์แบบสำรวจ"
          severity="info"
          className="p-button-info p-button-rounded p-button-outlined"
        />
      </div> */}
    </div>
  );
}
