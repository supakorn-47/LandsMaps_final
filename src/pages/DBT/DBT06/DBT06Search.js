import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";

export default function DBT06Search({
  setSearchData,
  searchData,
  sourceList,
  tableList,
  onDBT06GetDataList,
}) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>วันที่</label>
        <Calendars
          maxDate={searchData.end_date}
          value={searchData.start_date}
          dateFormat={"dd/mm/yy"}
          onChange={(e) =>
            setSearchData({ ...searchData, start_date: e.target.value })
          }
          showIcon
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>ถึงวันที่</label>
        <Calendars
          maxDate={new Date()}
          minDate={searchData.start_date}
          value={searchData.end_date}
          dateFormat={"dd/mm/yy"}
          onChange={(e) =>
            setSearchData({ ...searchData, end_date: e.target.value })
          }
          showIcon
        />
      </div>

      <div className="p-field p-col-12 p-md-6">
        <label>แหล่งข้อมูล</label>
        <Dropdown
          filter={true}
          optionLabel="label"
          optionValue="value"
          options={sourceList}
          value={searchData.source_seq}
          onChange={(e) =>
            setSearchData({ ...searchData, source_seq: e.value })
          }
          appendTo={document.body}
          placeholder="กรุณาเลือกแหล่งข้อมูล"
        />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label>กลุ่มตาราง</label>
        <Dropdown
          filter={true}
          optionLabel="label"
          optionValue="value"
          value={searchData.transfer_data_group_seq + ""}
          options={tableList}
          onChange={(e) =>
            setSearchData({ ...searchData, transfer_data_group_seq: e.value })
          }
          placeholder="กรุณาเลือกกลุ่มตาราง"
          appendTo={document.body}
        />
      </div>
      <div className="p-field p-col-12" style={{ marginTop: "1rem" }}>
        <Button
          onClick={() => onDBT06GetDataList()}
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
