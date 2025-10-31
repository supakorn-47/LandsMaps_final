import { getSession } from "../../src/utils/Crypto.js";
const menuLPSPS = [
  {label: 'ตรวจสอบ ประวัติ', icon: 'pi pi-search', group: true,
    items: [
      { label: "ระบบ MyLands : ที่ดินของฉัน", icon: 'pi pi-map', to: "" },
      { label: "ตรวจสอบประวัติการใช้งานระบบ", icon: 'pi pi-sort-alt', to: "/LPSPS01" },
      { label: "ตรวจสอบประวัติแลกเปลี่ยนข้อมูล", icon: "pi pi-sort-alt", to: "/LPSPS02" }
      // { 	label: 'กำหนดข้อมูลให้บริการหน่วยงาน', icon: 'pi pi-sort-alt', to: '/DEA01',},
    ]
  }
  
];

export default menuLPSPS;
