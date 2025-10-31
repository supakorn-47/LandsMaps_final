import { config_headers } from "../Config";
import requests from "../httpServices";

const ADM02Services = {
  GetDataList(body, headers) {
    return requests.get("backOfficeApi/LPASM02/Get", body, headers);
  },
  CreateData(body, headers) {
    var formData = new FormData();
    formData.append("department_seq", 0);
    formData.append("department_name_th", body.department_name_th);
    formData.append("department_name_en", body.department_name_en);
    formData.append("department_type", "");
    formData.append("register_type_seq", 0);
    formData.append("remark", body.remark === null ? "" : body.remark);
    formData.append("record_status", body.record_status);
    if (body.file !== undefined) {
      formData.append("file", body.file);
    }
    return requests.fromDataPost(
      "backOfficeApi/LPASM02/Add",
      formData,
      headers
    );
  },
  UpdateData(body, headers) {
    var formData = new FormData();
    formData.append("department_seq", body.department_seq);
    formData.append("department_name_th", body.department_name_th);
    formData.append("department_name_en", body.department_name_en);
    formData.append("department_type", "");
    formData.append("register_type_seq", 0);
    formData.append("remark", body.remark === null ? "" : body.remark);
    formData.append("record_status", body.record_status);
    if (body.file !== undefined) {
      formData.append("file", body.file);
    }
    return requests.fromDataPut(
      "backOfficeApi/LPASM02/Update",
      formData,
      headers
    );
  },
  CancelData(body) {
    let authorization = config_headers();
    return requests.delete(
      "backOfficeApi/LPASM02/Delete",
      {},
      {
        data: {
          department_seq: body.department_seq,
          record_status: body.record_status,
        },
        headers: authorization.headers,
      }
    );
  },
  UpdateUpOrDownData(body, headers) {
    let arr = [];
    body.forEach((element) => {
      arr.push(element.department_seq);
    });
    return requests.put(
      "backOfficeApi/LPASM02/UpdateOrder",
      {
        order_seq_list: arr,
      },
      headers
    );
  },
  GetRegisterLink: async (department_seq) => {
    try {
      const res = await requests.get(
        `backOfficeApi/LPASM02/GetLinkSecret?DepartmentSeq=${department_seq}`
      );

      if (res.status === 200) {
        return res.result || {};
      } else {
        // Handle non-200 status codes from API response
        const errorMessage =
          res.errors?.message || res.message || "Unknown error occurred";

        // Create a structured error object
        const error = new Error(`API Error: ${errorMessage}`);
        error.status = res.status;
        error.response = {
          data: {
            status: res.status,
            message: errorMessage,
            errors: res.errors,
          },
        };

        throw error;
      }
    } catch (error) {
      // Handle network errors or other exceptions
      if (error.response) {
        // Error already structured above, re-throw it
        throw error;
      } else {
        // Network error or other exception
        const networkError = new Error(`Network Error: ${error.message}`);
        networkError.status = 0; // Indicate network error
        networkError.response = {
          data: {
            status: 0,
            message: error.message,
          },
        };
        throw networkError;
      }
    }
  },
  GenerateLinkSecret: async () => {
    try {
      const res = await requests.get(
        "/backOfficeApi/LPASM02/GenerateLinkSecret"
      );

      if (res.status === 200) {
        return res.result || {};
      } else {
        // Handle non-200 status codes from API response
        const errorMessage =
          res.errors?.message || res.message || "Unknown error occurred";

        // Create a structured error object
        const error = new Error(`API Error: ${errorMessage}`);
        error.status = res.status;
        error.response = {
          data: {
            status: res.status,
            message: errorMessage,
            errors: res.errors,
          },
        };

        throw error;
      }
    } catch (error) {
      // Handle network errors or other exceptions
      if (error.response) {
        // Error already structured above, re-throw it
        throw error;
      } else {
        // Network error or other exception
        const networkError = new Error(`Network Error: ${error.message}`);
        networkError.status = 0; // Indicate network error
        networkError.response = {
          data: {
            status: 0,
            message: error.message,
          },
        };
        throw networkError;
      }
    }
  },
  UpdateLinkSecret: async (body) => {
    console.log("UpdateLinkSecret - body:", body);

    try {
      const res = await requests.post(
        "/backOfficeApi/LPASM02/UpdateLinkSecret",
        body
      );

      if (res.status === 200) {
        return res.result;
      } else {
        // Handle non-200 status codes from API response
        const errorMessage =
          res.errors?.message || res.message || "Unknown error occurred";

        // Create a structured error object
        const error = new Error(`API Error: ${errorMessage}`);
        error.status = res.status;
        error.response = {
          data: {
            status: res.status,
            message: errorMessage,
            errors: res.errors,
          },
        };

        throw error;
      }
    } catch (error) {
      // Handle network errors or other exceptions
      if (error.response) {
        // Error already structured above, re-throw it
        throw error;
      } else {
        // Network error or other exception
        const networkError = new Error(`Network Error: ${error.message}`);
        networkError.status = 0; // Indicate network error
        networkError.response = {
          data: {
            status: 0,
            message: error.message,
          },
        };
        throw networkError;
      }
    }
  },
};

export default ADM02Services;
