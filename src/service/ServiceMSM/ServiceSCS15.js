import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
import { formatDateAPI } from "../../utils/DateUtil";
var dateFormat = require("dateformat");

export const SCS15GetDataList = async (body) => {
  let data = {
    ip_address: body.ip_address,
    request_dtm_from:
      body.request_dtm_from !== ""
        ? formatDateAPI(body.request_dtm_from, true)
        : "",
    request_dtm_to:
      body.request_dtm_to !== ""
        ? formatDateAPI(body.request_dtm_to, true)
        : "",
    system_seq: body.system_seq === "0" ? 0 : body.system_seq,
    function_seq: parseInt(body.function_seq, 10),
    having: parseInt(body.having, 10),
  };
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/SCS/LogServiceUsage"), data, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const SCS15GetDataDetail = async (body, rowData) => {
  let data = {
    ip_address: rowData.ip_address,
    request_dtm_from:
      body.request_dtm_from !== ""
        ? formatDateAPI(body.request_dtm_from, true)
        : "",
    request_dtm_to:
      body.request_dtm_to !== ""
        ? formatDateAPI(body.request_dtm_to, true)
        : "",
    request_dtm: rowData.request_dtm,
    system_seq: 0,
    function_seq: rowData.function_seq,
  };
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/SCS/LogServiceUsageDetail"),
          data,
          authorization
        )
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const SCS15GetTop10sageDetail = async (body) => {
  let data = {
    ip_address: body.ip_address,
    request_dtm_from:
      body.request_dtm_from !== ""
        ? formatDateAPI(body.request_dtm_from, true)
        : "",
    request_dtm_to:
      body.request_dtm_to !== ""
        ? formatDateAPI(body.request_dtm_to, true)
        : "",
    system_seq: body.system_seq === "0" ? 0 : body.system_seq,
    function_seq: parseInt(body.function_seq, 10),
    having: parseInt(body.having, 10),
  };
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/SCS/LogServiceUsageTop10"),
          data,
          authorization
        )
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
