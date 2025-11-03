import { replaceNoENtoTH } from "./ReplaceStr";
var dateFormat = require("dateformat");

export const displayDateTH = () => {
  let th = {
    firstDayOfWeek: 1,
    dayNames: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุทธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
    dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
    dayNamesMin: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
    monthNames: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    monthNamesShort: [
      "ม.ค.",
      "ก.พ.",
      "มี.ค",
      "เม.ย",
      "พ.ค",
      "มิ.ย",
      "ก.ค.",
      "ส.ค",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ],
    today: "วันนี้",
    clear: "ล้าง",
    dateFormat: "dd/mm/yyyy",
    weekHeader: "สัปดาห์",
  };
  return th;
};

export const monthNamesTH = () => {
  return [
    { label: "มกราคม", value: "01" },
    { label: "กุมภาพันธ์", value: "02" },
    { label: "มีนาคม", value: "03" },
    { label: "เมษายน", value: "04" },
    { label: "พฤษภาคม", value: "05" },
    { label: "มิถุนายน", value: "06" },
    { label: "กรกฎาคม", value: "07" },
    { label: "สิงหาคม", value: "08" },
    { label: "กันยายน", value: "09" },
    { label: "ตุลาคม", value: "10" },
    { label: "พฤศจิกายน", value: "11" },
    { label: "ธันวาคม", value: "12" },
  ];
};

export const yearTH = (start, end, require) => {
  const data = [];
  if (require) data.push({ label: "-กรุณาเลือก-", value: "-1" });
  for (let index = start; index < end; index++) {
    data.push({ label: index.toString(), value: index });
  }
  return data;
};

export const yearTH2 = (start, end, require) => {
  const data = [];
  if (require) data.push({ label: "-กรุณาเลือก-", value: "-1" });
  for (let index = start; index < end; index++) {
    data.push({ label: index, value: index + "" });
  }
  return data;
};

export const dayTH = (month, year) => {
  const data = [];
  let maxDayInMonth = new Date(year, month, 0).getDate();
  for (let index = 1; index <= maxDayInMonth; index++) {
    data.push({ label: index.toString(), value: index });
  }
  return data;
};

/** ✅ ปรับให้ปลอดภัย (ป้องกัน Invalid date) */
export const formatDateTH = (_date, isTime) => {
  if (!_date) return "";
  const conv = new Date(_date);
  if (isNaN(conv.getTime())) return "";
  const date = dateFormat(conv, "dd/mm/yyyy HH:MM");
  const date_time_arr = date.split(" ");
  const date_arr = date_time_arr[0].split("/");
  date_arr[2] = parseInt(date_arr[2]) + 543;
  return isTime
    ? `${date_arr[0]}/${date_arr[1]}/${date_arr[2]} ${date_time_arr[1]}`
    : `${date_arr[0]}/${date_arr[1]}/${date_arr[2]}`;
};

export const formatDateTH2 = (_date, isTime) => {
  if (!_date) return "";
  try {
    let conv_to_date = new Date(_date);
    if (isNaN(conv_to_date.getTime())) return "";
    let date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM:ss");
    let date_time_arr = date.split(" ");
    let date_arr = date_time_arr[0].split("/");
    date_arr[2] = parseInt(date_arr[2]) + 543;
    return isTime
      ? `${date_arr[0]}/${date_arr[1]}/${date_arr[2]} ${date_time_arr[1]}`
      : `${date_arr[0]}/${date_arr[1]}/${date_arr[2]}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatDateAPI = (date, isTime) => {
  if (!date) return "";
  const conv = new Date(date);
  if (isNaN(conv.getTime())) return "";
  const date_dt = new Date(conv.setFullYear(conv.getFullYear()));
  return isTime
    ? dateFormat(date_dt, "yyyymmdd HH:MM")
    : dateFormat(date_dt, "yyyymmdd");
};

export const formatDateAPI2 = (date, isTime) => {
  if (!date) return "";
  const conv = new Date(date);
  if (isNaN(conv.getTime())) return "";
  const date_dt = new Date(conv.setFullYear(conv.getFullYear()));
  return isTime
    ? dateFormat(date_dt, "yyyy-mm-dd HH:MM")
    : dateFormat(date_dt, "yyyy-mm-dd");
};

export const monthNamesTH_full = (mm) => {
  const data_list = monthNamesTH();
  const data = data_list.find((y) => y.value === mm);
  return data ? data.label : "";
};

export const formatDateTH_full = (data_date, isTime) => {
  if (!data_date) return "";
  const conv_to_date = new Date(data_date);
  if (isNaN(conv_to_date.getTime())) return "";
  const date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM");
  const date_time_arr = date.split(" ");
  const date_arr = date_time_arr[0].split("/");
  if (!date_arr[2]) return "";
  return isTime
    ? `วันที่ ${replaceNoENtoTH(date_arr[0])} ${replaceNoENtoTH(
        monthNamesTH_full(date_arr[1])
      )} ${replaceNoENtoTH(date_arr[2])} เวลา ${replaceNoENtoTH(
        date_time_arr[1]
      )} นาฬิกา`
    : `วันที่ ${replaceNoENtoTH(date_arr[0])} ${replaceNoENtoTH(
        monthNamesTH_full(date_arr[1])
      )} ${replaceNoENtoTH(date_arr[2])}`;
};

export const formatDateTH_full2 = (data_date, isTime) => {
  if (!data_date) return "";
  const conv_to_date = new Date(data_date);
  if (isNaN(conv_to_date.getTime())) return "";
  const date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM");
  const date_time_arr = date.split(" ");
  const date_arr = date_time_arr[0].split("/");
  date_arr[2] = parseInt(date_arr[2]) + 543;
  return isTime
    ? `วันที่ ${replaceNoENtoTH(date_arr[0])} ${replaceNoENtoTH(
        monthNamesTH_full(date_arr[1])
      )} ${replaceNoENtoTH(date_arr[2])} เวลา ${replaceNoENtoTH(
        date_time_arr[1]
      )} น.`
    : `วันที่ ${replaceNoENtoTH(date_arr[0])} ${replaceNoENtoTH(
        monthNamesTH_full(date_arr[1])
      )} ${replaceNoENtoTH(date_arr[2])}`;
};

export const formatDateTH_full3 = (data_date, isTime) => {
  if (!data_date) return "";
  const conv_to_date = new Date(data_date);
  if (isNaN(conv_to_date.getTime())) return "";
  const date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM:ss");
  const date_time_arr = date.split(" ");
  const date_arr = date_time_arr[0].split("/");
  date_arr[2] = parseInt(date_arr[2]) + 543;
  return isTime
    ? `${date_arr[0]}/${date_arr[1]}/${date_arr[2]} ${date_time_arr[1]}`
    : `${date_arr[0]}/${date_arr[1]}/${date_arr[2]}`;
};

export const getDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minutes}:${seconds}`;
};
