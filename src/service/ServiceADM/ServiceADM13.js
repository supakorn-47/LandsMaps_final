import axios from "axios";
import { config_headers, URL_API } from "../Config";
import { formatDateAPI } from "../../utils/DateUtil";

export const ADM13GetDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API("backOfficeApi/ADM13/Get"),
          {
            // ...body,
            // "province_seq": parseInt(body.province_seq),
            // "amphur_seq": parseInt(body.amphur_seq),
            // "opt_seq" : parseInt(body.opt_seq)

            wp_month_from: body.log_mm_from,
            wp_month_to: body.log_mm_to,
            wp_year: body.log_year,
            province_seq: parseInt(body.province_seq),
            amphur_seq: parseInt(body.amphur_seq),
            landoffice_id: body.landoffice_id,
            opt_seq: parseInt(body.opt_seq),
            wp_mcode: body.wp_mcode,
            totalRecords: body.totalRecords,
            pageofnum: body.pageofnum,
            rowofpage: body.rowofpage,

            // {
            //     "log_mm_from":"12",
            //     "log_mm_to":"12",
            //     "log_year":"2565",
            //     "province_seq":2,
            //     "amphur_seq":54,
            //     "opt_seq":4024,
            //     "amphur":"-1"
            // }
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

export const GetLogList = async (wp_seq, type) => {
  if (type === "DOWNLOAD") {
    return new Promise(async (resolve, reject) => {
      try {
        let authorization = await config_headers();
        await axios
          .post(
            URL_API(
              `apiWebAdmin/ADM13/GetLogDownloadFileList?wp_seq=${wp_seq}`
            ),
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
  } else if (type === "MAIL") {
    return new Promise(async (resolve, reject) => {
      try {
        let authorization = await config_headers();
        await axios
          .post(
            URL_API(`apiWebAdmin/ADM13/GetLogSendMailList?wp_seq=${wp_seq}`),
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
  }
};

export const GetLogSendMailList = async (wp_seq) => {};

export const downloadFile = async (wp_seq) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();
      await axios
        .post(
          URL_API(`apiWebAdmin/ADM13/DownloadFile?wp_seq=${wp_seq}`),
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
