import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";

export default function ADM02Search(props) {
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
      <div className="p-field p-col-12 p-md-6 p-xl-4">
        <label>แหล่งข้อมูล</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={props.searchData.source_seq + ""}
          options={props.msDataSource}
          onChange={(e) =>
            props.setSearchData({ ...props.searchData, source_seq: e.value })
          }
          placeholder="กรุณาเลือกแหล่งข้อมูล"
          appendTo={document.body}
        />
      </div>
      <div className="p-field p-col-12 p-md-6 p-xl-4">
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

      <div
        className="p-field p-col-12 p-xl-3"
        style={{ display: "flex", alignItems: "flex-end" }}
      >
        <Button
          onClick={() => props.onDMS02GetDataList()}
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          style={{ width: "auto" }}
        />
      </div>
    </div>
  );
}
