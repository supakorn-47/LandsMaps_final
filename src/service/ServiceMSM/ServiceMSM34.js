import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

export const MSM34GetDataList = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let authorization = await config_headers();

      let data = {
        status: 200,
        result: [
          {
            order_no: 1,
            col2: "2021-01-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_01",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 2,
            col2: "2021-02-28T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_02",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 3,
            col2: "2021-03-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_03",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 4,
            col2: "2021-04-30T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_04",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 5,
            col2: "2021-05-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_05",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 6,
            col2: "2021-06-30T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_06",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 7,
            col2: "2021-07-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_07",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 8,
            col2: "2021-08-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_08",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 9,
            col2: "2021-09-30T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_09",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 10,
            col2: "2021-10-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_10",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 11,
            col2: "2021-11-30T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_11",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 12,
            col2: "2021-12-31T20:00:00",
            col3: "รายเดือน",
            col4: "DOL_PIPR_TR_2564_12",
            col5: "50 GB",
            col6: "สำเร็จ",
          },
          {
            order_no: 13,
            col2: "2021-12-31T23:00:00",
            col3: "รายปี",
            col4: "DOL_PIPR_TR_2564",
            col5: "600 GB",
            col6: "สำเร็จ",
          },
        ],
      };
      resolve(data);
      // await axios.post(URL_API('backOfficeApi/DBT06/GetDataList'), body, authorization)
      //     .then(res => {
      //         let data ={status:200,result:[
      //             {
      //                 "order_no": 108,
      //                 "transfer_job_seq": 11289,
      //                 "log_start_dtm": "2022-06-22T10:00:38",
      //                 "log_end_dtm": "2022-06-22T10:00:38",
      //                 "source_name": "โครงการพัฒนาระบบสารสนเทศที่ดินระยะที่ 2",
      //                 "transfer_data_group_name": "MAP_LAND_GIS_48",
      //                 "target_name": "Postgres6",
      //                 "schedule_mode": "AUTO CDC",
      //                 "transfer_process_status": "สำเร็จ",
      //                 "source_record": 187,
      //                 "total_record": 171,
      //                 "log_desc": "N/A",
      //                 "log_transfer_seq": 184925,
      //                 "transfer_data_group_seq": 3,
      //                 "transfer_data_seq": 311
      //             }
      //         ]};
      //         resolve(data);
      //     });
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
