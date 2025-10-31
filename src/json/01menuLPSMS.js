const menuLPSMS = [
  {
    label: "ข้อมูล API Service",
    icon: "pi pi-share-alt",
    group: true,
    items: [
      { label: "ข้อมูลให้บริการ API Service", to: "/LPSMS03" },
      {
        label: "กำหนดข้อมูล อปท. ที่ยินยอมเผยแพร่ข้อมูลการชำระภาษี",
        to: "/ADM16",
      },
    ],
  },
  {
    label: "ถ่ายโอน",
    icon: "pi pi-sort-alt",
    group: true,
    items: [
      { label: "กำหนดแหล่งข้อมูลถ่ายโอน", to: "/DMS01" },
      { label: "กำหนดตารางข้อมูลถ่ายโอน", to: "/DMS02" },
      { label: "ตรวจสอบการถ่ายโอนข้อมูล", to: "/DBT03" },
      { label: "กำหนดตารางเวลา (Schedule) การถ่ายโอนข้อมูล", to: "/DBT07" },
    ],
  },
  {
    label: "ดึงข้อมูล",
    icon: "pi pi-sitemap",
    group: true,
    items: [
      { label: "ดึงข้อมูลทั้งหมด/เปลี่ยนแปลง", to: "/DMS04" },
      { label: "ดึงข้อมูลแปลงที่ดิน", to: "/DBT05" },
    ],
  },
  {
    label: "ข้อมูล Log",
    icon: "pi pi-info-circle",
    group: true,
    items: [
      { label: "ข้อมูล Log ถ่ายโอนข้อมูล", to: "/LPSMS01" },
      { label: "ข้อมูล Log Service", to: "/MSM03" },
    ],
  },
  {
    label: "รายงาน",
    icon: "pi pi-file-o",
    group: true,
    items: [
      { label: "รายงานสรุปการถ่ายโอนข้อมูล", to: "/DBT06" },
      { label: "รายงานจำนวนข้อมูลและผลต่าง", to: "/MSM35" },
      {
        label: "รายงานรายงานจัดอันดับการใช้บริการสูงสุด 10 อันดับ",
        to: "/DBT08",
      },
    ],
  },
];

export default menuLPSMS;
