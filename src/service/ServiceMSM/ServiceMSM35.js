import requests from '../httpServices';
import { formatDateAPI } from '../../utils/DateUtil';

const MSM35Services = {
    GetDataList(body, headers) {
        return requests.post('backOfficeApi/LPSMS35/Get', body, headers);
    },
    GetDataListDay(body, headers) {
        return requests.post('backOfficeApi/LPSMS35/GetDay', {
            ...body,
            log_dtm : body.log_dtm === "" ? formatDateAPI(new Date(), false) : body.log_dtm
        }, headers);
    },
};

export default MSM35Services;