import React, { useState, useEffect, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Slider } from "primereact/slider";
import { ADM03GetDataList } from "../../../service/ServiceADM/ServiceADM03";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

const ADM05Card = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const toast = useRef(null);

  const products1 = [
    { name: "ข้อมูลรูปแปลงที่ดิน WMS", rate: 5, initialUsage: 1000 },
    // { name: "ข้อมูลผังเมือง WMS", rate: 5, initialUsage: 1000 },
  ];

  // const products2 = [
  //   { name: "ข้อมูลรายชื่อสำนักงานที่ดิน API", rate: 7, initialUsage: 3000 },
  //   {
  //     name: "ข้อมูลเอกสารสิทธิที่ดิน , ข้อมูลผู้ถือกรรมสิทธิ์ (โฉนดที่ดิน) API",
  //     rate: 7,
  //     initialUsage: 3000,
  //   },
  //   {
  //     name: "ข้อมูลเอกสารสิทธิที่ดิน , ข้อมูลผู้ถือกรรมสิทธิ์ (น.ส.3ก) API",
  //     rate: 7,
  //     initialUsage: 3000,
  //   },
  //   {
  //     name: "ข้อมูลเอกสารสิทธิที่ดิน (อ.ช.2) และข้อมูลผู้ถือกรรมสิทธิ์ API",
  //     rate: 7,
  //     initialUsage: 3000,
  //   },
  //   { name: "ข้อมูลราคาประเมิน (โฉนดที่ดิน) API", rate: 7, initialUsage: 3000 },
  //   { name: "ข้อมูลราคาประเมิน (น.ส.3ก) API", rate: 7, initialUsage: 3000 },
  //   { name: "ข้อมูลราคาประเมิน (อ.ช.2) API", rate: 7, initialUsage: 3000 },
  //   {
  //     name: "ข้อมูลราคาประเมิน (สิ่งปลูกสร้าง) API",
  //     rate: 7,
  //     initialUsage: 3000,
  //   },
  //   { name: "ข้อมูลเอกสารสิทธิที่ดิน", rate: 7, initialUsage: 3000 },
  // ];

  const rate = 5;
  const initialUsage = 3000;
  const [usageData1, setUsageData1] = useState(
    products1.map((p) => ({
      ...p,
      usage: p.initialUsage,
      cost: (p.initialUsage * p.rate).toFixed(2),
      rate: rate,
    }))
  );

  const [usageServiceData, setUsageServiceData] = useState(
    dataTable.map((p) => ({
      ...p,
      usage: p.initialUsage,
      cost: (p.initialUsage * p.rate).toFixed(2),
      rate: rate,
    }))
  );

  const handleSliderChange = (index, value, dataset, setDataset) => {
    const updated = [...dataset];
    updated[index].usage = value;
    updated[index].cost = (value * updated[index].rate).toFixed(2);
    setDataset(updated);
  };

  const renderTable = (data, setData) => (
    <div
      style={{
        maxHeight: "50vh",
        overflowY: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#eaf0fe",
                textAlign: "center",
                padding: "10px",
                border: "1px solid #ccc",
                position: "sticky",
                top: 0,
                zIndex: 100,
              }}
            >
              ข้อมูล
            </th>
            <th
              style={{
                backgroundColor: "#eaf0fe",
                textAlign: "center",
                padding: "10px",
                border: "1px solid #ccc",
                position: "sticky",
                top: 0,
                zIndex: 100,
              }}
            >
              การใช้งาน
            </th>
            <th
              style={{
                backgroundColor: "#2e68cb",
                color: "white",
                textAlign: "center",
                padding: "10px",
                border: "1px solid #ccc",
                position: "sticky",
                top: 0,
                zIndex: 100,
              }}
            >
              ราคา/เดือน (บาท)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.name}>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>
                {row.name}
              </td>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Slider
                    value={row.usage}
                    onChange={(e) =>
                      handleSliderChange(index, e.value, data, setData)
                    }
                    min={0}
                    max={1000000}
                    style={{
                      width: "200px",
                      marginRight: "1rem",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                    }}
                  />
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    {row.usage.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <InputText
                    // onChange={(e) => row.rate = e.value}
                    value={Number(row.rate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                    style={{ width: "50px" }}
                  />{" "}
                  / Request
                </div>
              </td>
              <td
                style={{
                  backgroundColor: "#2e68cb",
                  color: "white",
                  textAlign: "center",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              >
                {Number(row.cost).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const onADM03GetDataList = () => {
    setLoading(true);
    ADM03GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              index: index,
              rate: rate,
            });
            index++;
          });
          setDataTable(temp);
          setUsageServiceData(
            temp.map(({ service_name, ...data }) => ({
              ...data,
              name: service_name,
              usage: initialUsage,
              cost: (initialUsage * rate).toFixed(2),
            }))
          );
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.errors.message
          );
        }
      },
      function (err) {
        setLoading(false);
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }
        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  useEffect(() => {
    if (activeIndex === 1) onADM03GetDataList();
  }, [activeIndex]);

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel
          header="ข้อมูลรูปแปลง"
          style={{
            backgroundColor: "#f9fbff",
            color: "#333",
          }}
          className="no-tab-outline"
        >
          {renderTable(usageData1, setUsageData1)}
        </TabPanel>
        <TabPanel
          header="ข้อมูลทะเบียน"
          className="no-tab-outline"
          style={{
            backgroundColor: "#f9fbff",
            color: "#333",
          }}
        >
          {renderTable(usageServiceData, setUsageServiceData)}
        </TabPanel>
      </TabView>
    </>
  );
};

export default ADM05Card;
