
const menuLPADM = [
  {
    label: "จัดการสิทธิผู้ใช้งาน",
    icon: "pi pi-user-edit",
    group: true,
    items: [
      // { label: 'ข้อมูลกลุ่มผู้ใช้งาน', to: '/ADM01' },
      { label: "ข้อมูลกลุ่มผู้ใช้งาน", to: "/LPASM01" },
      { label: "อนุมัติผู้ใช้งาน", to: "/LPADM01" },
      { label: "จัดการสิทธิผู้ใช้งาน", to: "/LPADM02" },
    ],
  },
  {
    label: "กำหนดข้อมูล ข่าวประกาศ แบบสำรวจ",
    icon: "pi pi-user-edit",
    group: true,
    items: [
      { label: "ข่าวประกาศ", to: "/LPADM03" },
      { label: "แบบสำรวจความพึงพอใจ", to: "/LPADM04" },
    ],
  },
  {
    label: "ตรวจสอบ ประวัติ",
    icon: "pi pi-search",
    group: true,
    items: [
      { label: "ประวัติ OTP", to: "/LPADM06" },
      { label: "ประวัติการใช้งานระบบ", to: "/LPADM05" },
      // { label: 'ติดตามการเเจ้งข้อผิดพลาด', to: '/ADM14' }
    ],
  },
];

// export const menuGroupedType6 = [
//     // {
//     //     label: 'กำหนดข้อมูล', icon: 'pi pi-user-edit', group: true,
//     //     items: [
//     //         { label: 'อนุมัติผู้ใช้งาน', to: '/ADM08' },
//     //     ]
//     // },
//     // {
//     //     label: 'ม.10 เเละ ม.92', icon: 'pi pi-search', group: true,
//     //     items: [
//     //         { label: 'สถานะข้อมูล ม.10 และ ม.92', to: '/ADM13' },
//     //     ]
//     // },
// ];

// export const menuGroupedCheckMenu = [
//     // {
//     //     label: 'กำหนดข้อมูล', icon: 'pi pi-user-edit', group: true,
//     //     items: [
//     //         { label: 'ข้อมูลกลุ่มผู้ใช้งาน', to: '/ADM01' },
//     //         { label: 'อนุมัติผู้ใช้งาน', to: '/LPADM01' },
//     //         { label: 'จัดการสิทธิผู้ใช้งาน', to: '/LPADM02' },
//     //         { label: 'ข่าวประกาศ', to: '/LPADM03' },
//     //         { label: 'แบบสำรวจความพึงพอใจ', to: '/LPADM04' },
//     //     ]
//     // },
//     // {
//     //     label: 'ตรวจสอบ', icon: 'pi pi-search', group: true,
//     //     items: [
//     //         { label: 'ประวัติการใช้งานระบบ', to: '/LPADM05' },
//     //         { label: 'ประวัติ OTP', to: '/LPADM06' },
//     //     ]
//     // },
// ];

export default menuLPADM;