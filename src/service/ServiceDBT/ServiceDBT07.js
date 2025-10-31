import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
import { formatDateAPI } from "../../utils/DateUtil";
var dateFormat = require("dateformat");

export const DBT07GetDataList = async (body) => {
  let data = {
    start_date:
      body.start_date !== "" ? formatDateAPI(body.start_date, false) : "",
    end_date: body.end_date !== "" ? formatDateAPI(body.end_date, false) : "",
    tb_mm_transfer_job_seq: body.tb_mm_transfer_job_seq,
  };
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/DBT07/GetDataList"), data, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DBT07CreateData = async (body, dataSelect) => {
  let job_pattern = "";
  for (let i = 0; i < dataSelect.length; i++) {
    if (job_pattern === "") {
      job_pattern = dataSelect[i].transfer_data_seq;
    } else {
      job_pattern = job_pattern + "," + dataSelect[i].transfer_data_seq;
    }
  }
  let interval_month = "";
  for (let i = 0; i < body.interval_month.length; i++) {
    if (interval_month === "") {
      interval_month = body.interval_month[i];
    } else {
      interval_month = interval_month + "," + body.interval_month[i];
    }
  }

  let data = {
    transfer_ord: 0,
    job_pattern: job_pattern.toString(),
    job_detail: body.job_detail,
    schedule_mode: body.schedule_mode,
    schedule_type: body.schedule_type,
    start_dtm:
      body.start_dtm != ""
        ? dateFormat(body.start_dtm, "yyyy-mm-dd'T'HH:MM:ss")
        : "",
    next_run_time:
      body.next_run_time != ""
        ? dateFormat(body.next_run_time, "yyyy-mm-dd'T'HH:MM:ss")
        : "",
    last_run_time:
      body.last_run_time != ""
        ? dateFormat(body.last_run_time, "yyyy-mm-dd'T'HH:MM:ss")
        : "",
    interval_minute: body.interval_minute,
    interval_day_of_week: body.interval_day_of_week,
    interval_day_of_month: body.interval_day_of_month,
    interval_month: interval_month,
    record_status: "N",
  };

  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/DBT07/CreateData"), data, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DBT07UpdateData = async (body, dataSelect) => {
  let job_pattern = "";
  for (let i = 0; i < dataSelect.length; i++) {
    if (job_pattern === "") {
      job_pattern = dataSelect[i].transfer_data_seq;
    } else {
      job_pattern = job_pattern + "," + dataSelect[i].transfer_data_seq;
    }
  }
  let interval_month = "";
  for (let i = 0; i < body.interval_month.length; i++) {
    if (interval_month === "") {
      interval_month = body.interval_month[i];
    } else {
      interval_month = interval_month + "," + body.interval_month[i];
    }
  }

  let data = {
    transfer_job_seq: body.transfer_job_seq,
    transfer_ord: body.transfer_ord,
    job_pattern: job_pattern.toString(),
    job_detail: body.job_detail,
    schedule_mode: body.schedule_mode,
    schedule_type: body.schedule_type,
    start_dtm:
      body.start_dtm != ""
        ? dateFormat(body.start_dtm, "yyyy-mm-dd'T'HH:MM:ss")
        : "",
    next_run_time:
      body.next_run_time != ""
        ? dateFormat(body.next_run_time, "yyyy-mm-dd'T'HH:MM:ss")
        : "",
    last_run_time:
      body.last_run_time != ""
        ? dateFormat(body.last_run_time, "yyyy-mm-dd'T'HH:MM:ss")
        : "",
    interval_minute: body.interval_minute === null ? 0 : body.interval_minute,
    interval_day_of_week:
      body.interval_day_of_week === null ? 0 : body.interval_day_of_week,
    interval_day_of_month:
      body.interval_day_of_month === null ? "" : body.interval_day_of_month,
    interval_month: interval_month,
    record_status: body.record_status,
  };

  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/DBT07/UpdateData"), data, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DBT07SetRecordStatus = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT07/SetRecordStatus"),
          body,
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

export const DBT07UpdateNextRunTime = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT07/UpdateNextRunTime"),
          body,
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
