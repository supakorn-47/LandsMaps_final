import axios from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // 👈 ยอมรับ certificate ที่ไม่ valid (เฉพาะ dev)
});

const getBaseURL = () => {
  if (typeof window === "undefined") return process.env.REACT_APP_URL_API_WEB;

  const hostname = window.location.hostname;
  const port = window.location.port;
  const pathname = window.location.pathname
    ? window.location.pathname.toLocaleLowerCase()
    : "";

  //check for use api (localhost)
  if (hostname === "localhost") {
    return process.env.REACT_APP_URL_API_WEB;
  }

  //check for use api (sitdev domain)
  if (hostname === "sitdev.dyndns.org") {
    switch (port) {
      case "7293":
        return process.env.REACT_APP_URL_API_WEB;
      default:
        return process.env.REACT_APP_URL_API_WEB;
    }
  }

  if (hostname === "ocs.pwa.co.th" && pathname.startsWith("/ocsapp")) {
    return process.env.REACT_APP_URL_API_WEB_PROD;
  }
  // check for use api (production domain)
  // add more domain if need here
  //
  //

  return process.env.REACT_APP_URL_API_WEB;
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL: baseURL,
  httpsAgent: agent, // 👈 เพิ่มตรงนี้
  Accept: "application/json",
  headers: {
    "Content-Type": "application/json",
  },
  // พี่ตง บอกให้ปิด error timeout 300000 ไปก่อน ฌ 14/08/2025
  // timeout: 300000,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.isMultipart) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    if (!res.data.success) {
      return Promise.reject(res.data.message);
    }
    return res;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;
