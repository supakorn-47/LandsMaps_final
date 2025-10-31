import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

export const ADM04GetDataList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(URL_API("backOfficeApi/LPASM04/Get"), authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const ADM04CreateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/LPASM04/Add"),
          {
            status_code: body.status_code,
            status_name_th: body.status_name_th.replace(/[\t\n\r]/g, ""),
            status_name_en: body.status_name_en.replace(/[\t\n\r]/g, ""),
            remark: body.remark,
            record_status: body.record_status,
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

export const ADM04UpdateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/LPASM04/Update"),
          {
            status_code_seq: body.status_code_seq,
            status_code: body.status_code,
            status_name_th: body.status_name_th.replace(/[\t\n\"]/g, ""),
            status_name_en: body.status_name_en.replace(/[\t\n\"]/g, ""),
            remark: body.remark,
            record_status: body.record_status,
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

export const ADM04CancelData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .delete(URL_API("backOfficeApi/LPASM04/Delete"), {
          data: {
            status_code_seq: body.data.status_code_seq,
            record_status: body.record_status,
          },
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

export const UpdateOrder = async (body) => {
  let arr = [];
  body.forEach((element) => {
    arr.push(element.status_code_seq);
  });

  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/LPASM04/UpdateOrder"),
          {
            order_seq_list: arr,
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
