import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendars } from '../../../components/Calendar/Calendar';

export default function MSM34Search({ setSearchData, searchData, sourceList, tableList, onMSM34GetDataList }) {

    return (
        <div className="p-fluid p-formgrid p-grid">

            {/* <div className="p-col-12" style={{ width: '20.8%' }}>
                <label>วันที่</label>
                <Calendars maxDate={searchData.end_date} value={searchData.start_date} dateFormat={"dd/mm/yy"} onChange={(e) => setSearchData({ ...searchData, start_date: e.target.value })} showIcon />
            </div>
            <div className="p-col-12" style={{ width: '20.8%' }}>
                <label>ถึงวันที่</label>
                <Calendars maxDate={new Date()} minDate={searchData.start_date} value={searchData.end_date} dateFormat={"dd/mm/yy"} onChange={(e) => setSearchData({ ...searchData, end_date: e.target.value })} showIcon />
            </div> */}

            <div className="p-col-12 p-md-3">
                <label>ช่วงจัดเก็บข้อมูล</label>
                <Dropdown
                    filter={true}
                    optionLabel="label"
                    optionValue="value"
                    options={sourceList}
                    value={searchData.source_seq}
                    onChange={(e) => setSearchData({ ...searchData, source_seq: e.value })}
                    appendTo={document.body}
                    placeholder="รายปี/รายเดือน"
                />

            </div>
            <div className="p-col-12 p-md-3">
                <label>Schema ข้อมูล</label>
                <Dropdown
                    filter={true}
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.transfer_data_group_seq + ""}
                    options={tableList}
                    onChange={(e) => setSearchData({ ...searchData, transfer_data_group_seq: e.value })}
                    placeholder="กรุณาเลือก Schema ข้อมูล"
                    appendTo={document.body}
                />
            </div>
            
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '19px' }}>
                <Button onClick={() => onMSM34GetDataList()} className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '38px' }} />
            </div>
        </div>
    )
}
