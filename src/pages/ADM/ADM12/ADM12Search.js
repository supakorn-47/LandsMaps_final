import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { monthNamesTH, yearTH2 } from '../../../utils/DateUtil';

export default function ADM12Search(props) {

    var d = new Date();
    d.setFullYear(2564);

    const onChangeAmphur = (e) => {
        props.setSearchData({ ...props.searchData, amphur_seq: e.target.value })
        props.onGetOpt(e.target.value)
    }

    return (
        <div className="p-fluid p-formgrid p-grid">

            <div className="p-field p-col-12 p-md-3">
                <label>จังหวัด</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.province_seq}
                    options={props.optionProvince}
                    appendTo={document.body}
                    onChange={(e) => props.onGetAmphur(e.target.value)}
                    filter
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>อำเภอ</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.amphur_seq}
                    onChange={(e) => onChangeAmphur(e)}
                    options={props.optionAmphur.length === 0 ? [{ label: 'ทั้งหมด', value: '-1' }] : props.optionAmphur}
                    appendTo={document.body}
                    disabled={props.optionAmphur.length === 0}
                    filter
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>องค์กรปกครองส่วนท้องถิ่น (อปท.)</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.opt_seq}
                    onChange={(e) => props.setSearchData({ ...props.searchData, opt_seq: e.target.value })}
                    options={props.optionOpt.length === 0 ? [{ label: 'ทั้งหมด', value: '-1' }] : props.optionOpt}
                    appendTo={document.body}
                    disabled={props.optionOpt.length === 0}
                    filter
                />
            </div>
            <div className="p-field p-col-12 p-md-1"></div>
            <div className="p-field p-col-12 p-md-3">
                <label>ปี</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.wp_year}
                    onChange={(e) => props.setSearchData({ ...props.searchData, wp_year: e.target.value })}
                    options={yearTH2((new Date().getFullYear() + 543 - 5), (new Date().getFullYear() + 543 + 1), false)}
                    appendTo={document.body}
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>จากเดือน</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.wp_month_from}
                    onChange={(e) => props.setSearchData({ ...props.searchData, wp_month_from: e.target.value })}
                    options={[...monthNamesTH()]} //{ label: 'ทั้งหมด', value: '-1' }, 
                    appendTo={document.body}
                />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label>ถึงเดือน</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.wp_month_to}
                    onChange={(e) => props.setSearchData({ ...props.searchData, wp_month_to: e.target.value })}
                    options={[...monthNamesTH()]}
                    appendTo={document.body}
                />
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px', display: 'flex' }}>
                <Button onClick={() => props.onSearch()} className="p-button-rounded" type="button" icon="pi pi-search" label="ค้นหา" style={{ height: '36px' }} />
                {/* <Button onClick={() => props.setSearchData({
                    "wp_month_from": "01",//+ (new Date().getMonth()+1),
                    "wp_month_to": "" + (new Date().getMonth() + 1),
                    "wp_year": "" + (new Date().getFullYear() + 543),
                    "province_seq": "-1",
                    "opt_seq": "-1",
                    "amphur_seq": "-1"
                })} className="p-button-rounded" type="button" icon="pi pi-times" label="ล้าง" style={{ height: '36px', marginLeft: '5px', backgroundColor: 'rgb(167 172 175)', color: '#ffffff', borderColor: 'rgb(167 172 175)' }} /> */}
            </div>
            <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px' }}>
                <Button className="p-button-rounded p-button-danger" type="button" icon="pi pi-replay" label="ล้าง" style={{ height: '36px' }} onClick={() =>
                    props.setSearchData({
                        "wp_month_from": String((new Date().getMonth() + 1)).padStart(2, '0'),
                        "wp_month_to": String((new Date().getMonth() + 1)).padStart(2, '0'),
                        "wp_year": "" + (new Date().getFullYear() + 543),
                        "province_seq": "-1",
                        "opt_seq": "-1",
                        "amphur_seq": "-1"
                    })
                } />
            </div>
        </div>
    )
}
