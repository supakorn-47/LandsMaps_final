import axios from 'axios';
import { config_headers, URL_API } from '../Config';
import { formatDateAPI } from '../../utils/DateUtil';

export const LPADM06GetDataList = async (body) => {
  const data = {
    otp_dtm_from: body.otp_dtm_from
      ? formatDateAPI(body.otp_dtm_from, false)
      : '',
    otp_dtm_to: body.otp_dtm_to
      ? formatDateAPI(body.otp_dtm_to, false)
      : '',
  };

  console.log('[LPADM06] Request Data:', data);
  console.log('[LPADM06] API URL:', URL_API('backOfficeApi/LPADM06/Get'));

  try {
    const authorization = await config_headers();
    const res = await axios.post(URL_API('backOfficeApi/LPADM06/Get'), data, authorization);
    return res.data;
  } catch (err) {
    console.error('[LPADM06] API Error:', err);
    throw err;
  }
};
