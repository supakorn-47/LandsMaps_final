import axios from "axios";
import { config_headers, config_headers_fromData, URL_API } from "../Config";

const buildUrl = (path) => {
  const ensured = "/" + String(path || "").replace(/^\/+/, "");
  return URL_API(ensured);
};

export const LPADM01GetDataList = async (body) => {
  const authorization = await config_headers();
  const payload = {
    approve_flag: body.approve_flag ?? 0,
    person_fullname: body.person_fullname?.trim() || "%",
    full_name: body.full_name?.trim() || "%",
    register_type_seq: Number(body.register_type_seq) || 0,
    create_dtm_from: body.create_dtm_from
      ? body.create_dtm_from.toISOString().split("T")[0]
      : "",
    create_dtm_to: body.create_dtm_to
      ? body.create_dtm_to.toISOString().split("T")[0]
      : "",
  };
  const url = URL_API("backOfficeApi/LPADM01/Get");
  const res = await axios.post(url, payload, authorization);
  return res.data;
};

export const LPADM01ApproveUserData = async (body) => {
  const authorization = await config_headers();
  const url = URL_API("backOfficeApi/LPADM01/ApproveUserData");
  const res = await axios.post(url, body, authorization);
  return res.data;
};

export const LPADM01UploadFileData = async (body) => {
  const authorization = await config_headers_fromData();
  const url = URL_API("backOfficeApi/LPADM01/UploadFileData");
  const formData = new FormData();
  formData.append("register_seq", body.register_seq || 0);
  formData.append("register_remark", body.register_remark || "");
  if (body.file_attachs?.length) {
    body.file_attachs.forEach((f) => {
      formData.append("file_attachs", f);
    });
  }
  const login = JSON.parse(localStorage.getItem("login"));
  const user_dto = login?.result?.user_dto;
  for (const key in user_dto) {
    formData.append(`user_dto.${key}`, user_dto[key] ?? "");
  }
  const res = await axios.put(url, formData, authorization);
  return res.data;
};

export const LPADM01DeleteRegisterFile = async (register_file_seq) => {
  const authorization = await config_headers();
  const url = URL_API(
    `backOfficeApi/LPADM01/DeleteRegisterFile?register_file_seq=${register_file_seq}`
  );
  const res = await axios.delete(url, authorization);
  return res.data;
};

export const LPADM01GetRegisterFileList = async (register_seq) => {
  const authorization = await config_headers();
  const url = URL_API(
    `backOfficeApi/LPADM01/GetRegisterFileList?register_seq=${register_seq}`
  );
  const res = await axios.get(url, authorization);
  return res.data;
};

export const LPADM01SendMail = async (email) => {
  const authorization = await config_headers();
  const url = URL_API(`backOfficeApi/LPADM01/SendMail?email=${email}`);
  const res = await axios.get(url, authorization);
  return res.data;
};

export default {
  LPADM01GetDataList,
  LPADM01ApproveUserData,
  LPADM01UploadFileData,
  LPADM01DeleteRegisterFile,
  LPADM01GetRegisterFileList,
  LPADM01SendMail,
};
