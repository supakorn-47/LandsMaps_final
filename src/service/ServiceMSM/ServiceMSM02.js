import requests from '../httpServices';

const MSM02Services = {
    GetDataList(body, headers) {
        return requests.post('backOfficeApi/LPSMS01/GetList', body, headers);
    },
};

export default MSM02Services;
