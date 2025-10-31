import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { Calendars } from '../../../components/Calendar/Calendar';

var d = new Date();
d.setFullYear(2564);

export default function LPADM06Search({ searchData, setSearchData, onSearch }) {

    return (
        <div className="search-container">
            <p className="p-m-0" style={{ fontSize: '18px', fontWeight: 'bold' }}>ประวัติ OTP</p>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                    <label>วันที่</label>
                    <Calendars 
                        maxDate={searchData.otp_dtm_from} 
                        value={searchData.otp_dtm_from} 
                        dateFormat={"dd/mm/yy"} showIcon 
                        onChange={(e) => setSearchData({ ...searchData, otp_dtm_from: e.value })} />
                </div>
                <div className="p-field p-col-12 p-md-6">
                    <label>ถึงวันที่</label>
                    <Calendars 
                        maxDate={searchData.otp_dtm_from} 
                        // minDate={searchData.otp_dtm_from} 
                        value={searchData.otp_dtm_to} dateFormat={"dd/mm/yy"} 
                        showIcon onChange={(e) => setSearchData({ ...searchData, otp_dtm_to: e.value })} />
                </div>
                <div className="p-field p-col-12 p-md-1" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                    <Button className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '36px' }} onClick={() => onSearch()} />
                </div>
            </div>
        </div>
    )
}
