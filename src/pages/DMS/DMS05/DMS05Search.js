import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendars } from "../../../components/Calendar/Calendar";

var d = new Date();
export default function DMS05Search({
    setSearchData,
    searchData,
    onDMS05GetDataList,
}) {
    return (
        <div className="search-container">
            <p className="p-m-0" style={{ fontSize: '18px', fontWeight: 'bold' }}>ดึงข้อมูลแปลงที่ดิน</p>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="date1">วันที่</label>
                    <Calendars
                        value={searchData.start_date}
                        onChange={(e) =>
                            setSearchData({ ...searchData, start_date: e.value })
                        }
                        maxDate={searchData.end_date}
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="date1">ถึงวันที่</label>
                    <Calendars
                        value={searchData.end_date}
                        onChange={(e) => setSearchData({ ...searchData, end_date: e.value })}
                        maxDate={new Date()}
                        minDate={searchData.start_date}
                    />
                </div>
                <div className="p-field p-col-12 p-md-1" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                    <Button
                        onClick={() => onDMS05GetDataList()}
                        className="modern-search-button"
                        type="button"
                        icon="pi pi-search"
                        label="ค้นหา"
                    />
                </div>
            </div>
        </div>
    );
}
