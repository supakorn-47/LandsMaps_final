import { formatDateAPI } from "../../utils/DateUtil";
import requests from "../httpServices";
import { config_headers, config_headers_fromData, URL_API } from "../Config";
import { getSession } from "../../utils/Crypto";

const fmtYMD_HHMM00 = (val) => {
  if (!val) return "";
  const d = new Date(val);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}${m}${day} ${hh}${mm}00`;
};

const appendIf = (fd, key, val) => {
  if (val !== undefined && val !== null && val !== "") fd.append(key, val);
};

const guessFileType = (f) => {
  if (!f?.type) return "FILE";
  if (f.type.includes("pdf")) return "PDF";
  if (f.type.includes("png")) return "PNG";
  if (f.type.includes("jpeg") || f.type.includes("jpg")) return "JPG";
  return "FILE";
};

const LPADM03Services = {
  GetDataList: async (body) => {
    const headers = await config_headers();
    return requests.post(
      URL_API("backOfficeApi/LPADM03/Get"),
      {
        announce_date_from: body.announce_date_from
          ? formatDateAPI(body.announce_date_from, false)
          : "",
        announce_date_to: body.announce_date_to
          ? formatDateAPI(body.announce_date_to, false)
          : "",
        announce_type: body.announce_type ?? "",
      },
      headers
    );
  },

  AddData: async (body) => {
    const headers = await config_headers_fromData();
    const fd = new FormData();

    appendIf(
      fd,
      "announce_start_date_yyyymmdd",
      body.announce_start_date_yyyymmdd
    );
    appendIf(
      fd,
      "announce_finish_date_yyyymmdd",
      body.announce_finish_date_yyyymmdd
    );
    appendIf(fd, "announce_title_th", body.announce_title_th);
    appendIf(fd, "announce_title_en", body.announce_title_en);
    appendIf(fd, "announce_desc_th", body.announce_desc_th);
    appendIf(fd, "announce_desc_en", body.announce_desc_en);
    appendIf(fd, "announce_url", body.announce_url);
    appendIf(fd, "announce_type", String(body.announce_type || "1"));
    appendIf(fd, "record_status", body.record_status || "A");

    if (Array.isArray(body.announce_file_types)) {
      body.announce_file_types.forEach((t) => {
        fd.append("announce_file_types", t);
      });
    } else {
      fd.append("files", new Blob([], { type: "application/octet-stream" }));
      fd.append("announce_file_types", "FILE");
    }

    console.log("Add FormData entries:");
    for (let [k, v] of fd.entries()) console.log(k, v);

    return requests.post(URL_API("backOfficeApi/LPADM03/Add"), fd, headers);
  },

 UpdateData: async (body) => {
  const headers = await config_headers_fromData();
  const login = await getSession("login");
  const user = login?.result?.user_dto || {};
  const fd = new FormData();

  appendIf(fd, "announce_seq", body.announce_seq);
  appendIf(fd, "announce_start_date_yyyymmdd", fmtYMD_HHMM00(body.announce_start_date));
  appendIf(fd, "announce_finish_date_yyyymmdd", fmtYMD_HHMM00(body.announce_finish_date));
  appendIf(fd, "announce_title_th", body.announce_title_th);
  appendIf(fd, "announce_title_en", body.announce_title_en);
  appendIf(fd, "announce_desc_th", body.announce_desc_th);
  appendIf(fd, "announce_desc_en", body.announce_desc_en);
  appendIf(fd, "announce_url", body.announce_url);
  appendIf(fd, "announce_type", body.announce_type);
  appendIf(fd, "record_status", body.record_status || "A");

  // ✅ ส่วนนี้สำคัญมาก — ต้องเช็ก Array ของไฟล์จริง
  if (Array.isArray(body.files) && body.files.length > 0) {
    const types = [];
    body.files.forEach((f) => {
      fd.append("files", f);
      types.push(guessFileType(f));
    });
    types.forEach((t) => fd.append("announce_file_types", t));
  } else {
    fd.append("files", new Blob([], { type: "application/octet-stream" }));
    fd.append("announce_file_types", "FILE");
  }

  fd.append("user_dto", JSON.stringify(user));

  return requests.fromDataPut(URL_API("backOfficeApi/LPADM03/Update"), fd, headers);
},

  DeleteData: async (body) => {
    const authorization = await config_headers();
    const announceSeq = body?.announce_seq ?? 0;
    const url = URL_API(`backOfficeApi/LPADM03/Delete?id=${announceSeq}`);
    return requests.delete(url, {}, authorization);
  },

  DeleteFile: async (body) => {
    const authorization = await config_headers();
    return requests.delete(
      URL_API("backOfficeApi/LPADM03/DeleteFile"),
      { announce_file_seq: body.announce_file_seq },
      authorization
    );
  },

  GetAnnounceType: async (mode = 0) => {
    const headers = await config_headers();
    return requests.get(
      URL_API(`backOfficeApi/Master/GetAnnounceType?mode=${mode}`),
      headers
    );
  },

 GetAnnounceFileList: async (body) => {
  const headers = await config_headers();
  return requests.post(
    URL_API(`backOfficeApi/LPADM03/GetAnnounceFileList?announce_seq=${body.announce_seq}`),
    {},
    headers
  );
},

};

export default LPADM03Services;
