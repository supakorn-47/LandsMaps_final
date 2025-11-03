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

    if (Array.isArray(body.files) && body.files.length > 0) {
      body.files.forEach((f) => fd.append("files", f));
      fd.append("announce_file_types", "1");
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
    appendIf(
      fd,
      "announce_start_date_yyyymmdd",
      fmtYMD_HHMM00(body.announce_start_date)
    );
    appendIf(
      fd,
      "announce_finish_date_yyyymmdd",
      fmtYMD_HHMM00(body.announce_finish_date)
    );
    appendIf(fd, "announce_title_th", body.announce_title_th);
    appendIf(fd, "announce_title_en", body.announce_title_en);
    appendIf(fd, "announce_desc_th", body.announce_desc_th);
    appendIf(fd, "announce_desc_en", body.announce_desc_en);
    appendIf(fd, "announce_url", body.announce_url);
    appendIf(fd, "announce_type", body.announce_type);
    appendIf(fd, "record_status", body.record_status || "A");

    if (Array.isArray(body.files) && body.files.length > 0) {
      const types = [];
      body.files.forEach((f) => {
        fd.append("files", f);
        types.push(guessFileType(f));
      });
      types.forEach((t) => fd.append("announce_file_types", t));
    }

    fd.append(
      "user_dto",
      JSON.stringify({
        person_id: user.person_id,
        register_seq: user.register_seq,
        user_id: user.user_id,
        fullname: user.fullname,
        landoffice_id: user.landoffice_id,
        landoffice_name: user.landoffice_name,
        department_seq: user.department_seq,
        department_name: user.department_name,
        opt_seq: user.opt_seq,
        opt_name: user.opt_name,
        token: user.token,
        token_expires_dtm: user.token_expires_dtm,
        register_type_seq: user.register_type_seq,
        register_type_name: user.register_type_name,
      })
    );

    console.log("Update FormData entries:");
    for (let [k, v] of fd.entries()) console.log(k, v);

    return requests.fromDataPut(
      URL_API("backOfficeApi/LPADM03/Update"),
      fd,
      headers
    );
  },

  DeleteData: async (body) => {
    const authorization = await config_headers();
    if (body?.announce_seq) {
      return requests.delete(
        URL_API(
          `backOfficeApi/LPADM03/Delete?announce_seq=${body.announce_seq}`
        ),
        authorization
      );
    } else {
      return requests.post(
        URL_API("backOfficeApi/LPADM03/Delete"),
        { announce_seq: body.announce_seq },
        authorization
      );
    }
  },

  DeleteFile: async (body) => {
    const authorization = await config_headers();
    return requests.post(
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
      URL_API("backOfficeApi/LPADM03/GetAnnounceFileList"),
      { announce_seq: body.announce_seq },
      headers
    );
  },
};

export default LPADM03Services;
