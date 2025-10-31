import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendars } from '../../../components/Calendar/Calendar';
import { MultiSelect } from 'primereact/multiselect';

export default function DMS06Search({ onGetTransferDataGroup, selectedTF, setSelectedTF, setSearchData, searchData, sourceList, tableList, onDMS06GetDataList }) {

    const optionMsSchema = [
        { label: 'ทั้งหมด', value: "-1" },
        { label: 'REG', value: "REG" },
        { label: 'MAPDOL', value: "MAPDOL" },
        { label: 'MAS', value: "MAS" },
        { label: 'SVO', value: "SVO" },
        { label: 'APS', value: "APS" }
    ];

    const onChangeTransferDataGroup = (e) => {
        onGetTransferDataGroup(e.value === "-1" ? "" : e.originalEvent.target.ariaLabel)
        setSearchData({ ...searchData, source_schema: e.value })
        setSelectedTF([])
    }

    return (
        <div className="search-container">
            <p className="p-m-0" style={{ fontSize: '18px', fontWeight: 'bold' }}>รายงานสรุปการถ่ายโอนข้อมูล</p>
            <div className="p-fluid p-formgrid p-grid">

                <div className="p-col-12 p-md-2">
                    <label>วันที่</label>
                    <Calendars maxDate={searchData.end_date} value={searchData.start_date} dateFormat={"dd/mm/yy"} onChange={(e) => setSearchData({ ...searchData, start_date: e.target.value })} showIcon />
                </div>
                <div className="p-col-12 p-md-2">
                    <label>ถึงวันที่</label>
                    <Calendars maxDate={new Date()} minDate={searchData.start_date} value={searchData.end_date} dateFormat={"dd/mm/yy"} onChange={(e) => setSearchData({ ...searchData, end_date: e.target.value })} showIcon />
                </div>

                <div className="p-col-12 p-md-2">
                    <label>แหล่งข้อมูล</label>
                    <Dropdown
                        // filter={true}
                        optionLabel="label"
                        optionValue="value"
                        options={sourceList}
                        value={searchData.source_seq + ""}
                        onChange={(e) => setSearchData({ ...searchData, source_seq: e.value })}
                        appendTo={document.body}
                        className="modern-dropdown"
                    />

                </div>

                <div className="p-col-12 p-md-2">
                    <label>Schema</label>
                    <Dropdown
                        optionLabel="label"
                        optionValue="value"
                        value={searchData.source_schema + ""}
                        options={optionMsSchema}
                        onChange={(e) => onChangeTransferDataGroup(e)}
                        appendTo={document.body}
                        className="modern-dropdown"
                    />
                </div>

                <div className="p-col-12 p-md-3">
                    <label>กลุ่มตาราง</label>
                    <MultiSelect
                        value={selectedTF}
                        options={tableList}
                        onChange={(e) => setSelectedTF(e.value)}
                        appendTo={document.body}
                        filter
                        filterBy='label'
                        selectedItemsLabel={"ตารางข้อมูลที่เลือก {0} รายการ"}
                        placeholder="ทั้งหมด"
                        showClear
                        className="modern-multiselect"
                        style={{ width: '100%', height: '40px', borderRadius: '5px' }}
                    />
                </div>
                <div className="p-field p-col-12 p-md-1" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                    <Button onClick={() => onDMS06GetDataList()} className="modern-search-button" type="button" icon="pi pi-search" label="ค้นหา" />
                </div>
            </div>
        </div>
    )
}
