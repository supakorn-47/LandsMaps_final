import React, { useState, useEffect } from "react";
import DEAMOCK02Search from "./DEAMOCK02Search";
import { Loading } from "../../../components/Loading/Loading";
import { Toast } from "primereact/toast";
import PageHeader from "../../../components/PageHeader/PageHeader";
import CustomCard from "../../../components/CustomCard/CustomCard";
import { TabView, TabPanel } from "primereact/tabview";
import DEAMOCK02SUMMARYCARD from "./DEAMOCK02SUMMARYCARD";
import { RequestStatusAnalysis } from "./RequestStatusAnalysis";
import DataUsageByAgencyChart from "./DataUsageByAgencyChart";
import { AgencyPieChart } from "./AgencyPieChart";
import { Dropdown } from "primereact/dropdown";

// import SummaryCard from "./SummaryCard";
import rawData from "./data.json";
import { ServiceUsageChart } from "./ServiceUsageChart";
export default function DEAMOCK02() {
  const [loading, setLoading] = useState(false);
  // const [searchData, setSearchData] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState({
    request_dtm_from: new Date(),
    response_dtm_to: new Date(),
  });
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [filteredDataByAgency, setFilteredDataByAgency] = useState([]);
  const prepareDataFilter = rawData?.map((item) => item.agency);
  const agencyData = [
    { label: "ทั้งหมด", value: null }, // เพิ่ม option "ทั้งหมด"
    ...[...new Set(prepareDataFilter)].map((a) => ({
      label: a,
      value: a,
    })),
  ];
  const [filteredData, setFilteredData] = useState([]);

  const onSearch = () => {
    const from = new Date(selectedDate.request_dtm_from);
    from.setHours(0, 0, 0, 0);

    const to = new Date(selectedDate.response_dtm_to);
    to.setHours(23, 59, 59, 999);

    // แปลงเป็น string ในรูปแบบ "YYYY-MM-DD"
    const fromStr = from.toISOString().slice(0, 10);
    const toStr = to.toISOString().slice(0, 10);

    const filtered = rawData.filter((item) => {
      const itemDateStr = item.date; // already "YYYY-MM-DD"
      return itemDateStr >= fromStr && itemDateStr <= toStr;
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (selectedAgency) {
      const filteredByAgency = filteredData.filter(
        (item) => item.agency === selectedAgency
      );
      setFilteredDataByAgency(filteredByAgency);
    } else {
      // selectedAgency เป็น null = แสดงทั้งหมด
      setFilteredDataByAgency(filteredData);
    }
  }, [filteredData, selectedAgency]);
  // useEffect(() => {
  //   setSearchData(agencyData);
  // }, [agencyData]);
  useEffect(() => {
    onSearch(); // เรียกกรองข้อมูลด้วยวันที่ปัจจุบัน
  }, []);
  return (
    <div className="page-wrapper">
      {/* <Loading loading={loading} />
      <Toast ref={toast} position="top-right" /> */}
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ตรวจสอบประวัติแลกเปลี่ยนข้อมูล",
            }}
          />
        }
        body={
          <DEAMOCK02Search
            searchData={selectedDate}
            setSearchData={setSelectedDate}
            onSearch={onSearch}
          />
        }
        // title={
        //   <PageHeader
        //     config={{
        //       title: "ตรวจสอบประวัติแลกเปลี่ยนข้อมูล",
        //     }}
        //   />
        // }
      />
      <CustomCard>
        <DEAMOCK02SUMMARYCARD filteredData={filteredData} />
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          style={{ padding: "0px 16px" }}
        >
          <TabPanel header="ปริมาณการใช้งานระบบ">
            <DataUsageByAgencyChart filteredData={filteredData} />
          </TabPanel>
          <TabPanel header="อัตราการเรียกใช้งานระบบแยกตามหน่วยงาน">
            <AgencyPieChart filteredData={filteredData} />
          </TabPanel>
          <TabPanel header="สถิติสถานะการรร้องขอการแลกเปลี่ยนข้อมูล">
            <RequestStatusAnalysis filteredData={filteredData} />
          </TabPanel>
          <TabPanel header="สรุปปริมาณข้อมูลที่ใช้ตามรายการบริการ">
            <div className="p-field p-col-12 p-md-3">
              <Dropdown
                filter
                filterBy="label"
                optionLabel="label"
                optionValue="value"
                value={selectedAgency}
                options={agencyData}
                onChange={(e) => setSelectedAgency(e.value)}
                placeholder="เลือกประเภทผู้ใช้งาน"
                appendTo={document.body}
              />
            </div>
            <ServiceUsageChart filteredData={filteredDataByAgency} />
          </TabPanel>
        </TabView>

        {/* <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="Overview">Ab</TabPanel>

          <TabPanel header="ตารางประวัติการใช้งาน">Abc</TabPanel>
        </TabView> */}
      </CustomCard>
      {/* <DEAMOCK02Search />; */}
    </div>
  );
}
