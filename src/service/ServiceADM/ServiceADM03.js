import axios from 'axios';
import { config_headers, URL_API, config_headers_fromData } from '../Config';

export const ADM03GetDataList = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.get(URL_API('backOfficeApi/LPASM03/Get'), authorization)
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

export const ADM03CreateData = async (body) => {
    var formData = new FormData();
    formData.append('service_name', body.service_name);
    formData.append('service_id', body.service_id);
    formData.append('service_protocol', body.service_protocol);
    formData.append('service_host', body.service_host);
    formData.append('service_port', body.service_port === null ? '' : body.service_port);
    formData.append('service_path', body.service_path);
    formData.append('service_method', body.service_method);
    formData.append('service_param', body.service_param === null ? '' : body.service_param);
    formData.append('service_type', body.service_type);
    formData.append('service_url', body.service_url);
    formData.append('service_data_type', body.service_data_type);
    // formData.append('service_remark', body.service_remark);
    formData.append('service_ord', 0);
    formData.append('record_status', body.record_status);
    formData.append('public_flag', body.public_flag);
    formData.append('use_flag', 1);
    formData.append('department_seq', body.province_seq !== null ? parseInt(body.department_seq) : 0);
    formData.append('service_desc', body.service_desc === null ? '' : body.service_desc);
    if (body.file !== undefined) {
        formData.append('service_file', body.file);
    }
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers_fromData();
            await axios.post(URL_API('backOfficeApi/LPASM03/Add'), formData, authorization)
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

export const ADM03UpdateData = async (body) => {
    var formData = new FormData();
    formData.append('service_seq', body.service_seq);
    formData.append('service_id', body.service_id);
    formData.append('service_name', body.service_name);
    formData.append('service_protocol', body.service_protocol);
    formData.append('service_host', body.service_host);
    formData.append('service_port', body.service_port === null ? '' : body.service_port);
    formData.append('service_path', body.service_path);
    formData.append('service_method', body.service_method);
    formData.append('service_param', body.service_param === null ? '' : body.service_param);
    formData.append('service_type', body.service_type);
    formData.append('service_url', body.service_url);
    formData.append('service_data_type', body.service_data_type);
    formData.append('service_ord', body.service_ord);
    // formData.append('service_remark', body.service_remark);
    formData.append('record_status', body.record_status);
    formData.append('public_flag', body.public_flag);
    formData.append('use_flag', body.use_flag);
    formData.append('department_seq', body.province_seq !== null ? parseInt(body.department_seq) : 0);
    formData.append('service_desc', body.service_desc === null ? '' : body.service_desc);
    if (body.file !== undefined) {
        formData.append('service_file', body.file);
    }
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers_fromData();
            await axios.put(URL_API('backOfficeApi/LPASM03/Update'), formData, authorization)
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

export const ADM03CancelData = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.delete(URL_API('backOfficeApi/LPASM03/Delete?id=' + body.service_seq), { data: {}, headers: authorization.headers })
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

export const ADM03UpdateServiceUse = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API('backOfficeApi/LPASM03/UpdateServiceUse'), body, authorization)
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

// GET REQ AND RES
export const ADM03GetServiceReqAndRes = async (typeService, service_seq) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.get(URL_API(`backOfficeApi/LPASM03/GetService${typeService}?service_seq=${service_seq}`), authorization)
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
// ADD REQ AND RES
export const ADM03AddServiceReqAndRes = async (typeService, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.post(URL_API(`backOfficeApi/LPASM03/AddService${typeService}`), body, authorization)
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
// UPDATE REQ AND RES
export const ADM03UpdateServiceReqAndRes = async (typeService, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API(`backOfficeApi/LPASM03/UpdateService${typeService}`), body, authorization)
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

// DELETE REQ AND RES
export const ADM03DeleteServiceReqAndRes = async (typeService, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.delete(URL_API(`backOfficeApi/LPASM03/DeleteService${typeService}?id=${id}`), { data: {}, headers: authorization.headers })
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

// UPDATE REQ AND RES
export const updateOrder = async (typeService, order_seq_list) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API(`backOfficeApi/LPASM03/${typeService}`), { order_seq_list: order_seq_list }, authorization)
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

// UPDATE REQ AND RES
export const updateOrderList = async (order_seq_list) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API(`backOfficeApi/LPASM03/UpdateOrder`), { order_seq_list: order_seq_list }, authorization)
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

// UPDATE REQ AND RES
export const updateServicePublic = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API(`backOfficeApi/LPASM03/UpdateServicePublic`), body, authorization)
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