import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

/**
 * 🔹 ดึงข้อมูลผู้ใช้งาน
 * Method: POST
 * Path: /backOfficeApi/LPADM01/Get
 */

export const LPADM01GetDataList = async (body) => {
  try {
    const authorization = await config_headers();

    const payload = {
      full_name:
        body.person_fullname && body.person_fullname.trim() !== ""
          ? body.person_fullname
          : "%", // ✅ ต้องไม่ว่าง
      register_type_seq: Number(body.register_type_seq) || 0,
      department_seq: Number(body.department_seq) || 0,
      province_seq: Number(body.province_seq) || 0,
      create_dtm_from: body.create_dtm_from
        ? body.create_dtm_from.toISOString().split("T")[0]
        : "",
      create_dtm_to: body.create_dtm_to
        ? body.create_dtm_to.toISOString().split("T")[0]
        : "",
      page_number: body.pageofnum > 0 ? body.pageofnum : 1,
      row_of_page: body.rowofpage > 0 ? body.rowofpage : 10,
    };

    const url = URL_API("backOfficeApi/LPADM01/Get");
    console.log("[LPADM01GetDataList] URL:", url);
    console.log("[LPADM01GetDataList] Payload:", payload);

    const res = await axios.post(
      url,
      payload,
      authorization
    );

    return res.data;
  } catch (err) {
    console.error("[LPADM01GetDataList] Error:", err);
    throw err;
  }
};

/**
 * 🔹 อนุมัติผู้ใช้งาน
 * Method: POST
 * Path: /backOfficeApi/LPADM01/ApproveUserData
 */
export const LPADM01ApproveUserData = async (body) => {
  try {
    const authorization = await config_headers();
    const url = URL_API("backOfficeApi/LPADM01/ApproveUserData");
    console.log("[LPADM01ApproveUserData] URL:", url);
    const res = await axios.post(
      url,
      body,
      authorization
    );
    return res.data;
  } catch (err) {
    console.error("[LPADM01ApproveUserData] Error:", err);
    throw err;
  }
};

/**
 * 🔹 อัปโหลดหรือแก้ไขไฟล์แนบ
 * Method: PUT
 * Path: /backOfficeApi/LPADM01/UploadFileData
 * ใช้ FormData (multipart/form-data)
 */
export const LPADM01UploadFileData = async (formData) => {
  try {
    const authorization = await config_headers_fromData();
    const url = URL_API("backOfficeApi/LPADM01/UploadFileData");
    console.log("[LPADM01UploadFileData] URL:", url);
    const res = await axios.put(
      url,
      formData,
      authorization
    );
    return res.data;
  } catch (err) {
    console.error("[LPADM01UploadFileData] Error:", err);
    throw err;
  }
};

/**
 * 🔹 ลบไฟล์แนบ
 * Method: DELETE
 * Path: /backOfficeApi/LPADM01/DeleteRegisterFile
 * ต้องส่งพารามิเตอร์ผ่าน query string เช่น ?register_seq=123
 */
export const LPADM01DeleteRegisterFile = async (register_seq) => {
  try {
    const authorization = await config_headers();
    const url = URL_API(
      `backOfficeApi/LPADM01/DeleteRegisterFile?register_seq=${register_seq}`
    );
    console.log("[LPADM01DeleteRegisterFile] URL:", url);
    const res = await axios.delete(
      url,
      authorization
    );
    return res.data;
  } catch (err) {
    console.error("[LPADM01DeleteRegisterFile] Error:", err);
    throw err;
  }
};

/**
 * 🔹 แสดงรายการไฟล์แนบทั้งหมด
 * Method: GET
 * Path: /backOfficeApi/LPADM01/GetRegisterFileList
 */
export const LPADM01GetRegisterFileList = async () => {
  try {
    const authorization = await config_headers();
    const url = URL_API("backOfficeApi/LPADM01/GetRegisterFileList");
    console.log("[LPADM01GetRegisterFileList] URL:", url);
    const res = await axios.get(
      url,
      authorization
    );
    return res.data;
  } catch (err) {
    console.error("[LPADM01GetRegisterFileList] Error:", err);
    throw err;
  }
};

/**
 * 🔹 ส่งอีเมลแจ้งผู้ใช้งาน (SendMail)
 * Method: GET
 * Path: /backOfficeApi/LPADM01/SendMail
 */
export const LPADM01SendMail = async (params = {}) => {
  try {
    const authorization = await config_headers();
    const query = new URLSearchParams(params).toString(); // สร้าง query string
    const url = URL_API(`backOfficeApi/LPADM01/SendMail${query ? `?${query}` : ""}`);
    console.log("[LPADM01SendMail] URL:", url);
    const res = await axios.get(
      url,
      authorization
    );
    return res.data;
  } catch (err) {
    console.error("[LPADM01SendMail] Error:", err);
    throw err;
  }
};

/**
 * ✅ รวม export ทั้งหมดไว้ใน object เดียว
 */
export default {
  LPADM01GetDataList,
  LPADM01ApproveUserData,
  LPADM01UploadFileData,
  LPADM01DeleteRegisterFile,
  LPADM01GetRegisterFileList,
  LPADM01SendMail,
};
