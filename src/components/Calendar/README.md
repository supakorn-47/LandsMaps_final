Install
-------
```sh
npm install --save sitdev-calendar-primefaces
```

Usage
-----
```js
import { Calendar } from 'sitdev-calendar-primefaces/modify/Calendar';

export const Calendars = ({ onChange, value, yearRange = "2016:2026", maxDate = null, minDate = null, showTime = false, showSeconds = false, dateFormat = "dd/mm/yy", disabled = false }) => {
    var TH = {
        firstDayOfWeek: 1,
        dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุทธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
        dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        dayNamesMin: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค.', 'ส.ค', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
        today: 'วันนี้',
        clear: 'ล้าง',
        dateFormat: 'dd/mm/yyyy',
        weekHeader: 'Sm'
    };
    return (
        <Calendar
            onChange={onChange}
            value={value || null}
            yearRange={yearRange}
            dateFormat={dateFormat}
            showIcon={true}
            showTime={showTime}
            locale={TH}
            showButtonBar
            monthNavigator
            yearNavigator
            appendTo={document.body}
            maxDate={maxDate}
            minDate={minDate}
            showSeconds={showSeconds}
            disabled={disabled}
            baseZIndex={9999}
        />
    );
}
```
[comment]: # npm version patch
[comment]: # npm publish