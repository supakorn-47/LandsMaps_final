import requests from '../httpServices';
var dateFormat = require('dateformat');

const ADM11Services = {
    GetDataList(body, headers) {
        let data = {
            "request_dtm_from": body.request_dtm_from === "" || body.request_dtm_from === undefined ? "" : dateFormat(body.request_dtm_from, "yyyymmdd"),
            "response_dtm_to": body.response_dtm_to === "" || body.response_dtm_to === undefined ? "" : dateFormat(body.response_dtm_to, "yyyymmdd"),
            "totalRecords": body.totalRecords,
            "pageofnum": body.pageofnum,
            "rowofpage": body.rowofpage
        }
        return requests.post('backOfficeApi/LPADM05/Get', data, headers);
    },
    GetDataListSummary(body, headers) {
        let data = {
            "request_dtm_from": body.request_dtm_from === "" || body.request_dtm_from === undefined ? "" : dateFormat(body.request_dtm_from, "yyyymmdd"),
            "response_dtm_to": body.response_dtm_to === "" || body.response_dtm_to === undefined ? "" : dateFormat(body.response_dtm_to, "yyyymmdd"),
        }
        return requests.post('backOfficeApi/LPADM05/Get_SumRegisterType', data, headers);
    },
};

export default ADM11Services;
