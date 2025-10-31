import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";

export default function LPSMS01Search(props) {
  const optionMsSchema = [
    { label: "ทั้งหมด", value: "-1" },
    { label: "REG", value: "REG" },
    { label: "MAPDOL", value: "MAPDOL" },
    { label: "MAS", value: "MAS" },
    { label: "SVO", value: "SVO" },
    { label: "APS", value: "APS" },
  ];

  const onChangeTransferDataGroup = (e) => {
    props.onGetTransferDataGroup(
      e.value === "-1" ? "" : e.originalEvent.target.ariaLabel
    );
    props.setSearchData({ ...props.searchData, source_schema: e.value });
    props.setSelectedTF([]);
  };

  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>วันที่</label>
        <Calendars
          showIcon
          value={props.searchData.start_date}
          maxDate={props.searchData.end_date}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              start_date: e.target.value,
            })
          }
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>ถึงวันที่</label>
        <Calendars
          showIcon
          value={props.searchData.end_date}
          maxDate={props.searchData.start_date}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              end_date: e.target.value,
            })
          }
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>แหล่งข้อมูล</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={props.searchData.source_seq + ""}
          options={props.msDataSource}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              source_seq: e.value === null ? -1 : e.value,
            })
          }
          appendTo={document.body}
          showClear={props.searchData.source_seq !== -1}
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-3">
        <label>Schema</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={props.searchData.source_schema + ""}
          options={optionMsSchema}
          onChange={(e) => onChangeTransferDataGroup(e)}
          appendTo={document.body}
        />
      </div>
      {/* <div className="p-field p-col-12 p-md-3">
                    <label>กลุ่มตาราง</label>
                    <MultiSelect
                        value={props.selectedTF}
                        options={props.msDataTransferGroup}
                        onChange={(e) => props.setSelectedTF(e.value)}
                        appendTo={document.body}
                        filter
                        filterBy='label'
                        selectedItemsLabel={"ตารางข้อมูลที่เลือก {0} รายการ"}
                        placeholder="ทั้งหมด"
                        showClear
                    />
                </div> */}
      <div className="p-field p-col-12" style={{ marginTop: "1rem" }}>
        <Button
          onClick={() => props.onGetDataList()}
          className="p-button-rounded"
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          style={{ width: "auto" }}
        />
      </div>
    </div>
  );
}
