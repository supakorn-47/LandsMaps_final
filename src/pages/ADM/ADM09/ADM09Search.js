import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Calendars } from '../../../components/Calendar/Calendar';

export default function ADM09Search({ registerType, searchData, setSearchData, onSearch, provinceList }) {

    // const [checkDate, setCheckDate] = useState(true);

    return (
        <div className="p-fluid p-formgrid p-grid">
            {/* <div className="p-field p-col-12 p-md-12">
                <Checkbox tooltip="คลิกเพื่อ ไม่ใช้วันที่" onChange={e => setCheckDate(e.checked)} checked={checkDate}></Checkbox><label style={{ marginLeft: '5px' }}>ใช้วันที่ในการค้นหา</label>
            </div> */}
            <div className="p-field p-col-12  p-md-3">  {/* style={{ width: '20.8%' }} */}
                <label>วันที่</label>
                <Calendars
                    // disabled={!checkDate} 
                    maxDate={searchData.create_dtm_to} value={searchData.create_dtm_from} onChange={(e) => setSearchData({ ...searchData, create_dtm_from: e.value })} />
            </div>
            <div className="p-field p-col-12  p-md-3"> {/* style={{ width: '20.8%' }} */}
                <label>ถึงวันที่</label>
                <Calendars
                    // disabled={!checkDate} 
                    maxDate={new Date()} minDate={searchData.create_dtm_from} value={searchData.create_dtm_to} onChange={(e) => setSearchData({ ...searchData, create_dtm_to: e.value })} />
            </div>
            <div className="p-field p-col-12 p-md-6" />

            <div className="p-field p-col-12 p-md-3">
                <label>ชื่อ-สกุล</label>
                <InputText value={searchData.person_fullname} onChange={(e) => setSearchData({ ...searchData, person_fullname: e.target.value })} />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>กลุ่มผู้ใช้งาน</label>
                <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.register_type_seq}
                    options={registerType}
                    onChange={(e) => setSearchData({ ...searchData, register_type_seq: e.value })}
                    // placeholder="เลือกประเภทผู้ใช้งาน"
                    appendTo={document.body} />
            </div>

            <div className="p-field p-col-12 p-md-3">
                <label>จังหวัด</label>
                <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.province_seq}
                    options={provinceList}
                    onChange={(e) => setSearchData({ ...searchData, province_seq: e.value })}
                    // placeholder="เลือกจังหวัด"
                    appendTo={document.body} />
            </div>

            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px' }}>
                <Button onClick={() => onSearch()} className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '36px' }} />

            </div>
        </div>
    )
}
