import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendars } from "../../../components/Calendar/Calendar";
import { validateInputText } from "../../../utils/ValidateUtil";
import { monthNamesTH, yearTH2 } from "../../../utils/DateUtil";
import { MultiSelect } from "primereact/multiselect";

export default function MSM35Search(props) {
  const optionMsSchema = [
    { label: "ทั้งหมด", value: "-1" },
    { label: "REG", value: "REG" },
    { label: "MAPDOL", value: "MAPDOL" },
    { label: "MAS", value: "MAS" },
    { label: "SVO", value: "SVO" },
    { label: "APS", value: "APS" },
  ];

  const onChangeTransferDataGroup = (e) => {
    if (e.value === null) {
      props.setSearchData({ ...props.searchData, source_schema: "-1" });
      props.onGetTransferDataGroup("");
    } else {
      props.onGetTransferDataGroup(
        e.value === "-1" ? "" : e.originalEvent.target.ariaLabel
      );
      props.setSearchData({ ...props.searchData, source_schema: e.value });
      props.setSelectTableName([]);
    }
  };

  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      {props.activeIndex !== 0 ? (
        <div
          className={`p-field p-col-12 ${
            props.activeIndex === 1 ? "p-md-6" : "p-xl-3 p-md-6"
          }`}
        >
          <label>ปี</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={props.searchData.year_start}
            options={yearTH2(
              new Date().getFullYear() + 543 - 5,
              new Date().getFullYear() + 543 + 1,
              false
            )}
            onChange={(e) =>
              props.setSearchData({ ...props.searchData, year_start: e.value })
            }
            appendTo={document.body}
          />
          {props.activeIndex === 2 &&
            parseInt(props.searchData.year_start) >=
              parseInt(props.searchData.year_end) &&
            validateInputText("year_start", "ระบุปีต้องน้อยกว่า ถึงปี")}
        </div>
      ) : (
        ""
      )}
      {props.activeIndex === 2 ? (
        <div className="p-field p-col-12 p-xl-3 p-md-6">
          <label>ถึงปี</label>
          <Dropdown
            optionLabel="label"
            optionValue="value"
            value={props.searchData.year_end}
            options={yearTH2(
              new Date().getFullYear() + 543 - 5,
              new Date().getFullYear() + 543 + 1,
              false
            )}
            onChange={(e) =>
              props.setSearchData({ ...props.searchData, year_end: e.value })
            }
            appendTo={document.body}
          />
          {props.activeIndex === 2 &&
            parseInt(props.searchData.year_end) <=
              parseInt(props.searchData.year_start) &&
            validateInputText("year_end", "ระบุถึงปีต้องน้อยกว่า ปี")}
        </div>
      ) : (
        ""
      )}
      {props.activeIndex === 0 ? (
        <div className="p-field p-col-12 p-md-6">
          <label>วันที่</label>
          <Calendars
            value={props.searchData.log_dtm}
            maxDate={new Date()}
            onChange={(e) =>
              props.setSearchData({
                ...props.searchData,
                log_dtm: e.target.value,
              })
            }
          />
        </div>
      ) : (
        ""
      )}
      {/* <div className="p-col-12 p-md-2">
                <label>Schema</label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.source_schema + ""}
                    options={optionMsSchema}
                    onChange={(e) => onChangeTransferDataGroup(e)}
                    appendTo={document.body}
                    showClear
                />
            </div> */}
      <div
        className={`"p-field p-col-12 ${
          props.activeIndex === 2 ? "p-md-12 p-xl-6" : "p-md-6"
        }`}
      >
        <label>ตารางข้อมูล</label>
        {/* <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.table_name}
                    options={props.msDataTransferGroup}
                    onChange={(e) => props.setSearchData({ ...props.searchData, table_name: e.value })}
                    appendTo={document.body}
                /> */}
        <MultiSelect
          value={props.selectTableName}
          options={props.msDataTransferGroup}
          onChange={(e) => props.setSelectTableName(e.value)}
          appendTo={document.body}
          filter
          filterBy="label"
          selectedItemsLabel={"ตารางข้อมูลที่เลือก {0} รายการ"}
          placeholder="ทั้งหมด"
          showClear
          optionValue="label"
        />
      </div>
      {props.activeIndex === 0 ? (
        <div className="p-field p-col-12">
          <Button
            className="p-button-rounded"
            type="button"
            icon="pi pi-search"
            label="ค้นหา"
            onClick={() =>
              props.onGetDataListDay(props.searchData, props.activeIndex)
            }
            style={{ width: "auto" }}
          />
        </div>
      ) : (
        <div className="p-field p-col-12">
          <Button
            disabled={
              parseInt(
                (props.activeIndex === 1 && props.searchData.year_start) >=
                  parseInt(props.searchData.year_end)
              ) ||
              (props.activeIndex === 2 &&
                parseInt(props.searchData.year_end) <=
                  parseInt(props.searchData.year_start))
            }
            className="p-button-rounded"
            type="button"
            onClick={() =>
              props.onGetDataList(props.searchData, props.activeIndex)
            }
            style={{ width: "auto" }}
            icon="pi pi-search"
            label="ค้นหา"
          />
        </div>
      )}
    </div>
  );
}
