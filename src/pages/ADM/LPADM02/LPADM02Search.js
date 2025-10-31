import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Calendars } from "../../../components/Calendar/Calendar";
import { InputText } from "primereact/inputtext";

export default function LPADM02Search(props) {
  const provinces = [
    { label: "กรุงเทพมหานคร", value: "10" },
    { label: "กระบี่", value: "81" },
    { label: "กาญจนบุรี", value: "71" },
    { label: "กาฬสินธุ์", value: "46" },
    { label: "กำแพงเพชร", value: "62" },
    { label: "ขอนแก่น", value: "40" },
    { label: "จันทบุรี", value: "22" },
    { label: "ฉะเชิงเทรา", value: "24" },
    { label: "ชลบุรี", value: "20" },
    { label: "ชัยนาท", value: "18" },
    { label: "ชัยภูมิ", value: "36" },
    { label: "ชุมพร", value: "86" },
    { label: "เชียงราย", value: "57" },
    { label: "เชียงใหม่", value: "50" },
    { label: "ตรัง", value: "92" },
    { label: "ตราด", value: "23" },
    { label: "ตาก", value: "63" },
    { label: "นครนายก", value: "26" },
    { label: "นครปฐม", value: "73" },
    { label: "นครพนม", value: "48" },
    { label: "นครราชสีมา", value: "30" },
    { label: "นครศรีธรรมราช", value: "80" },
    { label: "นครสวรรค์", value: "60" },
    { label: "นนทบุรี", value: "12" },
    { label: "นราธิวาส", value: "96" },
    { label: "น่าน", value: "55" },
    { label: "บุรีรัมย์", value: "31" },
    { label: "ปทุมธานี", value: "13" },
    { label: "ประจวบคีรีขันธ์", value: "77" },
    { label: "ปราจีนบุรี", value: "25" },
    { label: "ปัตตานี", value: "94" },
    { label: "พระนครศรีอยุธยา", value: "14" },
    { label: "พังงา", value: "82" },
    { label: "พัทลุง", value: "93" },
    { label: "พิจิตร", value: "66" },
    { label: "พิษณุโลก", value: "65" },
    { label: "เพชรบุรี", value: "76" },
    { label: "เพชรบูรณ์", value: "67" },
    { label: "แพร่", value: "54" },
    { label: "ภูเก็ต", value: "83" },
    { label: "มหาสารคาม", value: "44" },
    { label: "มุกดาหาร", value: "49" },
    { label: "แม่ฮ่องสอน", value: "58" },
    { label: "ยโสธร", value: "35" },
    { label: "ยะลา", value: "95" },
    { label: "ร้อยเอ็ด", value: "45" },
    { label: "ระนอง", value: "85" },
    { label: "ระยอง", value: "21" },
    { label: "ราชบุรี", value: "70" },
    { label: "ลพบุรี", value: "16" },
    { label: "ลำปาง", value: "52" },
    { label: "ลำพูน", value: "51" },
    { label: "เลย", value: "42" },
    { label: "ศรีสะเกษ", value: "33" },
    { label: "สกลนคร", value: "47" },
    { label: "สงขลา", value: "90" },
    { label: "สตูล", value: "91" },
    { label: "สมุทรปราการ", value: "11" },
    { label: "สมุทรสงคราม", value: "75" },
    { label: "สมุทรสาคร", value: "74" },
    { label: "สระแก้ว", value: "27" },
    { label: "สระบุรี", value: "19" },
    { label: "สิงห์บุรี", value: "17" },
    { label: "สุโขทัย", value: "64" },
    { label: "สุพรรณบุรี", value: "72" },
    { label: "สุราษฎร์ธานี", value: "84" },
    { label: "สุรินทร์", value: "32" },
    { label: "หนองคาย", value: "43" },
    { label: "หนองบัวลำภู", value: "39" },
    { label: "อ่างทอง", value: "15" },
    { label: "อำนาจเจริญ", value: "37" },
    { label: "อุดรธานี", value: "41" },
    { label: "อุตรดิตถ์", value: "53" },
    { label: "อุทัยธานี", value: "61" },
    { label: "อุบลราชธานี", value: "34" },
  ];
  const source_seq = [
    { label: "จนท.สำนักงานที่ดิน", value: 1 },
    { label: "ลงทะเบียน OpenID ประชาชนทั่วไป", value: 2 },
    { label: "ผู้ดูแลระบบส่วนกลาง", value: 3 },
    { label: "ลงทะเบียน ThaiD ประชาชนทั่วไป", value: 4 },
    { label: "ผู้ดูแลระบบ(อปท.)", value: 5 },
    { label: "ผู้ตรวจตรวจกรมที่ดิน", value: 6 },
    { label: "หน่วยงานถายนอก", value: 7 },
    { label: "องค์กรปกครองส่วนท้องถิ่น", value: 8 },
    { label: "เจ้าหน้าที่กรมที่ดิน", value: 9 },
    { label: "ผู้ตรวจกรมที่ดิน", value: 10 },
    { label: "เจ้าหน้าที่กรมที่ดิน", value: 11 },
    { label: "หน่วยงานภายนอก", value: 12 },
    { label: "ลงทะเบียน OpenID ประชาชนทั่วไป", value: 13 },
  ];

  const optionRegisterType =[
    {label: "กรุงเทพมหานคร", value: "1"},
    {label: "กรมธนารักษ์", value: "2"},
    {label: "กรมที่ดิน", value: "3"},
    {label: "กรมส่งเสริมการปกครองท้องถิ่น(สถ.)", value: "4"},
    {label: "กองบัญชาการตำรวจสอบสวนกลาง", value: "5"},
    {label: "กรมที่ดิน(พัฒ 2)", value: "6"},
    {label: "สัำนักงานเศรษฐกิจการคลัง", value: "7"},
    {label: "บริษัทซีเอสไอ โปรเฟสชั่นนอล จำกัด(eService)", value: "8"},
    {label: "กรมบังคับคดี", value: "9"},
    {label: "การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย EGAT", value: "10"},
    {label: "สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)", value: "11"},
    {label: "กิจการค้าร่วม ไอเอฟพี เคจี", value: "12"},
    {label: "สำนักงานคณะกรรมการการป้องกันและปราบปรามยาเสพติด(ป.ป.ส.)", value: "13"},
    {label: "สำนักงานคณะกรรมการป้องกัน และปราบปรามการทุจริตแห่งชาติ(ป.ป.ช)", value: "14"},
    {label: "กรมสรรพากร", value: "15"},
    {label: "กรมศุ", value: "16"},
    {label: "กรมบัญชีกลาง", value: "17"},

  ]

  
const [searchData, setSearchData] = useState({
  source_seq: -1,
  province_seq: -1,
  register_type_seq: -1,
});

  const onChangeTransferDataGroup = (e) => {
    props.onGetTransferDataGroup(
      e.value === "-1" ? "" : e.originalEvent.target.ariaLabel
    );
    props.setSearchData({ ...props.searchData, source_schema: e.value });
    props.setSelectedTF([]);
  };
const onSearch = () => {
  props.setSearchData({
    ...props.searchData,
    person_fullname: searchData.person_fullname
  });
  props.onGetDataList(); // เรียกฟังก์ชันค้นหาที่ parent ส่งมา
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

      <div className="p-field p-col-12 p-md-6 p-xl-6">
        <label>ชื่อ-สกุล</label>
        <InputText
          value={searchData.person_fullname}
          onChange={(e) =>
            setSearchData({ ...searchData, person_fullname: e.target.value })
          }
        />
      </div>

    <div className="p-field p-col-12 p-md-6 p-xl-4">
  <label>กลุ่มผู้ใช้งาน</label>
  <Dropdown
    optionLabel="label"
    optionValue="value"
    value={props.searchData.source_seq}
    options={source_seq} // หรือ props.msDataSource ถ้ามีส่งมาจาก props
    onChange={(e) =>
      props.setSearchData({
        ...props.searchData,
        source_seq: Number(e.value),   // ✅ บังคับให้เป็น number
      })
    }
    placeholder="ทั้งหมด"
    filter
    appendTo={document.body}
    showClear={props.searchData.source_seq !== -1}
  />
</div>


      <div className="p-field p-col-12 p-md-6 p-xl-4">
        <label>จังหวัด</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={props.searchData.province_seq + ""}
          options={provinces}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
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
        <label> หน่วยงาน</label>
        <Dropdown
          optionLabel="label"
          optionValue="value"
          value={props.searchData.optionRegisterType + ""}
          options={optionRegisterType}
          onChange={(e) =>
            props.setSearchData({
              ...props.searchData,
              source_seq: e.value === null ? -1 : e.value,
            })
          }
          appendTo={document.body}
          showClear={props.searchData.optionRegisterType !== -1}
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
