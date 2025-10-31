import axios from "axios";
import { URL_API, config_headers } from "../Config";

/**
 * CLASS: ใช้ใน component แบบมี state
 */
export class MasterService {
  /**
   * ใช้เรียก API จาก Master Module (พร้อม setState)
   * เช่น new MasterService().get(this, "registerType", "GetRegisterType");
   */
  get = async (_this, keyState, API, body = {}, type = "GET") => {
    return new Promise(async (resolve) => {
      try {
        const authorization = await config_headers();
        const url = URL_API("backOfficeApi/Master/" + API);
        const apiName = String(API).split("?")[0];
        const GET_ENDPOINTS = ["GetRegisterType", "GetProvince", "GetAnnounceType"]; // อนุญาต GET เท่านี้
        console.log(`[MasterService.get] ${type} URL:`, url);

        let res;
        if (GET_ENDPOINTS.includes(apiName)) {
          res = await axios.get(url, authorization);
        } else {
          // บังคับใช้ POST สำหรับ endpoint อื่นทั้งหมด (เช่น GetDataSource, GetTransferDataGroup)
          res = await axios.post(url, body, authorization);
        }

        _this.setState({ [keyState]: res.data });
        resolve(res.data);
      } catch (err) {
        console.error("[MasterService.get] Error:", err?.response || err);
        _this.setState({ [keyState]: [] });
        resolve({
          result: [],
          error: true,
          message:
            err?.response?.data?.error?.message ||
            err?.message ||
            "เกิดข้อผิดพลาดจากฝั่งเซิร์ฟเวอร์",
        });
      }
    });
  };
}

/**
 * HOOK: ใช้เรียก API Master แบบ Promise (ไม่มี state)
 * ตัวอย่าง: const res = await masterService("GetRegisterType");
 */
export const masterService = async (API, body = {}, type = "GET") => {
  return new Promise(async (resolve) => {
    try {
      const authorization = await config_headers();
      const baseUrl = "backOfficeApi/Master/";
      const fullUrl = URL_API(baseUrl + API);

      console.log(`[masterService] ${type} =>`, fullUrl);

      let res;
      const apiName = String(API).split("?")[0];
      // ใช้ GET เฉพาะ endpoint ที่ระบุไว้เท่านั้น
      const GET_ENDPOINTS = ["GetRegisterType", "GetProvince", "GetAnnounceType"];

      if (GET_ENDPOINTS.includes(apiName)) {
        res = await axios.get(fullUrl, authorization);
      } else {
        // บังคับ POST สำหรับ endpoint อื่นทั้งหมด เช่น GetDataSource, GetTransferDataGroup
        res = await axios.post(fullUrl, body, authorization);
      }

      resolve(res.data);
    } catch (err) {
      console.error("[masterService] Error detail:", {
        url: URL_API("backOfficeApi/Master/" + API),
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });

      resolve({
        result: [],
        error: true,
        status: err?.response?.status || "-",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "เกิดข้อผิดพลาดในการเชื่อมต่อ",
      });
    }
  });
};

/**
 * สำหรับ WebPortal (apiWebPortal/Master)
 */
export const masterServiceWebPortal = async (API, body = {}, type = "GET") => {
  return new Promise(async (resolve) => {
    try {
      const authorization = await config_headers();
      const baseUrl = "apiWebPortal/Master/";
      const fullUrl = URL_API(baseUrl + API);

      console.log(`[masterServiceWebPortal] ${type} =>`, fullUrl);

      let res;
      if (type === "GET") {
        res = await axios.get(fullUrl, authorization);
      } else {
        res = await axios.post(fullUrl, body, authorization);
      }

      resolve(res.data);
    } catch (err) {
      console.error("[masterServiceWebPortal] Error detail:", {
        url: URL_API("apiWebPortal/Master/" + API),
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });

      resolve({
        result: [],
        error: true,
        status: err?.response?.status || 500,
        message: "ไม่สามารถเชื่อมต่อกับระบบ WebPortal ได้",
      });
    }
  });
};

/**
 * สำหรับ export ไฟล์ (PDF / Excel)
 */
export const masterGenSpreadsheet = async (API, body = {}) => {
  return new Promise(async (resolve) => {
    try {
      const authorization = await config_headers();
      let url = window.location.origin + "/export/";

      // ใช้ port 30004 เฉพาะตอน localhost
      if (window.location.hostname.includes("localhost")) {
        url = "http://localhost:30004/export/";
      }

      const fullUrl = url + API;
      console.log("[masterGenSpreadsheet] URL:", fullUrl);

      const res = await axios.post(fullUrl, body, authorization);
      resolve(res);
    } catch (err) {
      console.error("[masterGenSpreadsheet] Error:", err?.response || err);
      resolve({
        error: true,
        message: err?.message || "ไม่สามารถส่งออกไฟล์ได้",
      });
    }
  });
};
