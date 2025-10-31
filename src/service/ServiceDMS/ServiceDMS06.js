import axios from "axios";
import { config_headers, URL_API, config_headers_fromData } from "../Config";

export const DMS06GetDataList = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let authorization = await config_headers();
            await axios.post(URL_API('backOfficeApi/DMS06/Get'), body, authorization)
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
