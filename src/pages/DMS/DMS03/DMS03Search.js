import React, { useState } from "react";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

export default function DMS03Search(props) {
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
    <div className="search-container">
      <p className="p-m-0" style={{ fontSize: "18px", fontWeight: "bold" }}>
        {" "}
        ตรวจสอบการถ่ายโอนข้อมูล
      </p>
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-col-12 p-md-2">
          <label htmlFor="date1">วันที่</label>
          <Calendars
            value={props.searchData.start_date}
            onChange={(e) =>
              props.setSearchData({ ...props.searchData, start_date: e.value })
            }
            maxDate={props.searchData.end_date}
          />
        </div>
        <div className="p-col-12 p-md-2">
          <label htmlFor="date1">ถึงวันที่</label>
          <Calendars
            value={props.searchData.end_date}
            onChange={(e) =>
              props.setSearchData({ ...props.searchData, end_date: e.value })
            }
            maxDate={new Date()}
            minDate={props.searchData.start_date}
          />
        </div>

        <div className="p-col-12 p-md-3">
          <label>แหล่งข้อมูล</label>
          {/* <MultiSelect value={props.searchData.source_process} className="___full-content"
                    options={msDataSource} onChange={(e) => onInputChange1(e)}
                    maxSelectedLabels={5} selectedItemsLabel={"แหล่งข้อมูลที่เลือก" + " " + amtSelect1 + " " + "รายการ"}
                    filter={true} /> */}
          <Dropdown
            filter={true}
            optionLabel="label"
            optionValue="value"
            value={props.searchData.source_seq + ""}
            options={props.msDataSource}
            onChange={(e) =>
              props.setSearchData({
                ...props.searchData,
                source_seq: e.value === null ? "-1" : e.value,
              })
            }
            placeholder="กรุณาเลือกแหล่งข้อมูล"
            appendTo={document.body}
            showClear
          />
        </div>
        <div className="p-col-12 p-md-2">
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
        <div className="p-col-12 p-md-2">
          <label>กลุ่มตาราง</label>
          <MultiSelect
            value={props.selectedTF}
            options={props.msDataTransferGroup}
            onChange={(e) => props.setSelectedTF(e.value)}
            appendTo={document.body}
            filter
            filterBy="label"
            selectedItemsLabel={"ตารางข้อมูลที่เลือก {0} รายการ"}
            placeholder="ทั้งหมด"
            showClear
            style={{ width: "100%", height: "40px", borderRadius: "5px" }}
          />
          {/* <Dropdown
                    filter={true}
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.transfer_data_group_seq + ""}
                    options={props.msDataTransferGroup}
                    onChange={(e) => props.setSearchData({ ...props.searchData, transfer_data_group_seq: e.value === null ? "-1" : e.value })}
                    appendTo={document.body}
                    showClear
                /> */}
        </div>
        <div className="p-field p-col-12 p-md-1" style={{ marginTop: "19px" }}>
          <Button
            onClick={() => props.onGetDataList()}
            type="button"
            icon="pi pi-search"
            label="ค้นหา"
          />
        </div>
      </div>
    </div>
  );
}
