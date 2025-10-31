import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

export const SCS16GetDataList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .get(URL_API("backOfficeApi/SCS/LogServiceResponseTime"), authorization)
        .then((res) => {
          resolve(res.data);
        });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
