// src/service/ServiceADM/ServiceLPADM04.js
import axios from "axios";
import { URL_API, config_headers } from "../Config";

/** helpers */
const getUserInfo = () => {
  try {
    const raw = localStorage.getItem("USER_DTO");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// axios instance (แนบ token อัตโนมัติ)
const api = axios.create({ timeout: 20000 });
api.interceptors.request.use(
  (cfg) => {
    const login = JSON.parse(localStorage.getItem("login"));
    const token = login?.result?.token;
    cfg.headers = { ...(cfg.headers || {}) };
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    if (!(cfg.data instanceof FormData)) {
      cfg.headers["Content-Type"] = "application/json";
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

/** ========== LPADM04 endpoints ========== */

// GET /LPADM04/Get
const getDataList = async () => {
  const headers = await config_headers();
  return api.get(URL_API("backOfficeApi/LPADM04/Get"), headers);
};

// POST /LPADM04/Add
const addData = async (formData) => {
  const headers = await config_headers();

  // สร้าง payload ให้มี field data ครอบอีกชั้น
  const payload = {
    data: {
      ...formData,
      form_seq: 0, // เปลี่ยนกลับเป็น 0 แทน null เพราะ backend ต้องการ Int64
      record_status: "N",
      random_num: 1,
      ...(getUserInfo() ? { user_dto: getUserInfo() } : {}),
    },
  };

  console.log("[LPADM04/Add] payload:", payload);

  return api.post(URL_API("backOfficeApi/LPADM04/Add"), payload, headers);
};

// PUT /LPADM04/Update
const updateData = async (formData) => {
  const headers = await config_headers();
  const payload = {
    ...formData,
    ...(getUserInfo() ? { user_dto: getUserInfo() } : {}),
  };
  return api.put(URL_API("backOfficeApi/LPADM04/Update"), payload, headers);
};

// DELETE /LPADM04/Delete?id=123   (ตามภาพใน Network ใช้ query param ชื่อ id)
const deleteData = async (id) => {
  const headers = await config_headers();
  return api.delete(URL_API("backOfficeApi/LPADM04/Delete"), {
    ...headers,
    params: { id },
  });
};

// GET /LPADM04/GetDataSurveyUserByFormID?id=123
const getDataSurveyUserByFormID = async (form) => {
  const id = form?.form_seq ?? form?.id ?? form;
  const headers = await config_headers();
  return api.get(URL_API("backOfficeApi/LPADM04/GetDataSurveyUserByFormID"), {
    ...headers,
    params: { id },
  });
};

// POST /LPADM04/AddSurveyUser
const addSurveyUser = async (form, list) => {
  const headers = await config_headers();
  const payload = {
    form_seq: form?.form_seq ?? form?.id ?? form,
    users: list, // ปรับ key ให้ตรงหลังบ้านถ้าต้องการ (เช่น user_list)
    ...(getUserInfo() ? { user_dto: getUserInfo() } : {}),
  };
  return api.post(
    URL_API("backOfficeApi/LPADM04/AddSurveyUser"),
    payload,
    headers
  );
};

// GET /LPADM04/GetDataSurveyListByFormID?id=123
const GetDataSurveyUserByFormID = async (form) => {
  const id = form?.form_seq ?? form?.id ?? form;
  const headers = await config_headers();
  return api.get(URL_API("backOfficeApi/LPADM04/GetDataSurveyUserByFormID"), {
    ...headers,
    params: { id },
  });
};

// POST /LPADM04/AddSurveyList
const addSurveyList = async (list) => {
  const headers = await config_headers();
  const payload = {
    list, // ปรับโครงรายการคำถาม/คำตอบให้ตรงหลังบ้านได้ที่นี่
    ...(getUserInfo() ? { user_dto: getUserInfo() } : {}),
  };
  return api.post(
    URL_API("backOfficeApi/LPADM04/AddSurveyList"),
    payload,
    headers
  );
};

export default {
  getDataList,
  addData,
  updateData,
  deleteData,
  getDataSurveyUserByFormID,
  addSurveyUser,
  GetDataSurveyUserByFormID,
  addSurveyList,
};
