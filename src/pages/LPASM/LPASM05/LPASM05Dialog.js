import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { Slider } from "primereact/slider";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";

export default function LPASM05Dialog({
  serviceRatesData,
  onSubmit,
  openDialog,
  setOpenDialog,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [spatialServiceRate, setSpatialServiceRate] = useState([]);
  const [restServiceRate, setRestServiceRate] = useState([]);

  // change service_request_qty
  const handleSliderChange = (itemIdx, value, data, setData) => {
    let updatedData = [...data];
    let updatedRate = updatedData[itemIdx];

    updatedData.splice(itemIdx, 1, {
      ...updatedRate,
      service_request_qty: value || 0,
      sum_service_rate_amt: (value || 0) * updatedRate.service_rate_amt,
    });

    // console.log("handleSliderChange", updatedData.length);
    setData(updatedData);
  };

  // change service_rate_amt
  const handleInputChange = (itemIdx, value, data, setData) => {
    let updatedData = [...data];
    let updatedRate = updatedData[itemIdx];
    updatedData.splice(itemIdx, 1, {
      ...updatedRate,
      service_rate_amt: value || 0,
      sum_service_rate_amt: (value || 0) * updatedRate.service_request_qty,
    });

    // console.log("handleInputChange", updatedData.length);

    setData(updatedData);
  };

  const renderServiceRatesTable = (data, setData) => (
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
              ปริมาณการใช้งาน
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
              ราคาต่อหน่วยการใช้งาน
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
          {data.map(
            (
              {
                service_name,
                service_rate_amt,
                service_request_qty,
                sum_service_rate_amt,
                service_request_maxqty,
              },
              index
            ) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #eee",
                    width: 300,
                  }}
                >
                  {service_name}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #eee",
                    width: 200,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <InputNumber
                      value={service_request_qty || 0}
                      onChange={(e) =>
                        handleSliderChange(index, e.value, data, setData)
                      }
                      min={0}
                      max={service_request_maxqty || 10000000}
                      step={1000}
                    />
                    <span>
                      {service_request_maxqty > 1 ? "Requests" : "Request"}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #eee",
                    width: 200,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <InputNumber
                      value={service_rate_amt || 0}
                      onValueChange={(e) =>
                        handleInputChange(index, e.value, data, setData)
                      }
                      mode="decimal"
                      minFractionDigits={2}
                      maxFractionDigits={2}
                      style={{ width: "64px" }}
                    />
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
                  {Number(sum_service_rate_amt || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDialogFooter = () => {
    return (
      <div className="dialog-footer-action-right">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setOpenDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          onClick={() => onSubmit([...spatialServiceRate, ...restServiceRate])}
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  useEffect(() => {
    if (openDialog) {
      setRestServiceRate(
        serviceRatesData.filter(
          ({ service_type }) => service_type === "REST"
        ) || []
      );
      setSpatialServiceRate(
        serviceRatesData.filter(
          ({ service_type }) => service_type === "SPATIAL"
        ) || []
      );
    }

    return () => {
      setActiveIndex(0);
    };
  }, [openDialog]);

  return (
    <Dialog
      header="แก้ไขอัตราค่าตั้งต้นของการใช้บริการ"
      visible={openDialog}
      // style={{ width: "40vw" }}
      footer={renderDialogFooter()}
      onHide={() => setOpenDialog(false)}
      blockScroll={true}
      className="modern-dialog p-fluid"
      maximizable
    >
      <>
        {/* <Toast ref={toast} position="top-right" /> */}
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel
            header="ข้อมูลรูปแปลง"
            style={{ backgroundColor: "#f9fbff", color: "#333" }}
          >
            {/* {spatialServiceRate.length} */}
            {renderServiceRatesTable(spatialServiceRate, setSpatialServiceRate)}
          </TabPanel>
          <TabPanel
            header="ข้อมูลทะเบียน"
            style={{ backgroundColor: "#f9fbff", color: "#333" }}
          >
            {/* {restServiceRate.length} */}
            {renderServiceRatesTable(restServiceRate, setRestServiceRate)}
          </TabPanel>
        </TabView>
      </>
    </Dialog>
  );
}
