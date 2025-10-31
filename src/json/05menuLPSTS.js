// const menuLPSTS = [
//   {
//     label: "รายงานธรรมาภิบาลข้อมูลภาครัฐ",
//     icon: "pi pi-info-circle",
//     to: "/LPSTS01",
//   },
//   {
//     label: "เอกสารธรรมาภิบาลข้อมูลภาครัฐ",
//     icon: "pi pi-info-circle",
//     to: "/LPSTS02",
//   },
//   { label: "ข้อมูล Log Service", to: "/MSM03" },
// ];

const menuLPSTS = [
  {
    label: "ธรรมาภิบาลข้อมูลภาครัฐ",
    icon: "pi pi-file",
    group: true,
    items: [
      {
        label: "รายงานธรรมาภิบาลข้อมูลภาครัฐ",
        // icon: "pi pi-info-circle",
        to: "/LPSTS01",
      },
      {
        label: "เอกสารธรรมาภิบาลข้อมูลภาครัฐ",
        // icon: "pi pi-info-circle",
        to: "/LPSTS02",
      },
      // { label: "ข้อมูล Log Service", to: "/MSM03" },
    ],
  },
  {
    label: "รายงานเชื่อมโยงและแลกเปลี่ยนข้อมูลด้วยระบบ API Service",
    icon: "pi pi-share-alt",
    group: true,
    items: [
      { label: "รายงานสรุปการถ่ายโอนข้อมูล", to: "/DBT06" },
      { label: "รายงานจำนวนข้อมูลและผลต่าง", to: "/MSM35" },
    ],
  },
  {
    label: "รายงานการเชื่อมโยง/แลกเปลี่ยนข้อมูลระหว่างหน่วยงาน",
    icon: "pi pi-sort-alt",
    group: true,
    items: [
      { label: "รายงานการใช้งาน Service ของหน่วยงาน", to: "/LPSTS03" },
      { label: "ภาพรวมการใช้งาน Service", to: "/LPSTS04" },
    ],
  },
  {
    label: "รายงานบริหารจัดการสิทธิผู้ใช้งาน",
    icon: "pi pi-user-edit",
    group: true,
    items: [{ label: "รายงานแบบสำรวจความพึงพอใจ", to: "/LPSTS05" }],
  },
];

export default menuLPSTS;
