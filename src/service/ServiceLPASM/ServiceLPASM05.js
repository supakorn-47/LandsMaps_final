import requests from "../httpServices";

const LPASM05Services = {
  getList: async (body) => {
    return requests.get("backOfficeApi/LPASM05/GetList", body);
  },
  getById: async (id) => {
    return requests.get(`backOfficeApi/LPASM05/GetById?department_seq=${id}`);
  },
  createOrUpdate: async (body) => {
    return requests.post("backOfficeApi/LPASM05/CreateOrUpdate", body);
  },
};

export default LPASM05Services;
