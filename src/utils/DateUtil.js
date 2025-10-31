import { replaceNoENtoTH } from './ReplaceStr';
var dateFormat = require('dateformat');

export const displayDateTH = () => {
    let th = {
        firstDayOfWeek: 1,
        dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุทธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
        dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        dayNamesMin: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค.', 'ส.ค', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
        today: 'Hoy',
        clear: 'Limpiar',
        dateFormat: 'dd/mm/yyyy',
        weekHeader: 'Sm'
    }
    return th;
}

export const monthNamesTH = () => {
    const data = [
        { label: 'มกราคม', value: '01' },
        { label: 'กุมภาพันธ์', value: '02' },
        { label: 'มีนาคม', value: '03' },
        { label: 'เมษายน', value: '04' },
        { label: 'พฤษภาคม', value: '05' },
        { label: 'มิถุนายน', value: '06' },
        { label: 'กรกฎาคม', value: '07' },
        { label: 'สิงหาคม', value: '08' },
        { label: 'กันยายน', value: '09' },
        { label: 'ตุลาคม', value: '10' },
        { label: 'พฤศจิกายน', value: '11' },
        { label: 'ธันวาคม', value: '12' },
    ]
    return data;
}

export const yearTH = (start, end, require) => {
    //รับ start, end เข้ามาจะได้ เริ่ม -> สิ้นสุด
    const data = [];
    if (require) { data.push({ label: "-กรุณาเลือก-", value: "-1" }); }
    for (let index = start; index < end; index++) {
        data.push({ label: index.toString(), value: index });
    }
    return data;
}

export const yearTH2 = (start, end, require) => {
    //รับ start, end เข้ามาจะได้ เริ่ม -> สิ้นสุด
    const data = [];
    if (require) { data.push({ label: "-กรุณาเลือก-", value: "-1" }); }
    for (let index = start; index < end; index++) {
        data.push({ label: index, value: index + "" });
    }
    return data;
}

export const dayTH = (month, year) => {
    //รับ month, year เข้ามาจะได้ max day เดือนนั้นออกไป
    const data = [];
    let maxDayInMonth = new Date(year, month, 0).getDate()

    for (let index = 1; index <= maxDayInMonth; index++) {
        data.push({ label: index.toString(), value: index });
    }
    return data;
}

// export const formatDateTH = (date, isTime) => {
//     let conv_to_date = new Date(date);
//     let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear() + 543));
//     let data = '';
//     if (date !== undefined && date !== null) {
//         if (isTime === true) {
//             data = dateFormat(date_dt, "dd/mm/yyyy HH:MM");

//         } else {
//             data = dateFormat(date_dt, "dd/mm/yyyy");
//         }
//     }
//     return data;
// }

export const formatDateTH = (_date, isTime) => {
    let conv_to_date = new Date(_date);
    let date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM");
    let date_time_arr = date.split(' ');
    let date_arr = [];
    let data = '';
    date_arr = date_time_arr[0].split('/');
    date_arr[2] = parseInt(date_arr[2]) + 543;
    if (_date !== undefined && _date !== null)
        if (isTime) {
            data = date_arr[0] + '/' + date_arr[1] + '/' + date_arr[2] + ' ' + date_time_arr[1];
        } else {
            data = date_arr[0] + '/' + date_arr[1] + '/' + date_arr[2];
        }
    return data;
}

export const formatDateTH2 = (_date, isTime) => {
    if (!_date) return '';
    
    try {
        let conv_to_date = new Date(_date);
        if (isNaN(conv_to_date.getTime())) return '';
        
        let date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM:ss");
        let date_time_arr = date.split(' ');
        let date_arr = date_time_arr[0].split('/');
        date_arr[2] = parseInt(date_arr[2]) + 543;
        
        return isTime 
            ? `${date_arr[0]}/${date_arr[1]}/${date_arr[2]} ${date_time_arr[1]}`
            : `${date_arr[0]}/${date_arr[1]}/${date_arr[2]}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}


// export const formatDateTH2 = (date, isTime) => {
//     let conv_to_date = new Date(date);
//     let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear() + 543));
//     let data = '';
//     if (date !== undefined && date !== null) {
//         if (isTime === true) {
//             data = dateFormat(date_dt, "dd/mm/yyyy HH:MM:ss");

//         } else {
//             data = dateFormat(date_dt, "dd/mm/yyyy");
//         }
//     }
//     return data;
// }

export const formatDateAPI = (date, isTime) => {
    let conv_to_date = new Date(date);
    let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear()));
    let data = '';
    if (date !== undefined && date !== null) {
        if (isTime === true) {
            data = dateFormat(date_dt, "yyyymmdd HH:MM");

        } else {
            data = dateFormat(date_dt, "yyyymmdd");
        }
    }
    return data;
}

export const formatDateAPI2 = (date, isTime) => {
    let conv_to_date = new Date(date);
    let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear()));
    let data = '';
    if (date !== undefined && date !== null) {
        if (isTime === true) {
            data = dateFormat(date_dt, "yyyy-mm-dd HH:MM");

        } else {
            data = dateFormat(date_dt, "yyyy-mm-dd");
        }
    }
    return data;
}

export const monthNamesTH_full = (mm) => {
    const data_list = [
        { label: 'มกราคม', value: '01' },
        { label: 'กุมภาพันธ์', value: '02' },
        { label: 'มีนาคม', value: '03' },
        { label: 'เมษายน', value: '04' },
        { label: 'พฤษภาคม', value: '05' },
        { label: 'มิถุนายน', value: '06' },
        { label: 'กรกฎาคม', value: '07' },
        { label: 'สิงหาคม', value: '08' },
        { label: 'กันยายน', value: '09' },
        { label: 'ตุลาคม', value: '10' },
        { label: 'พฤศจิกายน', value: '11' },
        { label: 'ธันวาคม', value: '12' },
    ];

    let data = data_list.filter(y => y.value === mm);

    return data[0].label;
}

export const formatDateTH_full = (data_date, isTime) => {
    let conv_to_date = new Date(data_date);
    let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear()));
    let date = dateFormat(date_dt, "dd/mm/yyyy HH:MM");
    let date_time_arr = date.split(' ');
    let date_arr = [];
    let date_full = '';
    if (date_time_arr[0] !== undefined && date_time_arr[0] !== '') {
        date_arr = date_time_arr[0].split('/');

        if (isTime === true) {
            date_full = 'วันที่ ' + replaceNoENtoTH(date_arr[0]) + ' ' + replaceNoENtoTH(monthNamesTH_full(date_arr[1])) + ' ' + replaceNoENtoTH(date_arr[2]) + '  เวลา ' + replaceNoENtoTH(date_time_arr[1]) + ' นาฬิกา';
        } else {
            date_full = 'วันที่ ' + replaceNoENtoTH(date_arr[0]) + ' ' + replaceNoENtoTH(monthNamesTH_full(date_arr[1])) + ' ' + replaceNoENtoTH(date_arr[2]);
        }
    }
    return date_full;
}


export const formatDateTH_full2 = (data_date, isTime) => {
    let conv_to_date = new Date(data_date === undefined || data_date === null ? new Date() : data_date);
    // let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear() + 543));
    let date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM");
    let date_time_arr = date.split(' ');
    let date_arr = [];
    let date_full = '';
    if (date_time_arr[0] !== undefined && date_time_arr[0] !== '') {
        date_arr = date_time_arr[0].split('/');
        date_arr[2] = parseInt(date_arr[2]) + 543;

        if (isTime === true) {
            date_full = 'วันที่ ' + replaceNoENtoTH(date_arr[0]) + ' ' + replaceNoENtoTH(monthNamesTH_full(date_arr[1])) + ' ' + replaceNoENtoTH(date_arr[2]) + '  เวลา ' + replaceNoENtoTH(date_time_arr[1]) + ' น.';
        } else {
            date_full = 'วันที่ ' + replaceNoENtoTH(date_arr[0]) + ' ' + replaceNoENtoTH(monthNamesTH_full(date_arr[1])) + ' ' + replaceNoENtoTH(date_arr[2]);
        }
    }
    return date_full;
}

export const formatDateTH_full3 = (data_date, isTime) => {
    let conv_to_date = new Date(data_date === undefined || data_date === null ? new Date() : data_date);
    // let date_dt = new Date(conv_to_date.setFullYear(conv_to_date.getFullYear() + 543));
    let date = dateFormat(conv_to_date, "dd/mm/yyyy HH:MM:ss");
    let date_time_arr = date.split(' ');
    let date_arr = [];
    let date_full = '';
    if (date_time_arr[0] !== undefined && date_time_arr[0] !== '') {
        date_arr = date_time_arr[0].split('/');
        date_arr[2] = parseInt(date_arr[2]) + 543;

        if (isTime === true) {
            date_full = date_arr[0] + '/' + date_arr[1] + '/' + date_arr[2] + ' ' + date_time_arr[1];
        } else {
            date_full = date_arr[0] + '/' + date_arr[1] + '/' + date_arr[2];
        }
    }
    return date_full;
}

export const getDateTime = (date) => {
    if (!date) return null;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (month.toString().length === 1) {
        month = "0" + month;
    }
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    if (hour.toString().length === 1) {
        hour = "0" + hour;
    }
    if (minutes.toString().length === 1) {
        minutes = "0" + minutes;
    }
    if (seconds.toString().length === 1) {
        seconds = "0" + seconds;
    }

    let dateFormat = year + "-" + month + "-" + day;
    return `${dateFormat}T${hour}:${minutes}:${seconds}`;
}

