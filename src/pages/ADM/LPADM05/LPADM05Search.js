// src/pages/ADM/LPADM05/LPADM05Search.jsx
import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendars } from "../../../components/Calendar/Calendar";

export default function LPADM05Search({
  searchData,
  setSearchData,
  onSearch,
  registerType,
  departments,
}) {
  const pickVal = (e) => e?.value ?? e?.target?.value ?? null;

  return (
    
      <div className="p-fluid p-formgrid p-grid search-wrapper">
        <div className="p-field p-col-12 p-md-6">
          <label>วันเวลา</label>
          <Calendars
            value={searchData.request_dtm_from}
            dateFormat="dd/mm/yy"
            showIcon
            maxDate={searchData.response_dtm_to}
            onChange={(e) =>
              setSearchData({ ...searchData, request_dtm_from: pickVal(e) })
            }
          />
        </div>

        <div className="p-field p-col-12 p-md-6">
          <label>ถึงวันเวลา</label>
          <Calendars
            value={searchData.response_dtm_to}
            dateFormat="dd/mm/yy"
            showIcon
            maxDate={new Date()}
            minDate={searchData.request_dtm_from}
            onChange={(e) =>
              setSearchData({ ...searchData, response_dtm_to: pickVal(e) })
            }
          />
        </div>

        <div className="p-col-12" style={{ marginTop: "1rem" }}>
          <Button
            className="p-button-rounded p-button-info"
            type="button"
            icon="pi pi-search"
            label="ค้นหา"
            onClick={onSearch}
            style={{ width: "auto" }}
          />
        </div>
        
      </div>
  );
}
