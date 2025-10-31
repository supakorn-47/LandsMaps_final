import requests from "../httpServicesLog";

const MSM01Services = {
  GetDataList(body, headers) {
    return requests.post("apiLog/LogExchange/GetList", body, headers);
    // return requests.get("backOfficeApi/LPASM03/Get", body, headers);
  },
  GetGraphList(body, headers) {
    return requests.post("apiLog/LogExchange/GraphList", body, headers);
  },
};

export default MSM01Services;
