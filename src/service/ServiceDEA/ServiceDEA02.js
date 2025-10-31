import requests from '../httpServicesLog';

const DEA02Services = {
    GetDataList(body, headers) {
        return requests.post('apiLog/LogExchange/GetList', body, headers);
    },
};

export default DEA02Services;