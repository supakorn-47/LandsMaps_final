import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendars } from "../../../components/Calendar/Calendar";

var d = new Date();
export default function DBT05Search({
  setSearchData,
  searchData,
  onDBT05GetDataList,
}) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label htmlFor="date1">วันที่</label>
        <Calendars
          value={searchData.start_date}
          onChange={(e) =>
            setSearchData({ ...searchData, start_date: e.value })
          }
          maxDate={searchData.end_date}
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label htmlFor="date1">ถึงวันที่</label>
        <Calendars
          value={searchData.end_date}
          onChange={(e) => setSearchData({ ...searchData, end_date: e.value })}
          maxDate={new Date()}
          minDate={searchData.start_date}
        />
      </div>
      <div
        className="p-field p-col-12 p-xl-3"
        style={{ display: "flex", alignItems: "flex-end" }}
      >
        <Button
          onClick={() => onDBT05GetDataList()}
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
