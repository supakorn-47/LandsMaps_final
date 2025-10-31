import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
import { formatDateTH, formatDateAPI, getDateTime } from "../../utils/DateUtil";
var dateFormat = require("dateformat");

// -------------------- GET DATA LIST --------------------
const getDataList = async (body) => {
  let data = {
    create_dtm_from: body.create_dtm_from
      ? formatDateAPI(body.create_dtm_from, false)
      : null,
    create_dtm_to: body.create_dtm_to
      ? formatDateAPI(body.create_dtm_to, false)
      : null,
    person_fullname: body.person_fullname || "",
    register_type_seq:
      body.register_type_seq && body.register_type_seq !== ""
        ? parseInt(body.register_type_seq)
        : -1,
    department_seq:
      body.department_seq !== null && body.department_seq !== undefined
        ? body.department_seq
        : -1,
    province_seq:
      body.province_seq && body.province_seq !== ""
        ? body.province_seq
        : -1,
    totalRecords: body.totalRecords ?? 0,
    pageofnum: body.pageofnum ?? 0,
    rowofpage: body.rowofpage ?? 100,
  };

  return new Promise(async (resolve, reject) => {
    console.log("URL_API:", URL_API("backOfficeApi/LPADM02/Get"));
    // try {
    //   let authorization = await config_headers();
    //   const res = await axios.post(
    //     URL_API("backOfficeApi/LPADM02/Get"),
    //     data,
    //     authorization
    //   );
    //   console.log("[LPADM02/Get] Response:", res.data);
    //   resolve(res.data);
    // } catch (err) {
    //   console.error("[LPADM02/Get] Error:", err);
    //   reject(err);
    // }
  });
};


// -------------------- CREATE --------------------
const addData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      const res = await axios.post(
        URL_API("backOfficeApi/LPADM02/Add"),
        {
          ...body,
          person_birthdate: getDateTime(body.person_birthdate),
          approve_flag: 1,
          person_id:
            typeof body.person_id === "string"
              ? parseFloat(
                  body.person_id
                    .replace("-", "")
                    .replace("-", "")
                    .replace("-", "")
                    .replace("-", "")
                )
              : body.person_id,
        },
        authorization
      );
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

// -------------------- UPDATE --------------------
const updateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      const res = await axios.put(
        URL_API("backOfficeApi/LPADM02/Update"),
        {
          ...body,
          department_seq:
            body.department_seq === null || body.department_seq === undefined
              ? -1
              : body.department_seq,
          amphur_seq:
            body.amphur_seq === null || body.amphur_seq === undefined
              ? -1
              : body.amphur_seq,
          opt_seq:
            body.opt_seq === null || body.opt_seq === undefined
              ? -1
              : body.opt_seq,
          province_seq: body.province_seq === null ? -1 : body.province_seq,
        },
        authorization
      );
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

// -------------------- DELETE --------------------
const deleteData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      const res = await axios.delete(
        URL_API(`backOfficeApi/LPADM02/Delete?register_seq=${body}`),
        {
          data: {},
          headers: authorization.headers,
        }
      );
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

// -------------------- VERIFY AD --------------------
const verifyIdentityLandofficeAD = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      const res = await axios.post(
        URL_API("backOfficeApi/LPADM02/VerifyIdentityLandofficeAD"),
        {
          username: body.user_id,
          password: body.user_password,
        },
        authorization
      );
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

// -------------------- RESET PASSWORD --------------------
const resetPassword = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      const res = await axios.put(
        URL_API("backOfficeApi/LPADM02/ResetPassword?register_seq=" + body),
        {},
        authorization
      );
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

// -------------------- GENERATE KEY --------------------
const generateKey = async (action) => {
  const url =
    action === "Consumer Key"
      ? "backOfficeApi/LPADM02/GenerateConsumerKey"
      : "backOfficeApi/LPADM02/GenerateConsumerSecret";
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      const res = await axios.get(URL_API(url), authorization);
      resolve(res.data);
    } catch (err) {
      reject(err);
    }
  });
};

// -------------------- OTHER FUNCTIONS --------------------
const getRegisterService = async (body) => {
  let authorization = await config_headers();
  const res = await axios.get(
    URL_API("backOfficeApi/LPADM02/GetRegisterService?register_seq=" + body),
    authorization
  );
  return res.data;
};

const updateConsumer = async (body) => {
  let authorization = await config_headers();
  const res = await axios.post(
    URL_API("backOfficeApi/LPADM02/UpdateConsumer"),
    body,
    authorization
  );
  return res.data;
};

const addRegisterService = async (body) => {
  let authorization = await config_headers();
  const res = await axios.post(
    URL_API("backOfficeApi/LPADM02/AddRegisterService"),
    body,
    authorization
  );
  return res.data;
};

const getConsumer = async (body) => {
  let authorization = await config_headers();
  const res = await axios.get(
    URL_API(`backOfficeApi/LPADM02/GetConsumer?register_seq=${body}`),
    authorization
  );
  return res.data;
};

// -------------------- EXPORT DEFAULT --------------------
export default {
  getDataList,
  addData,
  updateData,
  deleteData,
  resetPassword,
  verifyIdentityLandofficeAD,
  generateKey,
  getRegisterService,
  updateConsumer,
  addRegisterService,
  getConsumer,
};
