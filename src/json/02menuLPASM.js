const menuLPASM = [
  {
    label: "ตั้งค่าข้อมูลหลัก",
    icon: "pi pi-cog",
    group: true,
    items: [
      // { label: 'ข้อมูลกลุ่มผู้ใช้งาน', to: '/LPASM01' },
      { label: "ข้อมูลหน่วยงาน", to: "/LPASM02" },
      { label: "ข้อมูลให้บริการ Service", to: "/LPASM03" },
      { label: "ข้อมูล Status Code", to: "/LPASM04" },
      { label: "กำหนดอัตราค่าตั้งต้นของการใช้บริการ", to: "/LPASM05" },
    ],
  },
  // {
  //     label: 'ตรวจสอบ', icon: 'pi pi-search', group: true,
  //     items: [
  //         // { label: 'ข้อมูล Log การเชื่อมโยง/แลกเปลี่ยนข้อมูลระหว่างหน่วยงาน', to: '/MSM03' },
  //         // { label: 'ประวัติการใช้งานระบบ', to: '/ADM11' },
  //         // { label: 'ติดตามการเเจ้งข้อผิดพลาด', to: '/ADM14' }
  //     ]
  // },
];
export default menuLPASM;
