import axios from 'axios';
import { config_headers, URL_API, config_headers_fromData, config_headers_delete } from '../Config';
import { formatDateAPI2 } from '../../utils/DateUtil';
var dateFormat = require('dateformat');

export const ADM16GetDataList = async (body) => {
    let data = {
        "province_id": body.province_id === "0" ? "" : body.province_id,
        "amcode": body.amcode === "0" ? "" : body.amcode,
        "tamcode": body.tamcode === "0" ? "" : body.tamcode,
        "opt_name": body.opt_name,
        "consent_flag": body.consent_flag === "-1" ? "" : body.consent_flag,
    };
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.post(URL_API('backendService/ADM16/GetDataList'), data, authorization)
            // await axios.post(('http://localhost:8888/backendService/ADM16/GetDataList'), data, authorization)
                .then(res => {
                    resolve(res.data);

                });
        }
        catch (err) {
            reject(err);
        }
        finally {

        }
    });
}

export const ADM16CreateData = async (body) => {
    let amphur_id = (body.amphur_id !== "0" ? body.province_id + body.amphur_id : null)
    let tambol_id = (body.tambol_id !== "0" ? body.province_id + body.amphur_id + body.tambol_id : null)

    var formData = new FormData();
    formData.append('consent_id', body.consent_id);
    formData.append('opt_seq', body.opt_seq);
    formData.append('opt_id', body.opt_id);
    formData.append('opt_id_oracle', body.opt_id_oracle);
    formData.append('org_code', body.org_code);
    formData.append('opt_type', body.opt_type);
    formData.append('opt_name', body.opt_name);
    formData.append('tambol_id', tambol_id);
    formData.append('amphur_id', amphur_id);
    formData.append('province_id', body.province_id);
    formData.append('landoffice_id', body.landoffice_id);
    formData.append('doc_org_source', body.doc_org_source === null ? "" : body.doc_org_source);
    formData.append('doc_no', body.doc_no === null ? "" : body.doc_no);
    formData.append('doc_date', formatDateAPI2(body.doc_date, false));
    formData.append('doc_receive_date', formatDateAPI2(body.doc_receive_date, false));
    formData.append('doc_file_path', body.doc_file_path);
    formData.append('opt_service_id', body.opt_service_id);
    formData.append('consent_flag', body.consent_flag);
    formData.append('consent_date', formatDateAPI2(body.consent_date, false));
    formData.append('consent_start_date', formatDateAPI2(body.consent_start_date, false));
    formData.append('consent_end_date', formatDateAPI2(body.consent_end_date, false));
    formData.append('remark', body.remark === null ? "" : body.remark);
    formData.append('last_upd_user', null);
    formData.append('last_upd_dtm', "");
    formData.append('record_status', body.record_status);
    formData.append('opt_id_dla', body.opt_id_dla);
    formData.append('email_address', body.email_address);
    formData.append('mas_opt_name', body.mas_opt_name);
    formData.append('dla_opt_name', body.dla_opt_name);
    formData.append('opt_use_seq', body.opt_use_seq);
    formData.append('service_url', body.service_url);
    if (body.file !== undefined && body.file !== "") {
        formData.append('file_attachs', body.file);
    }

    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers_fromData();
            await axios.post(URL_API('backendService/ADM16/CreateData'), formData, authorization)
                .then(res => {
                    resolve(res.data);
                });
        }
        catch (err) {
            reject(err);
        }
        finally {

        }
    });
}

export const ADM16UpdateData = async (body) => {
    let amphur_id = (body.amphur_id !== "0" ? body.province_id + body.amphur_id : null)
    let tambol_id = (body.tambol_id !== "0" ? body.province_id + body.amphur_id + body.tambol_id : null)

    var formData = new FormData();
    formData.append('consent_id', body.consent_id);
    formData.append('opt_seq', body.opt_seq);
    formData.append('opt_id', body.opt_id);
    formData.append('opt_id_oracle', body.opt_id_oracle);
    formData.append('org_code', body.org_code);
    formData.append('opt_type', body.opt_type);
    formData.append('opt_name', body.opt_name);
    formData.append('tambol_id', tambol_id);
    formData.append('amphur_id', amphur_id);
    formData.append('province_id', body.province_id);
    formData.append('landoffice_id', body.landoffice_id);
    formData.append('doc_org_source', body.doc_org_source === null ? "" : body.doc_org_source);
    formData.append('doc_no', body.doc_no === null ? "" : body.doc_no);
    formData.append('doc_date', formatDateAPI2(body.doc_date, false));
    formData.append('doc_receive_date', formatDateAPI2(body.doc_receive_date, false));
    formData.append('doc_file_path', body.doc_file_path);
    formData.append('opt_service_id', body.opt_service_id);
    formData.append('consent_flag', body.consent_flag);
    formData.append('consent_date', formatDateAPI2(body.consent_date, false));
    formData.append('consent_start_date', formatDateAPI2(body.consent_start_date, false));
    formData.append('consent_end_date', formatDateAPI2(body.consent_end_date, false));
    formData.append('remark', body.remark === null ? "" : body.remark);
    formData.append('last_upd_user', null);
    formData.append('last_upd_dtm', "");
    formData.append('record_status', body.record_status);
    formData.append('opt_id_dla', body.opt_id_dla);
    formData.append('email_address', body.email_address);
    formData.append('mas_opt_name', body.mas_opt_name);
    formData.append('dla_opt_name', body.dla_opt_name);
    formData.append('opt_use_seq', body.opt_use_seq);
    formData.append('opt_id_old', body.opt_id_old);
    formData.append('service_url', body.service_url);

    if (body.file !== undefined && body.file !== "") {
        formData.append('file_attachs', body.file);
    }

    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers_fromData();
            await axios.put(URL_API('backendService/ADM16/UpdateData'), formData, authorization)
                .then(res => {
                    resolve(res.data);
                });
        }
        catch (err) {
            reject(err);
        }
        finally {

        }
    });
}

export const ADM16DeleteData = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers_delete(body);
            await axios.delete(URL_API('backendService/ADM16/DeleteData'), authorization)
                .then(res => {
                    resolve(res.data);
                });
        }
        catch (err) {
            reject(err);
        }
        finally {

        }
    });
}

