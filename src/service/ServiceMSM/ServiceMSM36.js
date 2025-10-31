import requests from "../httpServices";
import { formatDateAPI } from "../../utils/DateUtil";

const MSM36Services = {
  GetDataList(body, headers) {
    return requests.get("backOfficeApi/MSM36/Get", headers);
  },
};

export default MSM36Services;
