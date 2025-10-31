import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendars } from '../../../components/Calendar/Calendar';
import { getSession } from '../../../utils/Crypto';

export default function ADM08Search({ searchData, setSearchData, onSearch, registerType }) {

    const statusType = [
        { value: -1, label: "ทั้งหมด" },
        { value: 0, label: "ไม่อนุมัติ" },
        { value: 1, label: "อนุมัติ" },
        { value: 3, label: "รออนุมัติ" }
    ]
    return (
        <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-2">
                <label htmlFor="date1">วันที่</label>
                <Calendars
                    value={searchData.create_dtm_from}
                    onChange={(e) => setSearchData({
                        ...searchData,
                        create_dtm_from: e.value
                    })}
                    maxDate={searchData.create_dtm_to}
                />
            </div>
            <div className="p-field p-col-12 p-md-2">
                <label htmlFor="date1">ถึงวันที่</label>
                <Calendars
                    value={searchData.create_dtm_to}
                    onChange={(e) => setSearchData({
                        ...searchData,
                        create_dtm_to: e.value
                    })}
                    maxDate={new Date()} minDate={searchData.create_dtm_from}
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>กลุ่มผู้ใช้งาน</label>
                <Dropdown
                    // filter
                    // filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.register_type_seq}
                    options={registerType}
                    onChange={(e) => setSearchData({ ...searchData, register_type_seq: e.value })}
                    placeholder="กลุ่มผู้ใช้งาน"
                    appendTo={document.body}
                    // disabled={getSession('login').result.register_type_seq === 6 }
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>สถานะผู้ใช้งาน</label>
                <Dropdown
                    // filter
                    // filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.approve_flag}
                    options={statusType}
                    onChange={(e) => setSearchData({ ...searchData, approve_flag: e.value })}
                    placeholder="สถานะผู้ใช้งาน"
                    appendTo={document.body} />
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px' }}>
                <Button onClick={() => onSearch()} className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '36px' }} />
            </div>
        </div>
    )
}
