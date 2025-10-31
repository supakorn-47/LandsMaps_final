const menuLPASM = [
  {
    label: "ตั้งค่าข้อมูลหลัก",
    icon: "pi pi-cog",
    group: true,
    items: [
      { label: "ข้อมูลกลุ่มผู้ใช้งาน", to: "/LPASM01" },
      { label: "ข้อมูลหน่วยงาน", to: "/LPASM02" },
      { label: "ข้อมูลให้บริการ Service", to: "/LPASM03" },
      { label: "ข้อมูล Status Code", to: "/LPASM04" },
      { label: "กำหนดอัตราค่าตั้งต้นของการใช้บริการ", to: "/ADM05" },
    ],
  },
  {
    label: "ระบบบริหารจัดการ Service",
    icon: "pi pi-info-circle",
    group: true,
    items: [
      { label: "Grafana", open: true },
      { label: "Gitlab", open: true },
      { label: "Kong Gateway", open: true },
    ],
  },
  {
    label: "Monipathr Response Time Service",
    icon: "pi pi-user-edit",
    group: true,
    items: [
      {
        label: "ข้อมูล Log การเชื่อมโยง/แลกเปลี่ยนข้อมูลระหว่างหน่วยงาน",
        to: "/LPSMS02",
      },
    ],
  },
  // {
  //     label: 'ตรวจสอบ', icon: 'pi pi-search', group: true,
  //     items: [
  //         { label: 'ประวัติ OTP', to: '/ADM10' },
  //         { label: 'ประวัติการใช้งานระบบ', to: '/ADM11' },
  //         { label: 'ติดตามการเเจ้งข้อผิดพลาด', to: '/ADM14' }
  //     ]
  // },
  // {
  //     label: 'ม.10 เเละ ม.92', icon: 'pi pi-search', group: true,
  //     items: [
  //         { label: 'สร้างคำร้องขอข้อมูล ม.92', to: '/ADM12' },
  //         { label: 'สถานะข้อมูล ม.10 และ ม.92', to: '/ADM13' },
  //     ]
  // },
];

export default menuLPASM;
