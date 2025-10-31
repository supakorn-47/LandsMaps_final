import React from 'react'
import { Calendars } from '../../../components/Calendar/Calendar';
import { Button } from 'primereact/button';

export default function ADM06Search({ searchData, setSearchData, onSearch }) {
    return (
        <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3">
                <label>วันที่ประกาศ</label>
                <Calendars
                    // maxDate={searchData.announce_date_to}
                    value={searchData.announce_date_from}
                    dateFormat={"dd/mm/yy"}
                    onChange={(e) => setSearchData({ ...searchData, announce_date_from: e.value })}
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>ถึงวันที่ประกาศ</label>
                <Calendars
                    // maxDate={new Date()}
                    // minDate={searchData.announce_date_from}
                    value={searchData.announce_date_to}
                    dateFormat={"dd/mm/yy"}
                    onChange={(e) => setSearchData({ ...searchData, announce_date_to: e.value })}
                />
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px' }}>
                <Button onClick={() => onSearch()} className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '36px' }} />
            </div>
        </div>
    )
}
