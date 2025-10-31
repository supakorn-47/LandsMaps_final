import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./pdfmake/build/vfs_fonts";
import { formatDateTH_full2 } from "./DateUtil";

var d = new Date();
d.setFullYear(2564);

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  AngsanaNew: {
    normal: "ANGSA.ttf",
    bold: "angsab.ttf",
    italics: "ANGSAI.ttf",
    bolditalics: "AngsanaNewBoldItalic.ttf",
  },
  THSarabunNew: {
    normal: "THSarabunNew.ttf",
    bold: "THSarabunNew-Bold.ttf",
    italics: "THSarabunNew-Italic.ttf",
    bolditalics: "THSarabunNew-BoldItalic.ttf",
  },
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
  },
};

export const generateTableADM2 = (dataTable) => {
  let style_header = { alignment: "center", fontSize: 12 };
  let _arr = [];
  for (let i = 0; i < dataTable.length; i++) {
    let record_status =
      dataTable[i].record_status === "N" ? "ใช้งาน" : "ไม่ใช้งาน";
    _arr.push([
      {
        text: i + 1,
        style: { alignment: "center", fontSize: 12 },
      },
      {
        text: dataTable[i].department_name_th,
        style: { fontSize: 12 },
      },
      {
        text: dataTable[i].department_name_en,
        style: { fontSize: 12 },
      },
      {
        text: dataTable[i].remark,
        style: { fontSize: 12 },
      },
      {
        text: record_status,
        style: { alignment: "center", fontSize: 12 },
      },
    ]);
  }

  return [
    {
      text: "รายงานข้อมูลหน่วยงาน",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      table: {
        headerRows: 1,
        widths: ["5%", "25%", "25%", "25%", "15%", "15%"],
        body: [
          [
            {
              text: "ลำดับ",
              style: style_header,
            },
            {
              text: "หน่วยงาน (ภาษาไทย)",
              style: style_header,
            },
            {
              text: "หน่วยงาน (ภาษาอังกฤษ)",
              style: style_header,
            },
            {
              text: "หมายเหตุ",
              style: style_header,
            },
            {
              text: "สถานะ",
              style: style_header,
            },
          ],
          ..._arr,
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex < 1 ? "#CCCCCC" : null;
        },

        hLineWidth: function (i, node) {
          return 0.25;
        },
        vLineWidth: function (i, node) {
          return 0.25;
        },
      },
    },
  ];
};

export const generateTableADM3 = (_arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานกำหนดข้อมูลการให้บริการ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "3%",
              "10%",
              "16%",
              "7%",
              "7%",
              "14%",
              "16%",
              "7%",
              "8%",
              "7%",
              "8%",
            ],
            body: [
              [
                { text: "ลำดับ", style: { bold: true, alignment: "center" } },
                {
                  text: "หน่วยงาน",
                  style: { bold: true },
                },
                { text: "จำนวน", style: { bold: true } },
                { text: "REST", style: { bold: true } },
                { text: "WMS", style: { bold: true } },
                { text: "GeoJSON", style: { bold: true } },
                {
                  text: "ประเภทข้อมูล",
                  style: { bold: true, alignment: "center" },
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateTableADM08 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานอนุมัติผู้ใช้งาน",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.create_dtm_from, false) +
        " ถึง " +
        formatDateTH_full2(searchData.create_dtm_to, false),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "4%",
              "9%",
              "11%",
              "9%",
              "10%",
              "10%",
              "10.5%",
              "10%",
              "10%",
              "9%",
              "8%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลาลงทะเบียน",
                  style: styleFont,
                },
                {
                  text: "กลุ่มผู้ใช้งาน",
                  style: styleFont,
                },
                {
                  text: "จังหวัด",
                  style: styleFont,
                },
                {
                  text: "หน่วยงาน",
                  style: styleFont,
                },
                {
                  text: "ชื่อ-สกุล",
                  style: styleFont,
                },
                {
                  text: "เลขประจำตัวประชาชน",
                  style: styleFont,
                },
                {
                  text: "อีเมล",
                  style: styleFont,
                },
                {
                  text: "เบอร์มือถือ",
                  style: styleFont,
                },
                {
                  text: "วัตถุประสงค์",
                  style: styleFont,
                },
                {
                  text: "สถานะผู้ใช้งาน",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },

            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateTableADM09 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานจัดการสิทธิผู้ใช้งานระบบ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.create_dtm_from, false) +
        " ถึง " +
        formatDateTH_full2(searchData.create_dtm_to, false),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "12%", "15%", "12%", "15%", "15%", "20%", "8%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลาลงทะเบียน",
                  style: styleFont,
                },
                {
                  text: "ชื่อ-สกุล",
                  style: styleFont,
                },
                {
                  text: "เลขประจำตัวประชาชน",
                  style: styleFont,
                },
                {
                  text: "ชื่อผู้ใช้งาน",
                  style: styleFont,
                },
                {
                  text: "ประเภทการลงทะเบียน",
                  style: styleFont,
                },
                {
                  text: "หน่วยงาน",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },

            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateTableADM10 = (searchData, _arr) => {
  let style_header = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานตรวจสอบประวัติ OTP",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.otp_dtm_from, false) +
        " ถึง " +
        formatDateTH_full2(searchData.otp_dtm_to, false),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      table: {
        headerRows: 1,
        widths: ["4%", "12%", "12%", "20%", "20%", "20%", "12%"],
        body: [
          [
            {
              text: "ลำดับ",
              style: style_header,
            },
            {
              text: "วันเวลาสร้าง OTP",
              style: style_header,
            },
            {
              text: "วันเวลาหมดอายุ OTP",
              style: style_header,
            },
            {
              text: "REF CODE",
              style: style_header,
            },
            {
              text: "OTP",
              style: style_header,
            },
            {
              text: "EMAIL",
              style: style_header,
            },
            {
              text: "สถานะยืนยันตัวตน",
              style: style_header,
            },
          ],
          ..._arr,
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex < 1 ? "#CCCCCC" : null;
        },

        hLineWidth: function (i, node) {
          return 0.25;
        },
        vLineWidth: function (i, node) {
          return 0.25;
        },
      },
    },
  ];
};

export const generateTableADM11 = (searchData, _arr) => {
  let style_header = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานตรวจสอบประวัติการใช้งานระบบ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.response_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          // widths: ['*'],
          style: "tableExample",
          table: {
            headerRows: 1,
            styles: { style_header },
            widths: ["5%", "14%", "15%", "18%", "20%", "20%", "10%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: style_header,
                },
                {
                  text: "วันเวลาประวัติ",
                  style: style_header,
                },
                {
                  text: "IP Address",
                  style: style_header,
                },
                {
                  text: "ผู้ใช้งาน",
                  style: style_header,
                },
                {
                  text: "กลุ่มผู้ใช้งาน",
                  style: style_header,
                },
                {
                  text: "หน่วยงาน",
                  style: style_header,
                },
                {
                  text: "สถานะ",
                  style: style_header,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingRight: function (i, node) {
              return 6;
            },
          },
        },
      ],
    },
  ];
};

export const generateTableADM11Sum = (searchData, dataTableSummary) => {
  let style_header = { alignment: "center", fontSize: 9 };
  let header = [];
  let widths = [];
  //for sequence column
  header.push({
    text: "ลำดับ",
    style: style_header,
  });
  widths.push("auto");
  // for others column
  let headerLength = dataTableSummary.header.length;

  dataTableSummary.header.forEach((element, idx) => {
    header.push({
      text: element,
      style: style_header,
    });
    widths.push(idx === 0 || idx === headerLength - 1 ? "auto" : "3%");
  });

  let body = [];
  let _Textarr = [];
  let index = 0;
  dataTableSummary.datalist.forEach((element) => {
    index = 0;
    _Textarr = [
      {
        text: element.index,
        style: { alignment: "center", fontSize: 9 },
      },
    ];
    for (var key in element) {
      if (key !== "index") {
        _Textarr.push({
          text: element[key],
          style: { alignment: "right", fontSize: 9 },
        });
      }
      index++;
    }
    body.push(_Textarr);

    console.log("body:", body);
  });
  return [
    {
      text: "รายงานสรุปประวัติการใช้งานระบบ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.response_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          // widths: ['*'],
          style: "tableExample",
          table: {
            headerRows: 1,
            styles: { style_header },
            widths: widths,
            body: [header, ...body],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingRight: function (i, node) {
              return 6;
            },
          },
        },
      ],
    },
  ];
};

export const generateTableADM12 = (widths, txtHead, _arr) => {
  let style_header = { alignment: "center", fontSize: 12 };
  return [
    {
      text: txtHead,
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            styles: { style_header },
            widths: widths,
            body: [
              [
                {
                  text: "ลำดับ",
                  style: style_header,
                },
                {
                  text: "วันที่ขอคำร้องขอ",
                  style: style_header,
                },
                {
                  text: "ชื่อ อปท.",
                  style: style_header,
                },
                {
                  text: "ไฟล์ Zip",
                  style: style_header,
                },
                {
                  text: "ขนาดไฟล์ Zip (KB)",
                  style: style_header,
                },
                {
                  text: "สถานะส่งอีเมล",
                  style: style_header,
                },
                {
                  text: "ผู้ส่งอีเมล",
                  style: style_header,
                },
                {
                  text: "วันที่ส่งอีเมล",
                  style: style_header,
                },
                {
                  text: "ผู้ดาวน์โหลด",
                  style: style_header,
                },
                {
                  text: "วันที่ดาวน์โหลด",
                  style: style_header,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },

            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateTableADM13 = (searchData, _arr, txtHead) => {
  let style_header = { alignment: "center", fontSize: 12 };
  return [
    {
      text: txtHead,
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          widths: ["*"],
          style: "tableExample",
          table: {
            headerRows: 1,
            styles: { style_header },
            widths: [
              "4%",
              "4%",
              "15%",
              "6%",
              "6.9%",
              "7%",
              "6%",
              "7%",
              "9%",
              "9%",
              "9%",
              "9%",
              "9%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: style_header,
                },
                {
                  text: "มาตรา",
                  style: style_header,
                },
                {
                  text: "ชื่อ อปท.",
                  style: style_header,
                },
                {
                  text: "เดือน-ปี",
                  style: style_header,
                },
                {
                  text: "จำนวนรายการ(เปลี่ยนแปลง)",
                  style: style_header,
                },
                {
                  text: "ไฟล์ Zip",
                  style: style_header,
                },
                {
                  text: "ขนาดไฟล์ Zip",
                  style: style_header,
                },
                {
                  text: "สถานะส่งเมล",
                  style: style_header,
                },
                {
                  text: "ผู้ส่งอีเมล",
                  style: style_header,
                },
                {
                  text: "วันที่ส่งอีเมล",
                  style: style_header,
                },
                {
                  text: "สถานะดาวน์โหลด",
                  style: style_header,
                },
                {
                  text: "ผู้ดาวน์โหลด",
                  style: style_header,
                },
                {
                  text: "วันที่ดาวน์โหลด",
                  style: style_header,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },

            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

//ADM15
export const generateTableADM16 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "ตรวจสอบติดตามการเเจ้งข้อผิดพลาด",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.question_dt_start, true) +
        " ถึง " +
        formatDateTH_full2(searchData.question_dt_end, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "4%",
              "8%",
              "15%",
              "10%",
              "10%",
              "10%",
              "15%",
              "20%",
              "10%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันที่แจ้ง",
                  style: styleFont,
                },
                {
                  text: "ชื่อสำนักงาน",
                  style: styleFont,
                },
                {
                  text: "ชื่อ-สกุล",
                  style: styleFont,
                },
                {
                  text: "ชื่อหน่วยงาน",
                  style: styleFont,
                },
                {
                  text: "ประเภทข้อผิดพลาด",
                  style: styleFont,
                },
                {
                  text: "หัวข้อ",
                  style: styleFont,
                },
                {
                  text: "รายละเอียด",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_ADM16 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานข้อมูล อปท. ที่ยินยอมเผยแพร่ข้อมูลการชำระภาษี",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "13%", "13%", "13%", "36%", "12%", "12%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "จังหวัด",
                  style: styleFont,
                },
                {
                  text: "อำเภอ",
                  style: styleFont,
                },
                {
                  text: "ตำบล",
                  style: styleFont,
                },
                {
                  text: "ชื่อ อปท.",
                  style: styleFont,
                },
                {
                  text: "สถานะยินยอม",
                  style: styleFont,
                },
                {
                  text: "วันที่ยินยอม",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          // style: "tableExample",
        },
      ],
    },
  ];
};

// export const generateHead_ADM14 = (searchData) => {
//     let styleFont = { alignment: "center", fontSize: 12 }
//     return [
//         {
//             text: "รายงานตรวจสอบประวัติการใช้งานตาม Function ระบบงาน",
//             style: { alignment: "center", fontSize: 14, bold: true }
//         },
//         {
//             text: formatDateTH_full2(searchData.date_from, true) + " ถึง " + formatDateTH_full2(searchData.date_to, true),
//             style: { alignment: "center", fontSize: 14, bold: true }
//         },
//         {
//             columns: [
//                 {
//                     table: {
//                         headerRows: 1,
//                         widths: ['4%', '10%', '11%', '16%', '20%', '20%', '22%'],
//                         body: [
//                             [
//                                 {
//                                     text: 'ลำดับ',
//                                     style: styleFont,
//                                 },
//                                 {
//                                     text: 'วันเวลาประวัติ',
//                                     style: styleFont,
//                                 },
//                                 {
//                                     text: 'IP Address',
//                                     style: styleFont,
//                                 },
//                                 {
//                                     text: 'ผู้ใช้งาน',
//                                     style: styleFont,
//                                 },
//                                 {
//                                     text: 'ระบบ',
//                                     style: styleFont,
//                                 },
//                                 {
//                                     text: 'Function',
//                                     style: styleFont,
//                                 },
//                                 {
//                                     text: 'Log Desc',
//                                     style: styleFont,
//                                 },

//                             ]
//                         ],

//                     },
//                     layout: {
//                         fillColor: function (rowIndex, node, columnIndex) {
//                             return rowIndex < 2 ? "#CCCCCC" : null;
//                         },
//                         hLineWidth: function (i, node) {
//                             return 0.25;
//                         },
//                         vLineWidth: function (i, node) {
//                             return 0.25;

//                         },
//                     },
//                     // style: "tableExample",
//                 }

//             ]
//         },

//     ];

// }

export const generateTableDMS6 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  let styleFontRight = { alignment: "right", fontSize: 12 };
  return [
    {
      text: "รายงานสรุปการถ่ายโอนข้อมูล",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.start_date, false) +
        " ถึง " +
        formatDateTH_full2(searchData.end_date, false),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "12%", "22%", "6%", "18%", "10%", "10%", "8%", "8%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันที่",
                  style: styleFont,
                },
                {
                  text: "แหล่งข้อมูล",
                  style: styleFont,
                },
                {
                  text: "Schema",
                  style: styleFont,
                },
                {
                  text: "กลุ่มตาราง",
                  style: styleFont,
                },
                {
                  text: "จำนวนข้อมูล\nต้นทาง",
                  style: styleFont,
                },
                {
                  text: "จำนวนข้อมูล\nปลายทาง",
                  style: styleFont,
                },
                {
                  text: "ประเภทการ\nถ่ายโอน",
                  style: styleFont,
                },
                {
                  text: "สถานะการ\nถ่ายโอน",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingLeft: function (i, node) {
              return 3.5;
            },
            paddingRight: function (i, node) {
              return 3.5;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_DGR01 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานข้อมูลการใช้งานโปรเเกรมประยุกต์",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.request_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            // widths: [25, 80, 80, 120, 180, 110, 110],
            widths: [
              "4%",
              "11%",
              "25%",
              "10%",
              "10%",
              "11%",
              "11%",
              "10%",
              "11%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลาใช้งาน",
                  style: styleFont,
                },
                {
                  text: "ชื่อโปรแกรม",
                  style: styleFont,
                },
                {
                  text: "IP Address Client",
                  style: styleFont,
                },
                {
                  text: "IP Address Host",
                  style: styleFont,
                },
                {
                  text: "วันเวลา request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา response",
                  style: styleFont,
                },
                {
                  text: "Reponse Time(s)",
                  style: styleFont,
                },
                {
                  text: "ผู้ใช้งาน",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingLeft: function (i, node) {
              return 3.5;
            },
            paddingRight: function (i, node) {
              return 3.5;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_LMS05 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานแสดงปริมาณการใช้งานของ API ตามผู้ขอใช้บริการ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, false) +
        " ถึง " +
        formatDateTH_full2(searchData.request_dtm_to, false),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "4.5%",
              "9%",
              "12%",
              "12%",
              "13%",
              "13%",
              "13%",
              "14%",
              "12%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันที่",
                  style: styleFont,
                },
                {
                  text: "ผู้เข้าใช้บริการ (ราย)",
                  style: styleFont,
                },
                {
                  text: "ค้นหาจาก เลขที่โฉนด (ครั้ง)",
                  style: styleFont,
                },
                {
                  text: "ค้นหาจาก Double Click (ครั้ง)",
                  style: styleFont,
                },
                {
                  text: "ค้นหาจาก StreetView (ครั้ง)",
                  style: styleFont,
                },
                {
                  text: "ค้นหาจาก สถานที่สำคัญ (ครั้ง)",
                  style: styleFont,
                },
                {
                  text: "ค้นหาจาก ตำแหน่งปัจจุบัน (ครั้ง)",
                  style: styleFont,
                },
                {
                  text: "ลงทะเบียนผู้ใช้งาน (ราย)",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
        },
      ],
    },
  ];
};

export const generateHead_DEA02 = () => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานกำหนดข้อมูลการให้บริการ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "23%", "10%", "23%", "10%", "8%", "8%", "8%", "8%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "Service Name",
                  style: styleFont,
                },
                {
                  text: "Protocal",
                  style: styleFont,
                },
                {
                  text: "Path",
                  style: styleFont,
                },
                {
                  text: "Parameter",
                  style: styleFont,
                },
                {
                  text: "Method",
                  style: styleFont,
                },
                {
                  text: "ประเภท Service",
                  style: styleFont,
                },
                {
                  text: "ประเภทข้อมูล",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            // paddingLeft: function (i, node) {
            //     return 3.5;
            // },
            // paddingRight: function (i, node) {
            //     return 3.5;
            // },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_DEA03 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานตรวจสอบประวัติแลกเปลี่ยนข้อมูล",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.request_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "4%",
              "7%",
              "8%",
              "16%",
              "12%",
              "11%",
              "7%",
              "7%",
              "7%",
              "7%",
              "7%",
              "7%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลา" + "\n" + "จัดเก็บประวัติ",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "หน่วยงานแลกเปลี่ยน",
                  style: styleFont,
                },
                {
                  text: "ชื่อ Service",
                  style: styleFont,
                },
                {
                  text: "ประเภท Service",
                  style: styleFont,
                },
                {
                  text: "วันเวลา request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา response",
                  style: styleFont,
                },
                {
                  text: "สถานะติดต่อ",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
                {
                  text: "ขนาดข้อมูล" + "\n" + "(byte)",
                  style: styleFont,
                },
                {
                  text: "ประเภท" + "\n" + "แลกเปลี่ยน",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            // paddingLeft: function (i, node) {
            //     return 3.5;
            // },
            paddingRight: function (i, node) {
              return 6;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateTableMSM1 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานข้อมูล Log การแลกเปลี่ยนข้อมูล",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.log_exchange_dtm_start, true) +
        " ถึง " +
        formatDateTH_full2(searchData.log_exchange_dtm_end, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "3.5%",
              "8%",
              "10%",
              "21%",
              "17%",
              "8%",
              "8%",
              "7%",
              "7%",
              "7%",
              "7%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลา" + "\n" + "จัดเก็บประวัติ",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "หน่วยงาน",
                  style: styleFont,
                },
                {
                  text: "ชื่อ Service",
                  style: styleFont,
                },
                {
                  text: "วันเวลา request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา response",
                  style: styleFont,
                },
                {
                  text: "ประเภท Service",
                  style: styleFont,
                },
                {
                  text: "สถานะติดต่อ",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
                {
                  text: "ขนาดข้อมูล" + "\n" + "(byte)",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingRight: function (i, node) {
              return 10;
            },
          },
        },
      ],
    },
  ];
};

export const generateTableMSM2 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานข้อมูล Log ถ่ายโอนข้อมูล",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.start_date, true) +
        " ถึง " +
        formatDateTH_full2(searchData.end_date, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "5%",
              "8%",
              "8%",
              "19%",
              "15%",
              "19%",
              "7%",
              "7%",
              "7%",
              "7%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                // {
                //     text: 'Job ID',
                //     style: styleFont,
                // },
                {
                  text: "วันเวลาเริ่มต้น",
                  style: styleFont,
                },
                {
                  text: "วันเวลาสิ้นสุด",
                  style: styleFont,
                },
                {
                  text: "แหล่งข้อมูล",
                  style: styleFont,
                },
                {
                  text: "กลุ่มตาราง",
                  style: styleFont,
                },
                {
                  text: "แหล่งข้อมูลปลายทาง",
                  style: styleFont,
                },
                {
                  text: "จำนวนข้อมูลต้นทาง",
                  style: styleFont,
                },
                {
                  text: "จำนวนข้อมูลปลายทาง",
                  style: styleFont,
                },
                {
                  text: "Schedule Mode",
                  style: styleFont,
                },
                {
                  text: "สถานะการถ่ายโอน",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateTableMSM3 = (searchData, _arr) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานข้อมูล Log Service",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.log_service_dtm_start, true) +
        " ถึง " +
        formatDateTH_full2(searchData.log_service_dtm_end, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "8%", "*", "*", "10%", "9%", "8%", "*", "6%", "6%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลาจัดเก็บประวัติ",
                  style: styleFont,
                },
                {
                  text: "ชื่อ-นามสกุล",
                  style: styleFont,
                },
                {
                  text: "หน่วยงาน",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "วันเวลา request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา response",
                  style: styleFont,
                },
                {
                  text: "ชื่อ Service",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
                {
                  text: "ขนาดข้อมูล(byte)",
                  style: styleFont,
                },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_MSM04 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานข้อมูล Log Function",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.request_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "11%", "8%", "18%", "19%", "19%", "24%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลา" + "\n" + "จัดเก็บประวัติ",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "ชื่อผู้ใช้งาน",
                  style: styleFont,
                },
                {
                  text: "ระบบ",
                  style: styleFont,
                },
                {
                  text: "Function",
                  style: styleFont,
                },
                {
                  text: "Function Desc",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_MSM05 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานปริมาณข้อมูลการเข้าใช้งาน ระบบแลกเปลี่ยน",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.request_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "4%",
              "9%",
              "10%",
              "19%",
              "14.5%",
              "9%",
              "9%",
              "9%",
              "6.5%",
              "6%",
              "7%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลา" + "\n" + "จัดเก็บประวัติ",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "หน่วยงาน",
                  style: styleFont,
                },
                {
                  text: "ชื่อ Service",
                  style: styleFont,
                },

                {
                  text: "วันเวลา" + "\n" + "request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา" + "\n" + "response",
                  style: styleFont,
                },
                {
                  text: "ประเภท Service",
                  style: styleFont,
                },
                {
                  text: "สถานะติดต่อ",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
                {
                  text: "ขนาดข้อมูล" + "\n" + "(byte)",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingRight: function (i, node) {
              return 7;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_MSM15 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานปริมาณข้อมูลการเข้าใช้งาน ระบบ LandsMaps",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.request_dtm_from, true) +
        " ถึง " +
        formatDateTH_full2(searchData.request_dtm_to, true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "11%", "12%", "32.5%", "32.5%", "10%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันที่ Request",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "ระบบ",
                  style: styleFont,
                },
                {
                  text: "Function",
                  style: styleFont,
                },
                {
                  text: "จำนวนการใช้งาน",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_MSM15_Detail = (data) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text:
        "รายงานปริมาณข้อมูลการเข้าใช้งาน ระบบ LandsMaps รายละเอียดหมายเลขเครื่อง " +
        data.ip_address,
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "4%",
              "10%",
              "10%",
              "13%",
              "13%",
              "13%",
              "15%",
              "12%",
              "6.5%",
              "6.5%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วันเวลา Request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา Response",
                  style: styleFont,
                },
                {
                  text: "ชื่อผู้ใช้งาน",
                  style: styleFont,
                },
                {
                  text: "ระบบ",
                  style: styleFont,
                },
                {
                  text: "Function",
                  style: styleFont,
                },
                {
                  text: "Function Desc",
                  style: styleFont,
                },
                {
                  text: "สำงานที่ดิน",
                  style: styleFont,
                },
                {
                  text: "สถานะติดต่อ",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingRight: function (i, node) {
              return 6;
            },
          },
        },
      ],
    },
  ];
};

export const generateHead_MSM16 = () => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงาน Monitor Response Time",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: ["4%", "15%", "9%", "9%", "9%", "9%", "7%", "28%", "13%"],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "ชื่อโปรแกรม",
                  style: styleFont,
                },
                {
                  text: "หมายเลขเครื่อง",
                  style: styleFont,
                },
                {
                  text: "วันเวลา request",
                  style: styleFont,
                },
                {
                  text: "วันเวลา response",
                  style: styleFont,
                },
                {
                  text: "Response Time(s)",
                  style: styleFont,
                },
                {
                  text: "สถานะ",
                  style: styleFont,
                },
                {
                  text: "ที่อยู่ Service",
                  style: styleFont,
                },
                {
                  text: "รายละเอียด",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

export const generateHead_MSM35 = () => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงาน Monitor Response Time",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 2,
            // widths: ['4%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: { alignment: "center", fontSize: 12 },
                  rowSpan: 2,
                },
                {
                  text: "MVIEW_NAME",
                  style: { alignment: "center", fontSize: 12 },
                  rowSpan: 2,
                },
                {
                  text: "มกราคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "กุมภาพันธ์",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "มีนาคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "เมษายน",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "พฤษภาคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "มิถุนายน",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "กรกฎาคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "สิงหาคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "กันยายน",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ตุลาคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "พฤศจิกายน",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ธันวาคม",
                  style: { alignment: "center", fontSize: 12 },
                  colSpan: 2,
                },
                {
                  text: " ",
                  style: { alignment: "center", fontSize: 12 },
                },
              ],
              [
                {
                  text: "",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "จำนวนข้อมูล",
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: "ผลต่าง",
                  style: { alignment: "center", fontSize: 12 },
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};

const INITIAL_PDF_MAKER = (head) => {
  return {
    defaultStyle: {
      font: "THSarabunNew",
      // alignment: "justify",
    },

    footer: (currentPage, pageCount) => {
      return [
        {
          columns: [
            // {
            //     text: "",
            //     alignment: "right",
            //     margin: [0, 0, 0, 0]
            // },
            {
              text: "หน้า " + currentPage.toString() + "/" + pageCount,
              // alignment: "center",
              alignment: "right",
              margin: [50, 0, 50, 0],
              // style: 'subheader',
              fontSize: 14,
            },
          ],
        },
      ];
    },

    content: [{}],
  };
};

// add style here....
// simple how to use
// style: 'header' OR style: ['quote', 'small']
export const styles = {
  header: {
    fontSize: 20,
    bold: true,
  },
  subheader: {
    fontSize: 18,
    bold: true,
  },
  text: {
    fontSize: 16,
    bold: true,
  },
  quote: {
    italics: true,
  },
  small: {
    fontSize: 8,
  },
};

export const generatePdf = (head, content, callback) => {
  let config_header = INITIAL_PDF_MAKER(head);
  let object = {
    ...config_header,
    ...content,
  };
  const obj = pdfMake.createPdf(object);
  obj.getDataUrl((data) => callback(data));
};

export const generatePdfOpenNewTab = (head, content, callback) => {
  let config_header = INITIAL_PDF_MAKER(head);
  let object = {
    ...config_header,
    ...content,
  };

  // console.log("generatePdfOpenNewTab:", content);

  const obj = pdfMake.createPdf(object).open();
  // obj.getDataUrl(data => callback(data));
};

export const generateHead_DBT06 = (searchData) => {
  let styleFont = { alignment: "center", fontSize: 12 };
  return [
    {
      text: "รายงานสรุปการถ่ายโอนข้อมูล",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text:
        formatDateTH_full2(searchData.start_date, false) +
        " ถึง " +
        formatDateTH_full2(searchData.end_date, false),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            // widths: [25, 80, 80, 120, 180, 110, 110],
            widths: [
              "4%",
              "6%",
              "6%",
              "6%",
              "6%",
              "5%",
              "6%",
              "6%",
              "6%",
              "6%",
              "6%",
              "6%",
              "6%",
              "6%",
              "6%",
              "6%",
              "7%",
            ],
            body: [
              [
                {
                  text: "ลำดับ",
                  style: styleFont,
                },
                {
                  text: "วัน เวลา" + "\n" + "เริ่มต้น",
                  style: styleFont,
                },
                {
                  text: "วัน เวลา" + "\n" + "สิ้นสุด",
                  style: styleFont,
                },

                {
                  text: "แหล่งข้อมูล",
                  style: styleFont,
                },
                {
                  text: "กลุ่มตาราง",
                  style: styleFont,
                },
                {
                  text: "ลำดับการทำงาน",
                  style: styleFont,
                },
                {
                  text: "แหล่งข้อมูลต้นทาง",
                  style: styleFont,
                },
                {
                  text: "Schema ต้นทาง",
                  style: styleFont,
                },
                {
                  text: "ตาราง" + "\n" + "ต้นทาง",
                  style: styleFont,
                },
                {
                  text: "แหล่งข้อมูล" + "\n" + "ปลายทาง",
                  style: styleFont,
                },
                {
                  text: "Schema ปลายทาง",
                  style: styleFont,
                },
                {
                  text: "ตาราง" + "\n" + "ปลายทาง",
                  style: styleFont,
                },
                {
                  text: "Schedule Mode",
                  style: styleFont,
                },
                {
                  text: "จำนวน" + "\n" + "ข้อมูล",
                  style: styleFont,
                },
                {
                  text: "สถานะการ" + "\n" + "ถ่ายโอน",
                  style: styleFont,
                },
                {
                  text: "ข้อผิดพลาด",
                  style: styleFont,
                },
                {
                  text: "Log Path",
                  style: styleFont,
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 2 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
            paddingLeft: function (i, node) {
              return 3.5;
            },
            paddingRight: function (i, node) {
              return 3.5;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};
export const generateTableDGR04 = (_arr) => {
  return [
    {
      text: "รายงานภาพรวมการให้บริการ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "5%",
              "16%",
              "16%",
              "16%",
              "30%",
              "20%",
              "16%",
              "7%",
              "8%",
              "7%",
              "8%",
            ],
            body: [
              [
                { text: "ลำดับ", style: { bold: true, alignment: "center" } },
                {
                  text: "วันที่",
                  style: { bold: true },
                },
                { text: "ชื่อบริการ", style: { bold: true } },
                { text: "ประเภทบริการ", style: { bold: true } },
                { text: "อัตราค่าบริการต่อหน่วย", style: { bold: true } },
                { text: "จำนวนที่ร้องขอ(request)", style: { bold: true } },
                {
                  text: "จำนวนสูงสุดที่ร้องขอได้(request max)",
                  style: { bold: true },
                },
                { text: "รวมค่าบริการ", style: { bold: true } },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};
export const generateTableDGR05 = (_arr) => {
  return [
    {
      text: "รายงานแบบประเมินความพึงพอใจ",
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      text: "รายงาน ณ " + formatDateTH_full2(new Date(), true),
      style: { alignment: "center", fontSize: 14, bold: true },
    },
    {
      columns: [
        {
          table: {
            headerRows: 1,
            widths: [
              "5%",
              "16%",
              "16%",
              "16%",
              "30%",
              "20%",
              "16%",
              "7%",
              "8%",
              "7%",
              "8%",
            ],
            body: [
              [
                { text: "ลำดับ", style: { bold: true, alignment: "center" } },
                {
                  text: "วันที่สร้างแบบสำรวจ",
                  style: { bold: true },
                },
                { text: "วันที่เริ่มต้นสำรวจ", style: { bold: true } },
                { text: "วันที่สิ้นสุดสำรวจ", style: { bold: true } },
                { text: "หัวข้อแบบสำรวจ(ภาษาไทย)", style: { bold: true } },
                { text: "หัวข้อแบบสำรวจ(ภาษาอังกฤษ)", style: { bold: true } },
              ],
              ..._arr,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex < 1 ? "#CCCCCC" : null;
            },
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
          style: "tableExample",
        },
      ],
    },
  ];
};
