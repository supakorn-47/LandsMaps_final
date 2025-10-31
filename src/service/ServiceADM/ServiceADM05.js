import axios from "axios";
import { config_headers, URL_API } from "../Config";

export const ADM05GetDataList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(URL_API("backOfficeApi/ADM05/Get"), authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};

export const ADM05CreateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/ADM05/Add"),
          {
            error_type_ord: body.error_type_ord,
            error_type_name: body.error_type_name,
            error_type_desc: body.error_type_desc,
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

export const ADM05UpdateData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/ADM05/Update"),
          {
            error_type_seq: body.error_type_seq,
            error_type_ord: body.error_type_ord,
            error_type_name: body.error_type_name,
            error_type_desc: body.error_type_desc,
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

export const ADM05CancelData = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .delete(URL_API("backOfficeApi/ADM05/Delete"), {
          data: {
            error_type_seq: body.data.error_type_seq,
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
    arr.push(element.error_type_seq);
  });

  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .put(
          URL_API("backOfficeApi/ADM05/UpdateOrder"),
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
