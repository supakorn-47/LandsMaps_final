import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
import { getDateTime } from "../../utils/DateUtil";
var dateFormat = require("dateformat");

export const getDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/ADM12/Get"),
          {
            ...body,
            province_seq: parseInt(body.province_seq),
            amphur_seq: parseInt(body.amphur_seq),
            landoffice_id: body.opt_seq,
          },
          authorization
        )
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const getFileList = async (wp_seq) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/ADM12/GetFile"),
          {
            wp_seq: wp_seq,
          },
          authorization
        )
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const createData = async (body) => {
  console.log("body", body);
  var formData = new FormData();
  formData.append(
    "opt_request_date",
    dateFormat(body.opt_request_date, "yyyy-mm-dd")
  );
  formData.append("opt_seq", body.opt_seq | 0);
  formData.append(
    "opt_request_desc",
    body.opt_request_desc === undefined ||
      body.opt_request_desc === "null" ||
      body.opt_request_desc === null
      ? ""
      : body.opt_request_desc
  );
  formData.append("wp_shp_zone", body.wp_shp_zone);

  if (body.file !== undefined && body.file.length > 0) {
    // body.file.forEach(element => {
    //     formData.append('files', element);
    // });

    for (let i = 0; i < body.file.length; i++) {
      formData.append("files", body.file[i]);
    }
  }
  console.log("formData", formData);

  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/ADM12/Add"), formData, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      console.log("createDataservice--->err", err);
      reject(err);
    } finally {
    }
  });
};

export const updateData = async (body) => {
  var formData = new FormData();
  formData.append("wp_seq", body.wp_seq);
  formData.append(
    "opt_request_date",
    dateFormat(body.opt_request_date, "yyyy-mm-dd HH:MM:ss")
  );
  formData.append("opt_seq", body.opt_seq | 0);
  formData.append(
    "opt_request_desc",
    body.opt_request_desc === undefined ||
      body.opt_request_desc === "null" ||
      body.opt_request_desc === null
      ? ""
      : body.opt_request_desc
  );
  formData.append("wp_shp_zone", body.wp_shp_zone);

  if (body.file !== undefined && body.file.length > 0) {
    body.file.forEach((element) => {
      formData.append("files", element);
    });
  }
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(URL_API("backOfficeApi/ADM12/Update"), formData, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const deleteData = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .delete(URL_API(`apiWebAdmin/ADM12/Delete?id=${id}`), {
          data: {},
          headers: authorization.headers,
        })
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const deleteFile = async (wp_seq) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .delete(URL_API(`apiWebAdmin/ADM12/DeleteFile?wp_seq=${wp_seq}`), {
          data: {},
          headers: authorization.headers,
        })
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const sendMailAPI = async (wp_seq) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API(`apiWebAdmin/ADM12/SendMail?wp_seq=${wp_seq}`),
          {},
          authorization
        )
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const downloadFile = async (wp_seq) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API(`apiWebAdmin/ADM12/DownloadFile?wp_seq=${wp_seq}`),
          {},
          authorization
        )
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
