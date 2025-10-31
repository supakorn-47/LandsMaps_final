import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
var dateFormat = require("dateformat");

export const DBT04GetDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/DBT04/GetDataList"), {}, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DBT04RunProcess = async (source_seq, schedule_mode) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT04/RunProcess"),
          {
            source_seq: source_seq,
            schedule_mode: schedule_mode,
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
