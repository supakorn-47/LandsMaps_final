import { setSession, getSession } from "../utils/Crypto";

// ใช้ optional chaining เพื่อป้องกัน process undefined
console.log(
  "ENV >>>",
  process?.env?.REACT_APP_URL_API_WEB || "https://100.123.134.37:7293"
);

export const config_headers = async () => {
  try {
    const login = await getSession("login");
    return {
      headers: {
        Authorization: "Bearer " + (login?.result?.token || ""),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  } catch {
    return {};
  }
};

export const config_headers_fromData = async () => {
  try {
    const login = await getSession("login");
    return {
      headers: {
        Authorization: "Bearer " + (login?.result?.token || ""),
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    };
  } catch {
    return {};
  }
};

export const config_headers_delete = async (params) => {
  try {
    const login = await getSession("login");
    return {
      data: params,
      headers: {
        Authorization: "Bearer " + (login?.result?.token || ""),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  } catch {
    return {};
  }
};

export const URL_API = (path) => {
  const base = (
    process?.env?.REACT_APP_URL_API_WEB || "https://100.123.134.37:7293"
  ).replace(/\/$/, "");
  const ensuredPath = "/" + String(path || "").replace(/^\/+/, "");
  const full = `${base}${ensuredPath}`.replace(/([^:]\/)\/+/g, "$1");
  console.log("[URL_API]", full);
  return full;
};

export const URL_API_EXPORT = (path) => {
  const base = (
    process?.env?.REACT_APP_URL_API_EXPORT || "https://100.123.134.37:7293"
  ).replace(/\/$/, "");
  return `${base}${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export const URL_API_LOG = (path) => {
  const base = (
    process?.env?.REACT_APP_URL_API_LOG || "https://100.123.134.37:7293"
  ).replace(/\/$/, "");
  return `${base}${path}`.replace(/([^:]\/)\/+/g, "$1");
};
