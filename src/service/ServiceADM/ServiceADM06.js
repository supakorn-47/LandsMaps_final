import axios from 'axios';
import { config_headers, URL_API, config_headers_fromData } from '../Config';
import { formatDateAPI } from '../../utils/DateUtil';
import requests from '../httpServices';
var dateFormat = require('dateformat');


const ADM06Services = {
    GetDataList(body, headers) {
        return requests.post('backOfficeApi/LPADM03/Get', {
            announce_date_from: body.announce_date_from !== "" ? formatDateAPI(body.announce_date_from, false) : "",
            announce_date_to: body.announce_date_to !== "" ? formatDateAPI(body.announce_date_to, false) : ""
        }, headers);
    },
    GetAnnounceFileList(body, headers) {
        return requests.post(`backOfficeApi/LPADM03/GetAnnounceFileList?announce_seq=${body.announce_seq}`, {}, headers);
    },
    CreateData(body, headers) {
        let date1;
        let date2;
        let date3;
        if (dateFormat(body.announce_date, 'yyyymmdd HHMM00').substring(0, 4) > 2500) {
            date1 = parseInt(dateFormat(body.announce_date, 'yyyymmdd HHMM00').substring(0, 4)) - 543 + "" + dateFormat(body.announce_date, 'mmdd');
        } else {
            date1 = dateFormat(body.announce_date, 'yyyymmdd HHMM00');
        }

        if (dateFormat(body.announce_start_date, 'yyyymmdd HHMM00').substring(0, 4) > 2500) {
            date2 = parseInt(dateFormat(body.announce_start_date, 'yyyymmdd HHMM00').substring(0, 4)) - 543 + "" + dateFormat(body.announce_start_date, 'mmdd');
        } else {
            date2 = dateFormat(body.announce_start_date, 'yyyymmdd HHMM00');
        }

        if (dateFormat(body.announce_finish_date, 'yyyymmdd HHMM00').substring(0, 4) > 2500) {
            date3 = parseInt(dateFormat(body.announce_finish_date, 'yyyymmdd HHMM00').substring(0, 4)) - 543 + "" + dateFormat(body.announce_finish_date, 'mmdd');
        } else {
            date3 = dateFormat(body.announce_finish_date, 'yyyymmdd HHMM00');
        }

        var formData = new FormData();
        formData.append('announce_start_date_yyyymmdd', date2);
        formData.append('announce_finish_date_yyyymmdd', date3);
        formData.append('announce_title_th', body.announce_title_th === undefined ? '' : body.announce_title_th);
        formData.append('announce_title_en', body.announce_title_en === undefined ? '' : body.announce_title_en);
        formData.append('announce_desc_th', body.announce_desc_th === undefined ? '' : body.announce_desc_th);
        formData.append('announce_desc_en', body.announce_desc_en === undefined ? '' : body.announce_desc_en);
        formData.append('announce_url', body.announce_url === undefined || body.announce_url === null ? '' : body.announce_url);
        formData.append('announce_type', body.announce_type);

        if (body.files !== undefined) {
            body.files.forEach(element => {
                formData.append('files', element);
            });
            body.announce_file_types.forEach(element => {
                formData.append('announce_file_types', element);
            });
        }

        return requests.fromDataPost('backOfficeApi/LPADM03/Add', formData, headers);
    },
    UpdateData(body, headers) {
        let date1;
        let date2;
        let date3;
        if (dateFormat(body.announce_date, 'yyyymmdd HHMM00').substring(0, 4) > 2500) {
            date1 = parseInt(dateFormat(body.announce_date, 'yyyymmdd HHMM00').substring(0, 4)) - 543 + "" + dateFormat(body.announce_date, 'mmdd');
        } else {
            date1 = dateFormat(body.announce_date, 'yyyymmdd HHMM00');
        }

        if (dateFormat(body.announce_start_date, 'yyyymmdd HHMM00').substring(0, 4) > 2500) {
            date2 = parseInt(dateFormat(body.announce_start_date, 'yyyymmdd HHMM00').substring(0, 4)) - 543 + "" + dateFormat(body.announce_start_date, 'mmdd');
        } else {
            date2 = dateFormat(body.announce_start_date, 'yyyymmdd HHMM00');
        }

        if (dateFormat(body.announce_finish_date, 'yyyymmdd HHMM00').substring(0, 4) > 2500) {
            date3 = parseInt(dateFormat(body.announce_finish_date, 'yyyymmdd HHMM00').substring(0, 4)) - 543 + "" + dateFormat(body.announce_finish_date, 'mmdd');
        } else {
            date3 = dateFormat(body.announce_finish_date, 'yyyymmdd HHMM00');
        }

        var formData = new FormData();
        formData.append('announce_seq', body.announce_seq);
        formData.append('announce_start_date_yyyymmdd', date2);
        formData.append('announce_finish_date_yyyymmdd', date3);
        formData.append('announce_title_th', body.announce_title_th);
        formData.append('announce_title_en', body.announce_title_en);
        formData.append('announce_desc_th', body.announce_desc_th);
        formData.append('announce_desc_en', body.announce_desc_en);
        formData.append('announce_url', body.announce_url === undefined || body.announce_url === null ? '' : body.announce_url);
        formData.append('announce_type', body.announce_type);

        if (body.files !== undefined) {
            body.files.forEach(element => {
                formData.append('files', element);
            });
            body.announce_file_types.forEach(element => {
                formData.append('announce_file_types', element);
            });
        }

        return requests.fromDataPut('backOfficeApi/LPADM03/Update', formData, headers);
    },
    DeleteData(body) {
        let authorization = config_headers();
        return requests.delete('backOfficeApi/LPADM03/Delete?id=' + body.announce_seq, {}, { data: body, headers: authorization.headers });
    },
    DeleteFile(body) {
        let authorization = config_headers();
        return requests.delete('backOfficeApi/LPADM03/DeleteFile?announce_file_seq=' + body.announce_file_seq, {}, { data: body, headers: authorization.headers });
    },
};
export default ADM06Services;