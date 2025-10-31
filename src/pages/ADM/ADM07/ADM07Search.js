import React from 'react'
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

export default function ADM07Search() {
    return (
        <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-2">
                <label htmlFor="date1">วันที่แบบสำรวจ</label>
                <Calendar id="icon" showIcon value={new Date()}/>
            </div>
            <div className="p-field p-col-12 p-md-2">
                <label htmlFor="date1">ถึงวันที่แบบสำรวจ</label>
                <Calendar id="icon" showIcon value={new Date()}/>
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '19px' }}>
                <Button className="p-button" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '38px' }} />
            </div>
        </div>
    )
}
