import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendars } from "../../../components/Calendar/Calendar";

export default function DEAMOCK02Search({
  searchData,
  setSearchData,
  onSearch,
  registerType,
}) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-col-12 p-md-6">
        <label>วันเวลา</label>
        <Calendars
          value={searchData.request_dtm_from}
          dateFormat={"dd/mm/yy"}
          showIcon
          maxDate={searchData.response_dtm_to}
          onChange={(e) =>
            setSearchData({ ...searchData, request_dtm_from: e.value })
          }
        />
      </div>
      <div className="p-col-12 p-md-6">
        <label>ถึงวันเวลา</label>
        <Calendars
          value={searchData.response_dtm_to}
          dateFormat={"dd/mm/yy"}
          showIcon
          maxDate={new Date()}
          minDate={searchData.request_dtm_from}
          onChange={(e) =>
            setSearchData({ ...searchData, response_dtm_to: e.value })
          }
        />
      </div>
      {/* <div className="p-field p-col-12 p-md-3">
                <label>กลุ่มผู้ใช้งาน</label>
                <Dropdown
                    filter
                    filterBy="label"
                    optionLabel="label"
                    optionValue="value"
                    value={searchData.register_type_seq+""}
                    options={registerType}
                    onChange={(e) => setSearchData({ ...searchData, register_type_seq: e.value })}
                    placeholder="เลือกประเภทผู้ใช้งาน"
                    appendTo={document.body} />
            </div> */}
      <div className="p-col-12" style={{ marginTop: "1rem" }}>
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
