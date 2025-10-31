import axios from "axios";
import { config_headers, URL_API } from "../Config";
import { formatDateAPI } from "../../utils/DateUtil";

export const getDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/ADM14/Get"),
          {
            error_type_seq: body.error_type_seq,
            landoffice_id: body.landoffice_id,
            question_dt_start: formatDateAPI(body.question_dt_start),
            question_dt_end: formatDateAPI(body.question_dt_end),
            error_question_status: body.error_question_status,
            province_seq: parseInt(body.province_seq),
            start: 0,
            length: 1000000,
            recordsTotal: 0,
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

export const getById = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios
        .get(
          URL_API(`apiWebPortal/Master/DEM21GetById?error_question_seq=${body}`)
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
