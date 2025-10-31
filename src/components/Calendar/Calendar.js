import React from "react";
import { Calendar } from "./modify/Calendar";

export const TH = {
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
  weekHeader: "Sm",
};

export const Calendars = ({
  onChange,
  value,
  yearRange = "2016:2026",
  maxDate = null,
  minDate = null,
  showTime = false,
  showSeconds = false,
  dateFormat = "dd/mm/yy",
  disabled = false,
  timeOnly = false,
}) => {
  return (
    <Calendar
      onChange={onChange}
      value={value || null}
      yearRange={yearRange}
      dateFormat={dateFormat}
      showIcon={true}
      showTime={showTime}
      locale={TH}
      showButtonBar
      monthNavigator
      yearNavigator
      appendTo={document.body}
      maxDate={maxDate}
      minDate={minDate}
      showSeconds={showSeconds}
      disabled={disabled}
      baseZIndex={9999}
      timeOnly={timeOnly}
      hourFormat="24"
      todayButtonClassName="p-button-info custom-today-btn p-button-text"
      clearButtonClassName="p-button-secondary custom-clear-btn p-button-text"
    />
  );
};
