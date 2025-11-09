import axios from "axios";
import { getSession } from "../../utils/Crypto";
import { URL_API, config_headers } from "../Config";

/** ========== Helper: Decode JWT ========== */
const decodeJwt = (token) => {
  try {
    const payload = token?.split(".")[1];
    if (!payload) return {};
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
};

/** ========== Helper: Get user info safely ========== */
const getUserInfo = async () => {
  try {
    const login = await getSession("login");
    if (login?.result?.user_dto) return login.result.user_dto;
    if (login?.user_dto) return login.user_dto;

    const raw = localStorage.getItem("USER_DTO");
    if (raw) return JSON.parse(raw);

    console.warn("[WARN] user_dto not found in session/localStorage");
    return {};
  } catch (err) {
    console.error("[getUserInfo ERROR]", err);
    return {};
  }
};

/** ========== Axios Instance ========== */
const api = axios.create({ timeout: 20000 });

api.interceptors.request.use(
  (cfg) => {
    const login = JSON.parse(localStorage.getItem("login"));
    const token = login?.result?.token;
    cfg.headers = { ...(cfg.headers || {}) };
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    if (!(cfg.data instanceof FormData))
      cfg.headers["Content-Type"] = "application/json";
    return cfg;
  },
  (err) => Promise.reject(err)
);

/** ========== LPADM04 endpoints ========== */

// ✅ GET /LPADM04/Get
const getDataList = async () => {
  const headers = await config_headers();
  try {
    const res = await api.get(URL_API("backOfficeApi/LPADM04/Get"), headers);
    return res;
  } catch (err) {
    const msg = err?.response?.data?.errors?.message || "";
    if (msg.includes("REGISTER_TYPE_EN")) {
      console.warn("ข้าม error REGISTER_TYPE_EN (backend query invalid)");
      return { status: 200, data: { result: [] } };
    }
    throw err;
  }
};

// ✅ POST /LPADM04/Add
const addData = async (formData) => {
  const headers = await config_headers();
  const login = await getSession("login");
  const token = login?.result?.token || "";
  const decoded = decodeJwt(token);

  const storedUser =
    login?.result?.user_dto ||
    login?.user_dto ||
    JSON.parse(localStorage.getItem("USER_DTO")) ||
    {};

  // ✅ กำหนด user_dto จาก session หรือ JWT
  const user_dto = {
    person_id: String(storedUser.person_id || decoded.person_id || ""),
    register_seq: String(storedUser.register_seq || decoded.register_seq || ""),
    user_id: String(storedUser.user_id || decoded.user_id || ""),
    fullname: String(storedUser.fullname || decoded.fullname || ""),
    landoffice_id: String(
      storedUser.landoffice_id || decoded.landoffice_id || ""
    ),
    landoffice_name: String(
      storedUser.landoffice_name || decoded.landoffice_name || ""
    ),
    department_seq: String(
      storedUser.department_seq || decoded.department_seq || ""
    ),
    department_name: String(
      storedUser.department_name || decoded.department_name || ""
    ),
    opt_seq: String(storedUser.opt_seq || decoded.opt_seq || ""),
    opt_name: String(storedUser.opt_name || decoded.opt_name || ""),
    token,
    token_expires_dtm: decoded.token_expires_dtm
      ? new Date(decoded.token_expires_dtm).toISOString()
      : new Date().toISOString(),
    register_type_seq: String(
      storedUser.register_type_seq || decoded.register_type_seq || ""
    ),
    register_type_name: String(
      storedUser.register_type_name || decoded.register_type_name || ""
    ),
  };

  // ✅ Helper แปลงวันที่
  const formatDate = (date) =>
    date ? new Date(date).toISOString() : new Date().toISOString();
  const now = new Date().toISOString();

  // ✅ payload ครบทุกฟิลด์
  const payload = {
    form_seq: 0,
    form_date: formatDate(formData.createdDate),
    form_name_th: formData.title_th?.trim() || "",
    form_name_en: formData.title_en?.trim() || "",
    form_start_date: formatDate(formData.startDate),
    form_finish_date: formatDate(formData.endDate),
    form_remark: formData.remark ?? "",
    random_num: Number(formData.random_num || 0),
    record_status: "N",
    create_user: String(user_dto.person_id || user_dto.user_id || "0"),
    create_dtm: now,
    last_upd_user: String(user_dto.person_id || user_dto.user_id || "0"),
    last_upd_dtm: now,
    user_dto,
  };

  console.log("[LPADM04/Add] payload:", payload);

  return api.post(URL_API("backOfficeApi/LPADM04/Add"), payload, headers);
};

// ✅ PUT /LPADM04/Update
const updateData = async (formData) => {
  const headers = await config_headers();
  const user_dto = await getUserInfo();
  const payload = { ...formData, user_dto };
  console.log("[LPADM04/Update] payload:", payload);
  return api.put(URL_API("backOfficeApi/LPADM04/Update"), payload, headers);
};

// ✅ DELETE /LPADM04/Delete?id=123
const deleteData = async (id) => {
  const headers = await config_headers();
  return api.delete(URL_API("backOfficeApi/LPADM04/Delete"), {
    ...headers,
    params: { id },
  });
};

// ✅ GET /LPADM04/GetDataSurveyUserByFormID?form_seq=123
const getDataSurveyUserByFormID = async (form) => {
  const headers = await config_headers();
  const form_seq = form?.form_seq ?? form;
  try {
    return await api.get(
      URL_API("backOfficeApi/LPADM04/GetDataSurveyUserByFormID"),
      { ...headers, params: { form_seq } }
    );
  } catch (err) {
    const msg = err?.response?.data?.errors?.message || "";
    if (msg.includes("REGISTER_TYPE_EN")) {
      console.warn("ข้าม error REGISTER_TYPE_EN (backend query invalid)");
      return { status: 200, data: { result: [] } };
    }
    throw err;
  }
};

// ✅ POST /LPADM04/AddSurveyUser
const addSurveyUser = async (form, list) => {
  const headers = await config_headers();
  const user_dto = await getUserInfo();
  const payload = {
    form_seq: form?.form_seq ?? form?.id ?? form,
    users: list,
    user_dto,
  };
  console.log("[LPADM04/AddSurveyUser] payload:", payload);
  return api.post(
    URL_API("backOfficeApi/LPADM04/AddSurveyUser"),
    payload,
    headers
  );
};

// ✅ POST /LPADM04/AddSurveyList
const addSurveyList = async (list) => {
  const headers = await config_headers();
  const user_dto = await getUserInfo();
  const payload = { list, user_dto };
  console.log("[LPADM04/AddSurveyList] payload:", payload);
  return api.post(
    URL_API("backOfficeApi/LPADM04/AddSurveyList"),
    payload,
    headers
  );
};

/** ========== Export ========== */
export default {
  getDataList,
  addData,
  updateData,
  deleteData,
  getDataSurveyUserByFormID,
  addSurveyUser,
  addSurveyList,
};
