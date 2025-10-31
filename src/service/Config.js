import { setSession, getSession } from "../utils/Crypto";

/**
 * Header ปกติ (มี token)
 */
export const config_headers = async () => {
  try {
    const login = await getSession("login");
    return {
      headers: {
        Authorization: "Bearer " + (login?.result?.token || ""),
      },
    };
  } catch (error) {
    console.error("config_headers error:", error);
    return {};
  }
};

/**
 * Header สำหรับส่ง multipart/form-data
 */
export const config_headers_fromData = async () => {
  try {
    const login = await getSession("login");
    return {
      headers: {
        Authorization: "Bearer " + (login?.result?.token || ""),
        "Content-Type": "multipart/form-data",
      },
    };
  } catch (error) {
    console.error("config_headers_fromData error:", error);
    return {};
  }
};

/**
 * Header สำหรับ DELETE พร้อมแนบ body (params)
 */
export const config_headers_delete = async (params) => {
  try {
    const login = await getSession("login");
    return {
      data: params,
      headers: {
        Authorization: "Bearer " + (login?.result?.token || ""),
      },
    };
  } catch (error) {
    console.error("config_headers_delete error:", error);
    return {};
  }
};

export const URL_API = (path) => {
  const host = String(window.location.hostname || "");
  const isDevEnv = process.env.NODE_ENV === "development";
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "::1";
  const isPrivateIP = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
  const isLocal = isDevEnv || isLocalHost || isPrivateIP;

  const base = (process.env.REACT_APP_URL_API_WEB || "https://100.65.4.47:7293").replace(/\/$/, "");

  // ถ้า path เป็น URL เต็มอยู่แล้ว ให้ส่งกลับทันที
  if (
    typeof path === "string" &&
    (path.startsWith("http://") || path.startsWith("https://"))
  ) {
    return path;
  }

  // Normalize ให้ขึ้นต้นด้วย '/'
  const ensuredPath = "/" + String(path || "").replace(/^\/+/, "");

  // ระหว่างพัฒนา (localhost/127.0.0.1/ที่อยู่เครือข่ายภายใน) → ใช้เส้นทางสัมพัทธ์เพื่อวิ่งผ่าน CRA proxy
  if (isLocal) return ensuredPath;

  // Production/อื่นๆ → ต่อกับ base URL จริง
  return `${base}${ensuredPath}`;
};

/**
 * Base URL สำหรับ Export (PDF/Excel)
 */
export const URL_API_EXPORT = (API) => {
  const baseURL = (
    process.env.REACT_APP_URL_API_EXPORT || "https://100.65.4.47:7293"
  ).replace(/\/$/, "");
  return `${baseURL}${API}`;
};

/**
 * Base URL สำหรับ Log Service
 */
export const URL_API_LOG = (API) => {
  const baseURL = (
    process.env.REACT_APP_URL_API_LOG || "https://100.65.4.47:7293"
  ).replace(/\/$/, "");
  return `${baseURL}${API}`;
};
