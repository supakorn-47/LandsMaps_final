import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";
import { InputText } from "primereact/inputtext";

export default function LPADM02Search(props) {
  const {
    searchData,
    setSearchData,
    onGetDataList,
    msUserGroups = [],
    msProvinces = [],
    registerDepartment = [],
  } = props;

  const [localState, setLocalState] = useState({ person_fullname: "" });

  const deptOptions = (registerDepartment || []).map((x) => ({
    label:
      x.label ||
      x.department_name_th ||
      x.department_name ||
      `หน่วยงาน ${x.department_seq || x.value || ""}`,
    value: String(x.value ?? x.department_seq ?? ""),
  }));

  const onSearch = () => {
    setSearchData({
      ...searchData,
      person_fullname: localState.person_fullname,
    });
    onGetDataList();
  };

  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>วันที่</label>
        <Calendars
          showIcon
          value={searchData.create_dtm_from || null}
          maxDate={searchData.create_dtm_to || null}
          onChange={(e) =>
            setSearchData({
              ...searchData,
              create_dtm_from: e.value,
            })
          }
        />
      </div>

      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>ถึงวันที่</label>
        <Calendars
          showIcon
          value={searchData.create_dtm_to || null}
          minDate={searchData.create_dtm_from || null}
          onChange={(e) =>
            setSearchData({
              ...searchData,
              create_dtm_to: e.value,
            })
          }
        />
      </div>

      <div className="p-field p-col-12 p-md-6 p-xl-6">
        <label>ชื่อ-สกุล</label>
        <InputText
          value={localState.person_fullname}
          onChange={(e) =>
            setLocalState({ ...localState, person_fullname: e.target.value })
          }
        />
      </div>

      <div className="p-field p-col-12 p-md-6 p-xl-4">
        <label>กลุ่มผู้ใช้งาน</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={String(searchData.source_seq ?? "-1")}
          options={msUserGroups}
          onChange={(e) =>
            setSearchData({
              ...searchData,
              source_seq: e.value === null ? -1 : e.value,
            })
          }
          placeholder="ทั้งหมด"
          filter
          showClear={searchData.source_seq !== -1}
          appendTo={document.body}
        />
      </div>

      <div className="p-field p-col-12 p-md-6 p-xl-4">
        <label>จังหวัด</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={String(searchData.province_seq ?? "-1")}
          options={msProvinces}
          onChange={(e) =>
            setSearchData({
              ...searchData,
              province_seq: e.value,
            })
          }
          placeholder="-กรุณาเลือก-"
          filter
          showClear
          appendTo={document.body}
        />
      </div>

      <div className="p-field p-col-12 p-md-6 p-xl-4">
        <label>หน่วยงาน</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={String(searchData.department_seq ?? "")}
          options={registerDepartment || []}
          onChange={(e) =>
            setSearchData({ ...searchData, department_seq: e.value })
          }
          placeholder="ทั้งหมด"
          filter
          showClear
          appendTo={document.body}
        />
      </div>

      {/* 🔹 ปุ่มค้นหา — แยกบรรทัดใหม่ให้อยู่ใต้หน่วยงาน */}
      <div
        className="p-field p-col-12"
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
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
