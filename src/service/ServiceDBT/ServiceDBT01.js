import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

// /backOfficeApi/DEX01/GetDataList
export const DBT01GetDataList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(URL_API("backOfficeApi/DBT01/GetDataList"), authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DBT01CreateData = async (body) => {
  let source_process = [
    { label: "SOURCE", value: "1" },
    { label: "PROCESS", value: "2" },
    { label: "TARGET", value: "3" },
  ];
  const result = source_process.filter(
    (data) => data.label === body.source_process
  )[0];
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DBT01/CreateData"),
          {
            source_ord: body.source_ord === null ? 0 : body.source_ord,
            source_name: body.source_name,
            source_process: result.value,
            source_host: body.source_host,
            database_type: body.database_type,
            source_service_name: body.source_service_name,
            user_name: body.user_name,
            password: body.password,
            source_port: parseInt(body.source_port),
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

export const DBT01UpdateData = async (body) => {
  let source_process = [
    { label: "SOURCE", value: "1" },
    { label: "PROCESS", value: "2" },
    { label: "TARGET", value: "3" },
  ];
  const result = source_process.filter(
    (data) => data.label === body.source_process
  )[0];
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT01/UpdateData"),
          {
            source_seq: body.source_seq,
            source_name: body.source_name,
            source_process: result.value,
            source_host: body.source_host,
            database_type: body.database_type,
            source_service_name: body.source_service_name,
            user_name: body.user_name,
            password: body.password,
            source_port: parseInt(body.source_port),
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

export const DBT01CancelData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .delete(URL_API("backOfficeApi/DBT01/CancelData"), {
          data: body,
          headers: authorization.headers,
        })
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DBT01SetRecordStatus = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DBT01/SetRecordStatus"),
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

//Check DB
export const DBT01CheckConnectionDatabase = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DBT01/CheckConnectionDatabase"),
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
