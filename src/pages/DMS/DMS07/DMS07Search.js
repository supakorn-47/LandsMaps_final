import React from 'react'
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Calendars } from '../../../components/Calendar/Calendar';
// import { InputText } from 'primereact/inputtext';


export default function DMS07Search({ searchData, setSearchData, onSearch }) {
    return (
        <div className="p-fluid p-formgrid p-grid">

            <div className="p-field p-col-12 p-md-3" >
                <label>วันที่</label>
                <Calendars maxDate={searchData.end_date} value={searchData.start_date} dateFormat={"dd/mm/yy"}
                    onChange={(e) => setSearchData({ ...searchData, start_date: e.target.value })} showIcon />
            </div>
            <div className="p-field p-col-12 p-md-3" >
                <label>ถึงวันที่</label>
                <Calendars maxDate={new Date()} minDate={searchData.end_date} value={searchData.end_date} dateFormat={"dd/mm/yy"}
                    onChange={(e) => setSearchData({ ...searchData, end_date: e.target.value })} showIcon />
            </div>

            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '19px' }}>
                <Button className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '38px' }}
                    onClick={() => onSearch()} />
            </div>
        </div>
    )
}
