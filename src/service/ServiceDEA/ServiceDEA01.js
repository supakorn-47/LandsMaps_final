import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

export const DEA01GetDataList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(URL_API("backOfficeApi/LPASM02/Get"), authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DEA01CreateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/LPASM02/Add"),
          {
            department_name_th: body.department_name_th,
            department_name_en: body.department_name_en,
            department_type: body.department_type,
            // "consumer_username": body.consumer_username.toUpperCase(),
            // "custom_id": body.custom_id,
            // "consumer_id": body.consumer_id,
            // "jwt_key": body.jwt_key,
            // "jwt_secret": body.jwt_secret,
            // "jwt_algorithm": body.jwt_algorithm,
            remark: body.remark,
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

export const DEA01UpdateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers_fromData();
      await axios
        .put(
          URL_API("backOfficeApi/LPASM02/Update"),
          {
            department_seq: body.department_seq,
            department_name_th: body.department_name_th,
            department_name_en: body.department_name_en,
            department_type: body.department_type,
            // "consumer_username": body.consumer_username.toUpperCase(),
            // "custom_id": body.custom_id,
            // "consumer_id": body.consumer_id,
            // "jwt_key": body.jwt_key,
            // "jwt_secret": body.jwt_secret,
            // "jwt_algorithm": body.jwt_algorithm,
            remark: body.remark,
            record_status: body.record_status,
          },
          authorization
        )
        .then((res) => {
          console.log("res:", res);

          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const DEA01CancelData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .delete(URL_API("backOfficeApi/LPASM02/Delete"), {
          data: {
            department_seq: body.department_seq,
            record_status: "C",
          },
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

export const DEA01GetDepartmentServiceList = async ({ department_seq }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(
          URL_API(
            // `apiWebAdmin/DEA01/GetDepartmentServiceList?department_seq=${department_seq}`
            `backOfficeApi/LPADM02/GetRegisterService?register_seq=${department_seq}`
          ),
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

export const DEA01AddDepartmentService = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DEA01/AddDepartmentService"),
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

export const DEA01GetAccessToken = async (departmentSeq) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(
          URL_API(
            "backOfficeApi/DEX01/GetAccessToken?department_seq=" + departmentSeq
          ),
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

export const DEA01CreateAccessToken = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/DEX01/CreateAccessToken"),
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

export const DEA01UpdateAccessToken = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/DEX01/UpdateAccessToken"),
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

export const DEA01GetJWTKong = async (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(
          URL_API(
            "backOfficeApi/DEX01/GetJWTKong?consumer_username=" +
              username.toUpperCase()
          ),
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
