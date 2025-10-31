import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
var dateFormat = require("dateformat");

export const DBT05GetDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DBT05/GetDataList"),
          {
            start_date: dateFormat(body.start_date, "yyyymmdd"),
            end_date: dateFormat(body.end_date, "yyyymmdd"),
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

export const DBT05CreateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DBT05/CreateData"),
          {
            source_seq: parseInt(body.source_seq),
            transfer_data_seq: parseInt(body.transfer_data_seq),
            source_schema: body.source_schema,
            land_no: body.land_no,
            utmmap1: body.utmmap1,
            utmmap2: body.utmmap2,
            utmmap3: body.utmmap3,
            utmmap4: body.utmmap4,
            utmscale: body.utmscale,
            process_status: 0,
            record_status: "N",
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

export const DBT05UpdateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT05/UpdateData"),
          {
            transfer_condition_seq: body.transfer_condition_seq,
            source_seq: parseInt(body.source_seq),
            transfer_data_seq: parseInt(body.transfer_data_seq),
            source_schema: body.source_schema,
            land_no: body.land_no,
            utmmap1: body.utmmap1,
            utmmap2: body.utmmap2,
            utmmap3: body.utmmap3,
            utmmap4: body.utmmap4,
            utmscale: body.utmscale,
            process_status: body.process_status,
            record_status: body.record_status,
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

export const DBT05RunProcess = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT05/RunProcess"),
          {
            transfer_condition_seq: body.transfer_condition_seq,
            source_table: body.source_table,
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
