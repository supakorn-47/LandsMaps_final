import axios from 'axios';
import { config_headers, URL_API, config_headers_fromData } from '../Config';

export const DBT02GetDataList = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.post(URL_API('backOfficeApi/DBT02/GetDataList'), {
                "source_seq": parseInt(body.source_seq),
                "transfer_data_group_seq": parseInt(body.transfer_data_group_seq)
            }, authorization)
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

export const DBT02CreateData = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.post(URL_API('backOfficeApi/DBT02/CreateData'), {

                "transfer_data_ord": body.transfer_data_ord,
                "source_seq": parseInt(body.source_seq),
                "transfer_data_group_seq": parseInt(body.transfer_data_group_seq),
                "transfer_data_group_process_seq": body.transfer_data_group_process_seq,
                "source_process_seq": parseInt(body.source_process_seq),
                "source_schema": body.source_schema,
                "source_table": body.source_table,
                "target_process_seq": parseInt(body.target_process_seq),
                "target_schema": body.target_schema,
                "target_table": body.target_table,
                "transfer_status": body.transfer_status,
                "record_status": body.record_status,

            }, authorization)
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

export const DBT02UpdateData = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API('backOfficeApi/DBT02/UpdateData'), {
                "transfer_data_seq": body.transfer_data_seq,
                "source_seq": parseInt(body.source_seq),
                "transfer_data_group_seq": parseInt(body.transfer_data_group_seq),
                "transfer_data_group_process_seq": body.transfer_data_group_process_seq,
                "source_process_seq": parseInt(body.source_process_seq),
                "source_schema": body.source_schema,
                "source_table": body.source_table,
                "target_process_seq": parseInt(body.target_process_seq),
                "target_schema": body.target_schema,
                "target_table": body.target_table,
                "transfer_status": body.transfer_status,
                "record_status": body.record_status,
            }, authorization)
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

export const DBT02CancelData = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.delete(URL_API('backOfficeApi/DBT02/CancelData'), { data: body, headers: authorization.headers })
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

export const DBT02TransferStatus = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.put(URL_API('backOfficeApi/DBT02/TransferStatus'), body, authorization)
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

export const DBT02GetJobFileDataList = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.post(URL_API('backOfficeApi/DBT02/GetJobFileDataList'), body, authorization)
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

