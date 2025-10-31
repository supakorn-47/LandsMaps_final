import axios from "axios";
import { URL_API } from "../Config";
import { getSession } from "../../utils/Crypto";

const api = axios.create({
  baseURL: URL_API("/backOfficeApi/LPASM01"),
  headers: {},
});

const decodeJwt = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json || null;
  } catch (_) {
    return null;
  }
};

/**
 * อ่านข้อมูล user และ token จาก session/local storage
 */
const getUserInfo = async () => {
  try {
    const sessionLogin = await getSession("login");
    const sessionToken = sessionLogin?.result?.token || sessionLogin?.token || "";
    let user = sessionLogin?.result?.user_dto || sessionLogin?.user_dto || {};

    // เติมค่าที่จำเป็นจาก JWT หากขาด
    const claims = sessionToken ? decodeJwt(sessionToken) : null;
    if (!user || Object.keys(user).length === 0) user = {};
    if (!user.user_id) {
      user.user_id =
        claims?.preferred_username ||
        claims?.unique_name ||
        claims?.sub ||
        claims?.name ||
        "";
    }
    if (!user.fullname) user.fullname = claims?.name || user.user_id || "";
    // ค่าที่ backend มักบังคับใช้
    if (!user.person_id) user.person_id = "0";
    if (!user.register_seq) user.register_seq = "0";
    if (!user.register_type_seq) user.register_type_seq = "6";
    if (!user.register_type_name) user.register_type_name = "ADMIN";
    user.token = sessionToken;
    user.token_expires_dtm = new Date().toISOString();

    return { token: sessionToken, user };
  } catch (err) {
    console.error("[getUserInfo Error]", err);
    return { token: "", user: {} };
  }
};

// interceptor: แนบ Authorization header ให้ทุก request
api.interceptors.request.use(
  async (config) => {
    const { token } = await getUserInfo();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// interceptor: log error ทุกครั้งที่ API ตอบ error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error.config?.url, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * ดึงข้อมูลกลุ่มผู้ใช้งาน
 */
const getDataList = async () => {
  try {
    const params = { t: Date.now() };
    const urlPreview = api.getUri({ url: "/Get", params });
    console.log("[LPASM01] GET URL:", urlPreview);
    const res = await api.get("/Get", { params });
    return res;
  } catch (err) {
    console.error("getDataList error:", err);
    throw err;
  }
};

/**
 * เพิ่มข้อมูลกลุ่มผู้ใช้งาน
 */
const addData = async (formData) => {
  const { token, user } = await getUserInfo();

  const payload = {
    // เพิ่มใหม่: ไม่ต้องส่ง seq ให้ backend สร้างเอง
    register_type_name: String(formData.register_type_name || "").trim(),
    register_type_ord: Number(formData.register_type_ord || 1),
    register_type_flag:
      formData.register_type_flag === 0 || formData.register_type_flag === "0"
        ? 0
        : 1,
    remark: formData.remark ?? "",
    record_status: formData.record_status || "A",
    user_dto: user,
  };

  console.log("[Add Payload]", payload);

  try {
    const urlPreview = api.getUri({ url: "/Add" });
    console.log("[LPASM01] ADD URL:", urlPreview);
    const res = await api.post("/Add", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return res.data;
  } catch (err) {
    console.error("[API Error /Add]", err.response?.data);
    throw err;
  }
};

/**
 * แก้ไขข้อมูลกลุ่มผู้ใช้งาน
 */
const updateData = async (formData) => {
  const { token, user } = await getUserInfo();

  // ✅ ปรับ payload ให้ตรงกับ type ที่ backend คาดหวัง
  const payload = {
    register_type_seq: Number(formData.register_type_seq || 0),
    register_type_name: String(formData.register_type_name || "").trim(),
    register_type_ord: Number(formData.register_type_ord || 1),

    // ✅ register_type_flag ต้องส่งเป็น "1"/"0" (string)
    register_type_flag:
      formData.register_type_flag === 0 || formData.register_type_flag === "0"
        ? "0"
        : "1",

    remark: formData.remark ?? "",

    // ✅ record_status ให้ส่ง "A" ถ้า API ไม่รองรับ "C"
    record_status:
      formData.record_status === "C" ? "A" : formData.record_status || "A",

    // ✅ user_dto ต้องแน่ใจว่าเป็น object ที่มี type ถูกต้อง
    user_dto: {
      user_id: user?.user_id || "supakorn",
      fullname: user?.fullname || "supakorn",
      person_id: Number(user?.person_id || 0),
      register_seq: Number(user?.register_seq || 0),
      register_type_seq: Number(user?.register_type_seq || 6),
    },
  };

  console.log("[Update Payload]", payload);

  try {
    const urlPreview = api.getUri({ url: "/Update" });
    console.log("[LPASM01] UPDATE URL:", urlPreview);

    const res = await api.put("/Update", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("[Update Response]", res.data);
    return res.data;
  } catch (err) {
    console.error("[API Error /Update]", err.response?.data);
    console.error(
      "Validation detail:",
      JSON.stringify(err.response?.data?.errors, null, 2)
    );
    throw err;
  }
};


/**
 * ลบข้อมูล (อัปเดตสถานะเป็น D)
 */
const deleteData = async (seq) => {
  const { token, user } = await getUserInfo();

  const payload = {
    register_type_seq: seq,
    remark: "ลบข้อมูล",
    record_status: "D",
    user_dto: user,
  };

  console.log("[Delete Payload]", payload);

  try {
    const urlPreview = api.getUri({ url: "/Update" });
    console.log("[LPASM01] DELETE(URL=Update) URL:", urlPreview);
    const res = await api.put("/Update", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("[Delete Response]", res.data);
    return res.data;
  } catch (err) {
    console.error("[API Error /Delete]", err.response?.data);
    throw err;
  }
};

/**
 * อัปเดตลำดับ order
 */
const updateOrder = async (orderList) => {
  const { user } = await getUserInfo();
  const payload = {
    data: {
      order_seq_list: orderList,
      user_dto: user,
    },
  };
  console.log("[UpdateOrder Payload]", payload);
  return api.post("/UpdateOrder", payload);
};

export default {
  getDataList,
  addData,
  updateData,
  updateOrder,
  deleteData,
};
