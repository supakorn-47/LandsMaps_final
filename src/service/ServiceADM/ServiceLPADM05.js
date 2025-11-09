// src/service/ServiceADM/ServiceLPADM05.js
import requests from "../httpServices";
var dateFormat = require("dateformat");

const ServiceLPADM05 = {
  GetDataList(body = {}, headers) {
    const data = {
      request_dtm_from:
        !body.request_dtm_from ? "" : dateFormat(body.request_dtm_from, "yyyymmdd"),
      response_dtm_to:
        !body.response_dtm_to ? "" : dateFormat(body.response_dtm_to, "yyyymmdd"),
      totalRecords: body.totalRecords ?? 0,
      pageofnum: body.pageofnum ?? 1,
      rowofpage: body.rowofpage ?? 20,
    };
    return requests.post("backOfficeApi/LPADM05/Get", data, headers);
  },

  GetDataListSummary(body = {}, headers) {
    const data = {
      request_dtm_from:
        !body.request_dtm_from ? "" : dateFormat(body.request_dtm_from, "yyyymmdd"),
      response_dtm_to:
        !body.response_dtm_to ? "" : dateFormat(body.response_dtm_to, "yyyymmdd"),
    };
    return requests.post("backOfficeApi/LPADM05/Get_SumRegisterType", data, headers);
  },

  // ✅ ใช้ POST (ตรงกับรูปแบบ service อื่นของระบบ)
  GetDepartmentList(body = {}, headers) {
    const data = {
      department_seq: body.department_seq ?? 0,
      department_name: body.department_name ?? "",
      pageofnum: body.pageofnum ?? 0,
      rowofpage: body.rowofpage ?? 10000,
    };
    return requests.get("backOfficeApi/LPASM02/Get", data, headers);
  },


};

export default ServiceLPADM05;
