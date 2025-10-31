import React, { useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Calendars } from "../../../components/Calendar/Calendar";
import { Dropdown } from "primereact/dropdown";

export default function DBT03Search({
  setSearchData,
  searchData,
  onDBT03GetDataList,
  msSearchSource,
  msDataTable,
}) {
  const [amtSelect1, setAmtSelect1] = useState(0);
  const [amtSelect2, setAmtSelect2] = useState(0);
  const onInputChange1 = (e) => {
    setSearchData({ ...searchData, source_process: e.value });
    setAmtSelect1(e.value.length);
  };
  const onInputChange2 = (e) => {
    setSearchData({ ...searchData, table: e.value });
    setAmtSelect2(e.value.length);
  };

  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="date1">วันที่</label>
        <Calendars
          value={searchData.start_date}
          onChange={(e) => {
            setSearchData({ ...searchData, start_date: e.value });
          }}
          maxDate={searchData.end_date}
        />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label htmlFor="date1">ถึงวันที่</label>
        <Calendars
          value={searchData.end_date}
          onChange={(e) => setSearchData({ ...searchData, end_date: e.value })}
          maxDate={new Date()}
          minDate={searchData.start_date}
        />
      </div>

      <div className="p-field p-col-12 p-md-6">
        <label>แหล่งข้อมูล</label>
        {/* <MultiSelect value={searchData.source_process} className="___full-content"
                    options={msSearchSource} onChange={(e) => onInputChange1(e)}
                    maxSelectedLabels={5} selectedItemsLabel={"แหล่งข้อมูลที่เลือก" + " " + amtSelect1 + " " + "รายการ"}
                    filter={true} /> */}
        <Dropdown
          filter={true}
          optionLabel="label"
          optionValue="value"
          value={searchData.source_seq + ""}
          options={msSearchSource}
          onChange={(e) =>
            setSearchData({ ...searchData, source_seq: e.value })
          }
          placeholder="กรุณาเลือกแหล่งข้อมูล"
          appendTo={document.body}
        />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label>กลุ่มตาราง</label>
        {/* <MultiSelect
                    value={searchData.table}
                    className="___full-content"
                    options={msDataTable}
                    onChange={(e) => setSearchData({ ...searchData, table: e.value })}
                    maxSelectedLabels={5}
                    selectedItemsLabel={"ตารางข้อมูลที่เลือก xx รายการ"}
                    filter={true}
                /> */}
        <Dropdown
          filter={true}
          optionLabel="label"
          optionValue="value"
          value={searchData.transfer_data_group_seq + ""}
          options={msDataTable}
          onChange={(e) =>
            setSearchData({ ...searchData, transfer_data_group_seq: e.value })
          }
          // placeholder="กรุณาเลือกตารางข้อมูล"
          appendTo={document.body}
        />
      </div>
      <div className="p-field p-col-12" style={{ marginTop: "1rem" }}>
        <Button
          onClick={() => onDBT03GetDataList()}
          className="p-button-rounded p-button-info"
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          style={{ width: "auto" }}
        />
      </div>
    </div>
  );
}
