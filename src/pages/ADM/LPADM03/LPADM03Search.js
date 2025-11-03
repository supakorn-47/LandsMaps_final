import React, { useState } from "react";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";

var d = new Date();
d.setFullYear(2564);

export default function LPADM03npSearch({ searchData, setSearchData, onSearch }) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6">
        <label>วันที่ประกาศ</label>
        <Calendars
          maxDate={searchData.otp_dtm_from}
          value={searchData.otp_dtm_fro?? new Date()}
          dateFormat={"dd/mm/yy"}
          showIcon
          onChange={(e) =>
            setSearchData({ ...searchData, otp_dtm_from: e.value })
          }
        />
      </div>
      <div className="p-field p-col-12 p-md-6">
        <label>ถึงวันที่ประกาศ</label>
        <Calendars
          maxDate={new Date()}
          minDate={searchData.otp_dtm_from}
          value={searchData.otp_dtm_to?? new Date()}
          dateFormat={"dd/mm/yy"}
          showIcon
          onChange={(e) =>
            setSearchData({ ...searchData, otp_dtm_to: e.value })
          }
        />
        
      </div>
      <div className="p-field p-col-12" style={{ marginTop: "1rem" }}>
        <Button
          className="p-button-rounded p-button-info"
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          onClick={() => onSearch()}
          style={{ width: "auto" }}
        />
      </div>
    </div>
  );
}
