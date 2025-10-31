import React, { useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export default function ADM02Search({ setSearchData, searchData, onDBT02GetDataList, msSearchSource, msTransferDataGroup }) {
    return (
        <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-3">
                <label>แหล่งข้อมูล</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.source_seq + ""}
                    options={msSearchSource}
                    onChange={(e) => setSearchData({ ...searchData, source_seq: e.value })}
                    placeholder="กรุณาเลือกแหล่งข้อมูล"
                    appendTo={document.body}
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>กลุ่มตาราง</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.transfer_data_group_seq + ""}
                    options={msTransferDataGroup}
                    onChange={(e) => setSearchData({ ...searchData, transfer_data_group_seq: e.value })}
                    placeholder="กรุณาเลือกกลุ่มตาราง"
                    appendTo={document.body}
                />
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '19px' }}>
                <Button onClick={() => onDBT02GetDataList()} className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '38px' }} />
            </div>
        </div>
    )
}
