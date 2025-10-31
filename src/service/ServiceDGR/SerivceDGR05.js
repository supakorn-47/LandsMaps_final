import requests from "../httpServices";
// import axios from "axios";

const URL = "myLandsApi/PublicSurvey";
const DGR05Services = {
  GetDataList(body, header) {
    return requests.get(`${URL}/GetList`, { param: body, header });
  },
  GetDataReport(body, header) {
    return requests.post(`${URL}/GetSummaryReport`, { param: body, header });
  },
};
export default DGR05Services;
