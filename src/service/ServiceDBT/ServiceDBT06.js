import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

export const DBT06GetDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(URL_API("backOfficeApi/DBT06/GetDataList"), body, authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
