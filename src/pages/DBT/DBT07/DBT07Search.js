import React from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";
// import { InputText } from 'primereact/inputtext';

export default function DBT07Search({ searchData, setSearchData, onSearch }) {
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

      <div
        className="p-field p-col-12 p-xl-3"
        style={{ display: "flex", alignItems: "flex-end" }}
      >
        <Button
          className="p-button-rounded p-button-info"
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          style={{ width: "auto" }}
          onClick={() => onSearch()}
        />
      </div>
    </div>
  );
}
