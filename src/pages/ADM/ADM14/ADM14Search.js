import React, { useEffect } from 'react';
import { Calendars } from '../../../components/Calendar/Calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

let dates = new Date();
dates.setDate(1);

export default function ADM14Search(props) {

    useEffect(() => {
        props.setSearchData({
            "error_type_seq": -1,
            "landoffice_id": "-1",
            "question_dt_start": dates,
            "question_dt_end": new Date(),
            "error_question_status": "-1",


            "start": 0,
            "length": 1000000,
            "recordsTotal": 0,

            "province_seq": "-1",
        });
    }, [props.changes])


    const onClear = () => {
        props.setSearchData({
            "error_type_seq": -1,
            "landoffice_id": "-1",
            "question_dt_start": new Date(),
            "question_dt_end": new Date(),
            "error_question_status": "-1",


            "start": 0,
            "length": 1000000,
            "recordsTotal": 0,

            "province_seq": "-1",
        });
        props.setchanges(Math.random());
    }
    return (
        <div>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-3">
                    <label>จังหวัด</label>
                    <Dropdown
                        optionLabel="label"
                        optionValue="value"
                        value={props.searchData.province_seq}
                        options={props.optionProvince}
                        appendTo={document.body}
                        onChange={(e) => props.onGetMasterLandoffice(e.target.value)}
                        filter
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label>สำนักงานที่ดิน</label>
                    <Dropdown
                        optionLabel="label"
                        optionValue="value"
                        value={props.searchData.landoffice_id}
                        options={props.optionLandoffice}
                        appendTo={document.body}
                        onChange={(e) => props.setSearchData({ ...props.searchData, landoffice_id: e.target.value })}
                        filter
                        disabled={props.optionLandoffice.length === 0}
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label>ประเภทข้อผิดพลาด</label>
                    <Dropdown
                        optionLabel="label"
                        optionValue="value"
                        value={props.searchData.error_type_seq + ""}
                        options={props.optionErrorType}
                        appendTo={document.body}
                        onChange={(e) => props.setSearchData({ ...props.searchData, error_type_seq: e.target.value })}
                        filter
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label>สถานะ</label>
                    <Dropdown
                        optionLabel="label"
                        optionValue="value"
                        value={props.searchData.error_question_status}
                        options={props.optionErrorQuestionStatus}
                        appendTo={document.body}
                        onChange={(e) => props.setSearchData({ ...props.searchData, error_question_status: e.target.value })}
                        filter
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label>วันที่แจ้ง</label>
                    <Calendars
                        value={props.searchData.question_dt_start}
                        dateFormat={"dd/mm/yy"}
                        showIcon
                        maxDate={props.searchData.question_dt_end}
                        onChange={(e) => props.setSearchData({ ...props.searchData, question_dt_start: e.value })}
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label>ถึง</label>
                    <Calendars
                        value={props.searchData.question_dt_end}
                        dateFormat={"dd/mm/yy"}
                        showIcon
                        maxDate={props.searchData.question_dt_start}
                        onChange={(e) => props.setSearchData({ ...props.searchData, question_dt_end: e.value })}
                    />
                </div>
                <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px' }}>
                    <Button
                        onClick={() => props.onGetDataList()}
                        className="p-button-rounded"
                        type="button"
                        icon="pi pi-search"
                        label="ค้นหา"
                        style={{ height: '36px' }}
                    />
                </div>
                <div className="p-field p-col-12 p-md-1" style={{ marginTop: '17px' }}>
                    <Button className="p-button-rounded p-button-danger" type="button" icon="pi pi-replay" label="ล้าง" style={{ height: '36px' }} onClick={() => onClear()} />
                </div>
            </div>
        </div>
    )
}
