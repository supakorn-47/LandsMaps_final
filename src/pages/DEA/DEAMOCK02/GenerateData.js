// data.js
export const rawData = [];

const agencies = [
  "สำนักงานที่ดินกรุงเทพฯ เขต 1",
  "สำนักงานที่ดินเชียงใหม่",
  "สำนักงานที่ดินขอนแก่น",
  "สำนักงานที่ดินพิษณุโลก",
  "สำนักงานที่ดินระยอง",
  "สำนักงานทรัพยากรน้ำภาค 2",
  "สำนักงานที่ดินพังงา",
];

const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

const statuses = ["สำเร็จ", "ล้มเหลว"];

const startDate = new Date("2025-01-01");
const endDate = new Date("2025-12-31");

for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const date = d.toISOString().split("T")[0];

  agencies.forEach((agency) => {
    const requestCount = getRandom(100, 500);
    const dataMB = getRandomFloat(3, 15);
    const status = Math.random() < 0.85 ? "สำเร็จ" : "ล้มเหลว";

    rawData.push({
      date,
      agency,
      requestCount,
      dataMB,
      status,
    });
  });
}
