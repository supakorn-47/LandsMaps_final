import requests from "../httpServices";
import { config_headers } from "../Config";
import { formatDateAPI2 } from "../../utils/DateUtil";

const URL = "backOfficeApi/LPSTS01";

const DGR02Services = {
  GetDataList(body, headers) {
    return requests.get(`${URL}/Get`, body, headers);
  },
  CreateData(body, headers) {
    var formData = new FormData();
    formData.append("gdg_document_seq", 0);
    formData.append("gdg_version", body.gdg_version);
    formData.append(
      "gdg_version_date",
      formatDateAPI2(body.gdg_version_date, false)
    );
    formData.append("gdg_document_name", body.gdg_document_name);
    formData.append("gdg_organizer", body.gdg_organizer);
    formData.append("gdg_approver", body.gdg_approver);
    formData.append("gdg_document_desc", body.gdg_document_desc);
    formData.append("record_status", body.record_status);
    formData.append("gdg_public_flag", body.gdg_public_flag);

    if (body.file !== undefined) {
      formData.append("file", body.file);
    }
    return requests.fromDataPost(`${URL}/Add`, formData, headers);
  },
  UpdateData(body, headers) {
    var formData = new FormData();
    formData.append("gdg_document_seq", body.gdg_document_seq);
    formData.append("gdg_version", body.gdg_version);
    formData.append(
      "gdg_version_date",
      formatDateAPI2(body.gdg_version_date, false)
    );
    formData.append("gdg_document_name", body.gdg_document_name);
    formData.append("gdg_organizer", body.gdg_organizer);
    formData.append("gdg_approver", body.gdg_approver);
    formData.append("gdg_document_desc", body.gdg_document_desc);
    formData.append("record_status", body.record_status);
    formData.append("gdg_public_flag", body.gdg_public_flag);

    if (body.file !== undefined) {
      formData.append("file", body.file);
    }
    return requests.fromDataPut(`${URL}/Update`, formData, headers);
  },
  SetPublicFlag(body, headers) {
    return requests.put(
      `${URL}/SetPublicFlag`,
      {
        gdg_document_seq: body.gdg_document_seq,
        gdg_public_flag: body.gdg_public_flag,
      },
      headers
    );
  },
  CancelData(body) {
    let authorization = config_headers();
    return requests.delete(
      `${URL}/Delete?gdg_document_seq=${body.gdg_document_seq}`,
      {},
      {
        data: {},
        headers: authorization.headers,
      }
    );
  },
};

export default DGR02Services;
