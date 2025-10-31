import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendars } from "../../../components/Calendar/Calendar";
import "../../../styles/global.css";

export default function LPADM01Search({
  registerType,
  registerDepartment,
  searchData,
  setSearchData,
  onSearch,
  provinceList,
}) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>วันที่</label>
        <Calendars
          maxDate={searchData.create_dtm_to}
          value={searchData.create_dtm_from}
          onChange={(e) =>
            setSearchData({ ...searchData, create_dtm_from: e.value })
          }
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>ถึงวันที่</label>
        <Calendars
          maxDate={new Date()}
          minDate={searchData.create_dtm_from}
          value={searchData.create_dtm_to}
          onChange={(e) =>
            setSearchData({ ...searchData, create_dtm_to: e.value })
          }
        />
      </div>
      {/* <div className="p-field p-col-12 p-md-6" /> */}

      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>ชื่อ-สกุล</label>
        <InputText
          value={searchData.person_fullname}
          onChange={(e) =>
            setSearchData({ ...searchData, person_fullname: e.target.value })
          }
        />
      </div>
 <div className="p-field p-col-12 p-md-6 p-xl-3">
  <label>สถานะผู้ใช้งาน</label>
  <Dropdown
    showClear
    optionLabel="label"
    optionValue="value"
    value={searchData.approve_flag}
    options={[
      { label: "ทั้งหมด", value: null },
      { label: "ไม่อนุมัติ", value: "N" },
      { label: "อนุมัติ", value: "Y" },
      { label: "รออนุมัติ", value: "P" },
    ]}
    onChange={(e) =>
      setSearchData({ ...searchData, approve_flag: e.value })
    }
    appendTo={document.body}
    placeholder="เลือกสถานะ"
  />
</div>


      <div className="p-field p-col-12" style={{ marginTop: "1rem" }}>
        <Button
          onClick={() => onSearch()}
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
