import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
import { formatDateAPI } from "../../utils/DateUtil";

export const LMS05GetDataList = async (body) => {
  let data = {
    request_dtm_from:
      body.request_dtm_from !== ""
        ? formatDateAPI(body.request_dtm_from, false)
        : "",
    request_dtm_to:
      body.request_dtm_to !== ""
        ? formatDateAPI(body.request_dtm_to, false)
        : "",
  };
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/LMS/LogServiceSearch"),
          data,
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
