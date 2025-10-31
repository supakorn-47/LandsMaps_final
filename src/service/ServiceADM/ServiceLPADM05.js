import requests from "../httpServices";
var dateFormat = require("dateformat");

const ServiceLPADM05 = {
  /**
   * 🔹 ดึงข้อมูลรายการ Dashboard (LPADM05/Get)
   * ใช้สำหรับแสดงกราฟจำนวนการเข้าใช้งาน
   */
  GetDataList(body = {}, headers) {
    const data = {
      request_dtm_from:
        body.request_dtm_from === "" || body.request_dtm_from === undefined
          ? ""
          : dateFormat(body.request_dtm_from, "yyyymmdd"),
      response_dtm_to:
        body.response_dtm_to === "" || body.response_dtm_to === undefined
          ? ""
          : dateFormat(body.response_dtm_to, "yyyymmdd"),
      totalRecords: body.totalRecords ?? 0,
      pageofnum: body.pageofnum ?? 1,
      rowofpage: body.rowofpage ?? 20,
    };

    return requests.post("backOfficeApi/LPADM05/Get", data, headers);
  },

  /**
   * 🔹 ดึงข้อมูลสรุปการลงทะเบียนตามประเภท (LPADM05/Get_SumRegisterType)
   * ใช้สำหรับกราฟสรุปหรือแสดงข้อมูลรวม
   */
  GetDataListSummary(body = {}, headers) {
    const data = {
      request_dtm_from:
        body.request_dtm_from === "" || body.request_dtm_from === undefined
          ? ""
          : dateFormat(body.request_dtm_from, "yyyymmdd"),
      response_dtm_to:
        body.response_dtm_to === "" || body.response_dtm_to === undefined
          ? ""
          : dateFormat(body.response_dtm_to, "yyyymmdd"),
    };

    return requests.post(
      "backOfficeApi/LPADM05/Get_SumRegisterType",
      data,
      headers
    );
  },
};

export default ServiceLPADM05;
