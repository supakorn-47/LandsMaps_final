// 📁 src/service/ServiceADM/ServiceLPADM04.js
import axios from "axios";

// ✅ URL หลักของ backend (แก้ให้ตรงกับ server ของคุณ)
const BASE_URL = "https://100.65.4.47:7293/backOfficeApi/LPADM04";

// ✅ ดึง user_dto จริงจาก localStorage
const getUserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem("USER_DTO"));
  if (!userInfo) {
    throw new Error("USER_DTO not found in localStorage");
  }
  return userInfo;
};

// ✅ สร้าง instance axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // 20 วินาที กัน timeout
});

// ✅ Interceptors แนบ token ทุก request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("USER_DTO"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptors สำหรับ debug response/error
api.interceptors.response.use(
  (response) => {
    console.log("✅ [API SUCCESS]", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("❌ [API ERROR]", error.config?.url, error.message);
    return Promise.reject(error);
  }
);

/*───────────────────────────────
 📡 SERVICE FUNCTIONS
───────────────────────────────*/

// ✅ GET: ดึงข้อมูลแบบสำรวจทั้งหมด
const getDataList = async () => {
  return api.get("/Get");
};

// ✅ POST: เพิ่มข้อมูลแบบสำรวจ
const addData = async (formData) => {
  const user = getUserInfo();

  const payload = {
    form_seq: 0, // เพิ่มใหม่ = 0
    form_date: formData.form_date,
    form_name_th: formData.form_name_th || "",
    form_name_en: formData.form_name_en || "",
    form_start_date: formData.form_start_date,
    form_finish_date: formData.form_finish_date,
    form_remark: formData.form_remark || "",
    random_num: formData.random_num || 0,
    record_status: "N",
    user_dto: user,
  };

  console.log("📤 [Add Payload]", payload);
  return api.post("/Add", payload);
};

// ✅ PUT: แก้ไขข้อมูลแบบสำรวจ
const updateData = async (formData) => {
  const user = getUserInfo();

  const payload = {
    form_seq: formData.form_seq,
    form_date: formData.form_date,
    form_name_th: formData.form_name_th,
    form_name_en: formData.form_name_en,
    form_start_date: formData.form_start_date,
    form_finish_date: formData.form_finish_date,
    form_remark: formData.form_remark,
    random_num: formData.random_num,
    record_status: formData.record_status || "N",
    user_dto: user,
  };

  console.log("📤 [Update Payload]", payload);
  return api.put("/Update", payload);
};

// ✅ PUT: ยกเลิกข้อมูล (เปลี่ยนสถานะเป็น C)
const cancelData = async (form_seq) => {
  const user = getUserInfo();
  const payload = {
    form_seq,
    record_status: "C",
    user_dto: user,
  };
  console.log("📤 [Cancel Payload]", payload);
  return api.put("/Update", payload);
};

// ✅ PUT: ลบข้อมูล (เปลี่ยนสถานะเป็น D)
const deleteData = async (form_seq) => {
  const user = getUserInfo();
  const payload = {
    form_seq,
    record_status: "D",
    user_dto: user,
  };
  console.log("📤 [Delete Payload]", payload);
  return api.put("/Update", payload);
};

// ✅ POST: อัปเดตลำดับข้อมูล (UpdateOrder)
const updateOrder = async (orderList) => {
  const user = getUserInfo();
  const payload = {
    order_seq_list: orderList,
    user_dto: user,
  };
  console.log("📤 [UpdateOrder Payload]", payload);
  return api.post("/UpdateOrder", payload);
};

// ✅ Export ทั้งหมด
export default {
  getDataList,
  addData,
  updateData,
  cancelData,
  deleteData,
  updateOrder,
};
