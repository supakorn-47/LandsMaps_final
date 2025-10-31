import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
var dateFormat = require("dateformat");

export const DBT03GetDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DBT03/GetDataList"),
          {
            start_date: dateFormat(body.start_date, "yyyymmdd"),
            end_date: dateFormat(body.end_date, "yyyymmdd"),
            source_seq: parseInt(body.source_seq),
            transfer_data_group_seq: parseInt(body.transfer_data_group_seq),
          },
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

export const DBT03GetDetail = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DBT03/GetDetail"),
          {
            transfer_job_seq: body.transfer_job_seq,
            transfer_data_group_seq: body.transfer_data_group_seq,
            target_name: body.target_name,
          },
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

export const DBT03RunProcess = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT03/RunProcess"),
          {
            log_transfer_seq: body.log_transfer_seq,
            transfer_data_seq: body.transfer_data_seq,
          },
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
