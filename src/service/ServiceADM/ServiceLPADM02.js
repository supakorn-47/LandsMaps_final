import axios from "axios";
import { config_headers, URL_API } from "../Config";
import { getDateTime } from "../../utils/DateUtil";

// -------------------- GET DATA LIST --------------------
const getDataList = async (body = {}) => {
  const authorization = await config_headers();

  const toYMD = (v, fallback) => {
    if (v) {
      if (typeof v === "string") {
        const s = v.replace(/[^0-9]/g, "");
        if (s.length === 8) return s;
      } else {
        const d = new Date(v);
        if (!isNaN(d)) {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}${m}${day}`;
        }
      }
    }
    return fallback;
  };

  const toStrRequired = (v, fallback) => {
    if (v === null || v === undefined) return fallback;
    const s = String(v).trim();
    return s === "" ? fallback : s;
  };

  const payload = {
    create_dtm_from: toYMD(body.create_dtm_from),
    create_dtm_to: toYMD(body.create_dtm_to),
    person_fullname: toStrRequired(body.person_fullname, ""),
    province_seq: toStrRequired(body.province_seq, "-1"),
    register_type_seq: toStrRequired(body.register_type_seq, "-1"),
    department_seq: toStrRequired(body.department_seq, "-1"),
    totalRecords: toStrRequired(body.totalRecords ?? 0, "0"),
    pageofnum: toStrRequired(body.pageofnum ?? 0, "0"),
    rowofpage: toStrRequired(body.rowofpage ?? 100, "100"),
  };

  const url = URL_API("backOfficeApi/LPADM02/Get");
  const res = await axios.post(url, payload, authorization);
  return res.data;
};

// -------------------- CREATE --------------------
const addData = async (body) => {
  const authorization = await config_headers();
  const res = await axios.post(
    URL_API("backOfficeApi/LPADM02/Add"),
    {
      ...body,
      person_birthdate: getDateTime(body.person_birthdate),
      approve_flag: 1,
      person_id:
        typeof body.person_id === "string"
          ? parseFloat(body.person_id.replace(/-/g, ""))
          : body.person_id,
    },
    authorization
  );
  return res.data;
};

// -------------------- UPDATE --------------------
const updateData = async (body) => {
  const toInt = (v, fb = -1) => {
    if (v === null || v === undefined || v === "") return fb;
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
  };
  const toStr = (v, fb = "") => {
    if (v === null || v === undefined) return fb;
    const s = String(v).trim();
    return s === "" ? fb : s;
  };

  const authorization = await config_headers();
  const register_seq = toInt(body?.register_seq, 0);
  if (!register_seq) throw new Error("register_seq is required for Update");
  const payload = {
    ...body,
    register_seq,
    department_seq: toInt(body?.department_seq, -1),
    amphur_seq: toInt(body?.amphur_seq, -1),
    opt_seq: toInt(body?.opt_seq, -1),
    province_seq: toInt(body?.province_seq, -1),
    person_fullname: toStr(body?.person_fullname, ""),
    person_birthdate: body.person_birthdate
      ? getDateTime(body.person_birthdate)
      : null,
  };

  const url = URL_API("backOfficeApi/LPADM02/Update").replace(
    /([^:]\/)\/+/g,
    "$1"
  );
  const headers = {
    ...authorization,
    headers: {
      "Content-Type": "application/json",
      ...(authorization.headers || {}),
    },
  };

  try {
    const res = await axios.put(url, payload, headers);
    return res.data;
  } catch (err) {
    if (err?.response?.status === 405) {
      const res = await axios.put(url, payload, headers);
      return res.data;
    }
    throw err;
  }
};

// -------------------- DELETE --------------------
const deleteData = async (register_seq) => {
  const authorization = await config_headers();
  const url = URL_API(
    `backOfficeApi/LPADM02/Delete?register_seq=${register_seq}&record_status=C`
  );
  const res = await axios.delete(url, { headers: authorization.headers });
  return res.data;
};

const resetPassword = async (register_seq) => {
  const authorization = await config_headers();
  const res = await axios.put(
    URL_API("backOfficeApi/LPADM02/ResetPassword?register_seq=" + register_seq),
    {},
    authorization
  );
  return res.data;
};

const verifyIdentityLandofficeAD = async (body) => {
  const authorization = await config_headers();
  const res = await axios.post(
    URL_API("backOfficeApi/LPADM02/VerifyIdentityLandofficeAD"),
    { username: body.user_id, password: body.user_password },
    authorization
  );
  return res.data;
};

const generateKey = async (action) => {
  const url =
    action === "Consumer Key"
      ? "backOfficeApi/LPADM02/GenerateConsumerKey"
      : "backOfficeApi/LPADM02/GenerateConsumerSecret";
  const authorization = await config_headers();
  const res = await axios.get(URL_API(url), authorization);
  return res.data;
};

// -------------------- GET REGISTER SERVICE --------------------
const getRegisterService = async (register_seq) => {
  const authorization = await config_headers();
  const res = await axios.get(
    URL_API(
      "backOfficeApi/LPADM02/GetRegisterService?register_seq=" + register_seq
    ),
    authorization
  );
  return res.data;
};

// -------------------- ADD REGISTER SERVICE --------------------
const addRegisterService = async (body) => {
  const authorization = await config_headers();
  const res = await axios.post(
    URL_API("backOfficeApi/LPADM02/AddRegisterService"),
    body,
    authorization
  );
  return res.data;
};

// -------------------- GET/UPDATE CONSUMER --------------------
const getConsumer = async (register_seq) => {
  const authorization = await config_headers();
  const res = await axios.get(
    URL_API(`backOfficeApi/LPADM02/GetConsumer?register_seq=${register_seq}`),
    authorization
  );
  return res.data;
};

const updateConsumer = async (body) => {
  const authorization = await config_headers();
  const res = await axios.post(
    URL_API("backOfficeApi/LPADM02/UpdateConsumer"),
    body,
    authorization
  );
  return res.data;
};

// -------------------- MASTER LOOKUPS --------------------
const MasterGetRegisterType = async (mode = 0, register_type_seq = "") => {
  const auth = await config_headers();
  const res = await axios.get(URL_API("backOfficeApi/Master/GetRegisterType"), {
    ...auth,
    params: {
      mode: Number(mode) === 1 ? 1 : 0,
      register_type_seq: String(register_type_seq || ""),
    },
  });
  return res.data;
};

const MasterGetProvince = async () => {
  const auth = await config_headers();
  const res = await axios.get(
    URL_API("backOfficeApi/Master/GetProvince"),
    auth
  );
  return res.data;
};

// ✅ เส้นที่ขอเพิ่ม: Master/GetTransferDataGroup
const MasterGetTransferDataGroup = async (mode = 0, source_schema = "") => {
  const auth = await config_headers();
  const res = await axios.get(
    URL_API("backOfficeApi/Master/GetTransferDataGroup"),
    {
      ...auth,
      params: {
        mode: Number(mode) || 0,
        source_schema: String(source_schema || ""),
      },
    }
  );
  return res.data;
};

const getTransferDataGroupOptions = async (mode = 0, source_schema = "") => {
  try {
    const data = await MasterGetTransferDataGroup(mode, source_schema);
    const list = data?.result || data?.data?.result || data?.data || [];
    return list.map((x) => ({
      label:
        x.transfer_data_group_name_th ||
        x.transfer_data_group_name ||
        x.label ||
        String(x.transfer_data_group_seq || x.value || ""),
      value: String(x.transfer_data_group_seq || x.value || ""),
    }));
  } catch (e) {
    console.error("[getTransferDataGroupOptions] error:", e);
    return [];
  }
};

// -------------------- DEPARTMENT (LPASM02) --------------------
const getDepartmentList = async (params = {}) => {
  const auth = await config_headers();
  const query = {
    department_seq: params.department_seq ?? 0,
    department_name: params.department_name ?? "",
    record_status: params.record_status ?? "N",
    pageofnum: params.pageofnum ?? 0,
    rowofpage: params.rowofpage ?? 10000,
  };
  const res = await axios.get(URL_API("backOfficeApi/LPASM02/Get"), {
    ...auth,
    params: query,
  });
  return res.data;
};

const getDepartmentOptions = async (params = {}) => {
  try {
    const data = await getDepartmentList(params);
    const list = data?.result || data?.data?.result || data?.data || [];
    return list.map((x) => ({
      label:
        x.department_name_th ||
        x.department_name ||
        `หน่วยงาน ${x.department_seq}`,
      value: String(x.department_seq ?? ""),
    }));
  } catch (error) {
    console.error("[getDepartmentOptions] error:", error);
    return [];
  }
};

const getBySeq = async (register_seq) => {
  const authorization = await config_headers();
  const url = URL_API("backOfficeApi/LPADM02/Get");
  const payload = {
    register_seq: Number(register_seq) || 0,
    pageofnum: 0,
    rowofpage: 1,
  };
  const res = await axios.post(url, payload, authorization);
  const list = res?.data?.result || [];
  return list[0] || null;
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
  addRegisterService,
  getConsumer,
  updateConsumer,
  MasterGetRegisterType,
  MasterGetProvince,
  MasterGetTransferDataGroup,
  getTransferDataGroupOptions,
  getDepartmentList,
  getDepartmentOptions,
  getBySeq,
};
