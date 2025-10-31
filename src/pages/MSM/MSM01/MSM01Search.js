import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendars } from '../../../components/Calendar/Calendar';

export default function MSM01Search(props) {

    return (
        <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3">
                <label>วันเวลา Request</label>
                <Calendars 
                    value={props.searchData.log_exchange_dtm_start} 
                    maxDate={props.searchData.log_exchange_dtm_end} 
                    dateFormat={"dd/mm/yy"} 
                    showIcon showTime
                    onChange={(e) => props.setSearchData({ ...props.searchData, log_exchange_dtm_start: e.target.value })} />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>ถึงวันเวลา Request</label>
                <Calendars 
                    value={props.searchData.log_exchange_dtm_end} 
                    maxDate={new Date()} 
                    minDate={props.searchData.log_exchange_dtm_start} 
                    dateFormat={"dd/mm/yy"}
                    showIcon showTime 
                    onChange={(e) => props.setSearchData({ ...props.searchData, log_exchange_dtm_end: e.target.value })} />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>หน่วยงาน</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.department_seq}
                    options={props.optionDepartment}
                    onChange={(e) => props.setSearchData({ ...props.searchData, department_seq: e.value, department_name: e.originalEvent.target.ariaLabel })}
                    appendTo={document.body}
                />
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '19px' }}>
                <Button className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '32px' }}
                    onClick={() => props.onGetDataList()} />
            </div>
        </div>
    )
}
