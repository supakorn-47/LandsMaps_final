import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";

export default function LPSMS03Search({
  startDate,
  endDate,
  setSearchData,
  onSearch,
}) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>วันที่</label>
        <Calendars
          showIcon
          value={startDate}
          maxDate={endDate}
          onChange={(e) =>
            setSearchData({
              startDate: e.target.value,
            })
          }
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>ถึงวันที่</label>
        <Calendars
          showIcon
          value={endDate}
          maxDate={startDate}
          onChange={(e) =>
            setSearchData({
              endDate: e.target.value,
            })
          }
        />
      </div>
      <div
        className="p-field p-col-12 p-xl-3"
        style={{ display: "flex", alignItems: "flex-end" }}
      >
        <Button
          onClick={() => onSearch}
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
