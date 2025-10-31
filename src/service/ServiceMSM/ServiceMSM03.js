import requests from "../httpServicesLog";
import { URL_API } from "../Config";

//log-service-mongodb
const MSM03Services = {
  GetDataList(body, headers) {
    return requests.post("backOfficeApi/LPSMS02/GetList", body, headers);
  },
};

export default MSM03Services;
