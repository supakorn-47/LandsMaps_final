import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { masterService } from "../../../service/ServiceMaster/MasterService";

// Mock ข้อมูล Dropdown
const provinceListMock = [
  { value: "10", label: "กรุงเทพมหานคร" },
  { value: "20", label: "เชียงใหม่" },
  { value: "30", label: "ขอนแก่น" },
];

const amphurListMock = {
  10: [
    { value: "1001", label: "เขตพระนคร" },
    { value: "1002", label: "เขตดุสิต" },
  ],
  20: [
    { value: "2001", label: "อำเภอเมืองเชียงใหม่" },
    { value: "2002", label: "อำเภอสารภี" },
  ],
  30: [
    { value: "3001", label: "อำเภอเมืองขอนแก่น" },
    { value: "3002", label: "อำเภอชนบท" },
  ],
};

const tambolListMock = {
  1001: [
    { value: "100101", label: "พระบรมมหาราชวัง" },
    { value: "100102", label: "วัดราชบพิธ" },
  ],
  2001: [
    { value: "200101", label: "ช้างเผือก" },
    { value: "200102", label: "หายยา" },
  ],
  3001: [
    { value: "300101", label: "ในเมือง" },
    { value: "300102", label: "ศิลา" },
  ],
};
export default function ADM16Search(props) {
  const [amphurList, setAmphurList] = useState([]);
  const [tambolList, setTambolList] = useState([]);
  useEffect(() => {
    if (props.mock && props.provinceListMock) {
      props.provinceListMock(provinceListMock);
    }
    if (props.mock && props.amphurListMock) {
      props.amphurListMock(amphurListMock);
    }
    if (props.mock && props.tambolListMock) {
      props.tambolListMock(tambolListMock);
    }
  }, []);
  const consentFlagList = [
    {
      value: "-1",
      label: "กรุณาเลือก",
    },
    {
      value: "0",
      label: "ไม่ยินยอม",
    },
    {
      value: "1",
      label: "ยินยอม",
    },
    {
      value: "2",
      label: "อยู่ระหว่างประสาน",
    },
  ];

  const onProvinceChange = (province_id) => {
    if (props.mock) {
      props.setSearchData({
        ...props.searchData,
        province_id: province_id,
        amcode: "0",
        tamcode: "0",
      });

      // mock data
      setAmphurList(amphurListMock[province_id] || []);
      setTambolList([]);
    } else {
      props.setSearchData({
        ...props.searchData,
        province_id: province_id,
        amcode: "0",
      });
      masterService("GetAmphoe/" + province_id, {}, "GET").then(
        (res) => {
          setAmphurList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );
    }
  };

  const onAmphurChange = (amphur_id) => {
    if (props.mock) {
      props.setSearchData({
        ...props.searchData,
        amcode: amphur_id,
        tamcode: "0",
      });
      // mock data
      setTambolList(tambolListMock[amphur_id] || []);
    } else {
      props.setSearchData({
        ...props.searchData,
        amcode: amphur_id,
        tamcode: "0",
      });
      masterService(
        "GetTambol/" + props.searchData.province_id + "/" + amphur_id,
        {},
        "GET"
      ).then(
        (res) => {
          setTambolList(res.result);
        },
        function (err) {
          console.log("err", err);
        }
      );
    }
  };

  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>
          จังหวัด<span style={{ color: "red" }}>*</span>
        </label>
        <Dropdown
          filter
          filterBy="label"
          optionLabel="label"
          optionValue="value"
          value={props.searchData.province_id}
          options={props.mock ? provinceListMock : props.provinceList}
          onChange={(e) => onProvinceChange(e.value)}
          placeholder="เลือกจังหวัด"
        />
      </div>
      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>อำเภอ</label>
        <Dropdown
          filter
          filterBy="label"
          optionLabel="label"
          optionValue="value"
          value={props.searchData.amcode}
          options={amphurList}
          onChange={(e) => onAmphurChange(e.value)}
          placeholder="เลือกอำเภอ"
        />
      </div>
      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>ตำบล</label>
        <Dropdown
          filter
          filterBy="label"
          optionLabel="label"
          optionValue="value"
          value={props.searchData.tamcode}
          options={tambolList}
          onChange={(e) =>
            props.setSearchData({ ...props.searchData, tamcode: e.value })
          }
          placeholder="เลือกตำบล"
        />
      </div>
      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>สถานะ</label>
        <Dropdown
          filter
          filterBy="label"
          optionLabel="label"
          optionValue="value"
          value={props.searchData.consent_flag}
          options={consentFlagList}
          onChange={(e) =>
            props.setSearchData({ ...props.searchData, consent_flag: e.value })
          }
          placeholder="เลือกสถานะ"
        />
      </div>
      <div class="p-field p-col-12 p-md-6 p-xl-3">
        <label>ชื่อ อปท.</label>
        <InputText
          value={props.searchData.opt_name}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              opt_name: e.target.value,
            })
          }
        />
      </div>
      <div className="p-field p-col-12 p-md-1" style={{ marginTop: "2rem" }}>
        <Button
          onClick={() => props.onSearch()}
          className="p-button-rounded p-button-info"
          type="button"
          icon="pi pi-search"
          label="ค้นหา"
          style={{ height: "38px" }}
        />
      </div>
    </div>
  );
}
