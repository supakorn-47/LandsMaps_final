import React, { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Calendars } from "../../../components/Calendar/Calendar";

export default function MSM03Search(props) {
  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>วันเวลา Request</label>
        <Calendars
          maxDate={props.searchData.log_service_dtm_end}
          value={props.searchData.log_service_dtm_start}
          dateFormat={"dd/mm/yy"}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              log_service_dtm_start: e.target.value,
            })
          }
          showTime
          showIcon
        />
      </div>

      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>ถึงวันเวลา Request</label>
        <Calendars
          maxDate={new Date()}
          minDate={props.searchData.log_service_dtm_start}
          value={props.searchData.log_service_dtm_end}
          dateFormat={"dd/mm/yy"}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              log_service_dtm_end: e.target.value,
            })
          }
          showTime
          showIcon
        />
      </div>

      {/* <div className="p-field p-col-12 p-md-3">
                <label>
                    หน่วยงาน<span style={{ color: "red" }}>*</span>
                </label>
                <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={props.searchData.department_seq + ""}
                    options={props.optionDepartment}
                    onChange={(e) =>
                        props.setSearchData({
                            ...props.searchData,
                            department_seq: e.value,
                            department_name: e.originalEvent.target.ariaLabel,
                        })
                    }
                    appendTo={document.body}
                />
            </div> */}

      <div class="p-field p-col-12 p-xl-6">
        <label>รายละเอียด</label>
        <InputText
          value={props.searchData.log_desc}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              log_desc: e.target.value,
            })
          }
          placeholder="รายละเอียด"
        />
      </div>
      {/* <div className="p-field p-col-12 p-md-3">
                <label>เลขประจำตัวประชาชน</label>
                <InputMask
                    value={props.searchData.personal_id}
                    onChange={(e) =>
                        props.setSearchData({
                            ...props.searchData,
                            personal_id: e.target.value,
                        })
                    }
                    mask="9-9999-99999-99-9"
                />
            </div> */}
      <div class="p-field p-col-12 p-lg-6">
        <label>ชื่อ</label>
        <InputText
          value={props.searchData.personal_fnameth}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              personal_fnameth: e.target.value,
            })
          }
          placeholder="ชื่อ"
        />
      </div>

      <div class="p-field p-col-12 p-lg-6">
        <label>นามสกุล</label>
        <InputText
          value={props.searchData.personal_lnameth}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              personal_lnameth: e.target.value,
            })
          }
          placeholder="นามสกุล"
        />
      </div>

      <div className="p-field p-col-12" style={{ marginTop: "1rem" }}>
        <Button
          onClick={() => props.onGetDataList()}
          className="p-button p-button-rounded p-button-info"
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          style={{ width: "auto" }}
        />
      </div>
    </div>
  );
}
