import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";
import { formatDateAPI } from "../../utils/DateUtil";

export const SCS04GetDataList = async (body) => {
  let data = {
    system_seq: body.system_seq === "0" ? "" : body.system_seq,
    function_seq: body.function_seq === "0" ? "" : body.function_seq,
    request_dtm_from:
      body.request_dtm_from !== ""
        ? formatDateAPI(body.request_dtm_from, true)
        : "",
    request_dtm_to:
      body.request_dtm_to !== ""
        ? formatDateAPI(body.request_dtm_to, true)
        : "",
  };
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/SCS/LogFunctionSearch"),
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
