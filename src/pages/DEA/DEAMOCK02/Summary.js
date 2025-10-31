export default function getSummaryData(rawData) {
  // หาจำนวนหน่วยงานไม่ซ้ำ
  const agencies = new Set(rawData.map((item) => item.agency));
  const totalAgencies = agencies.size;

  // รวมคำร้องขอทั้งหมด (sum requestCount)
  const totalRequests = rawData.reduce(
    (sum, item) => sum + item.requestCount,
    0
  );

  // คำนวณ % สำเร็จ
  const totalSuccess = rawData
    .filter((item) => item.status === "สำเร็จ")
    .reduce((sum, item) => sum + item.requestCount, 0);
  const successRate = totalRequests
    ? ((totalSuccess / totalRequests) * 100).toFixed(1)
    : 0;

  // รวมปริมาณข้อมูลทั้งหมด (sum dataMB)
  const totalDataMB = rawData.reduce((sum, item) => sum + item.dataMB, 0);

  return [
    {
      icon: "pi pi-building",
      title: "จำนวนหน่วยงานทั้งหมดที่ใช้งาน",
      value: `${totalAgencies} หน่วยงาน`,
      description: "Total Agencies",
      iconColor: "bg-blue",
    },
    {
      icon: "pi pi-chart-line",
      title: "คำร้องขอทั้งหมด",
      value: `${totalRequests.toLocaleString()} รายการ`,
      description: "Total API Requests",
      iconColor: "bg-green",
    },
    {
      icon: "pi pi-check-circle",
      title: "% สำเร็จโดยเฉลี่ย",
      value: `${successRate}%`,
      description: "Average Success Rate",
      iconColor: "bg-emerald",
    },
    {
      icon: "pi pi-database",
      title: "ปริมาณข้อมูลทั้งหมด",
      value: `${totalDataMB.toFixed(2)} MB`,
      description: "Total Data Transferred",
      iconColor: "bg-purple",
    },
  ];
}
