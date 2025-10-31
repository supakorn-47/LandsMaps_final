import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { validateInputText } from "../../../utils/ValidateUtil";

export default function DBT05Dialog({
  dialog,
  setDialog,
  submitForm,
  submitted,
  msDataSource,
  msSchema,
  msDataTable,
  msDataScale,
  msDataScalePage,
  onScalePage,
  optionProvince,
  optionDistrict,
  setIdProvince,
}) {
  const [formObject, setformObject] = useState({});
  const [idDataTable, setIdDataTable] = useState();
  // useEffect(() => {
  //   if (idDataTable) {
  //     console.log(idDataTable);

  //     idDataTable(idDataTable);
  //   } else idDataTable("");
  // }, [idDataTable]);

  useEffect(() => {
    if (dialog.action === "UPDATE") {
      setformObject(dialog.data);
      onScalePage(dialog.data.utmscale);
    } else if (dialog?.data?.tb_reg_parcel === "something") {
      // แก้ไขเงื่อนไขและfield
      setformObject({
        source_seq: 0,
        transfer_data_seq: 0,
        source_schema: "กรุณาเลือก Schema",
        land_no: "",
        district: "", //change field
        province: "", //change field
      });
    } else {
      setformObject({
        source_seq: 0,
        transfer_data_seq: 0,
        source_schema: "กรุณาเลือก Schema",
        land_no: "",
        utmmap1: "",
        utmmap2: 0,
        utmmap3: "",
        utmmap4: "",
        utmscale: "0",
      });
    }
  }, [dialog.data]);

  // แก้ไข

  const optionUMT2 = [
    { label: "เลือก", value: 0 },
    { label: "I", value: 1 },
    { label: "II", value: 2 },
    { label: "III", value: 3 },
    { label: "IV", value: 4 },
  ];

  const dialogData = () => {
    const footer = () => {
      return (
        <div className="dialog-footer-action-right">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            onClick={() => setDialog(false)}
            className="p-button-secondary p-button-rounded"
            // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
          />
          <Button
            label={dialog.action === "SAVE" ? "บันทึก" : "แก้ไข"}
            icon="pi pi-check"
            onClick={() => submitForm(formObject)}
            autoFocus
            className="p-button-rounded p-button-info"
          />
        </div>
      );
    };
    return (
      <Dialog
        header={
          (dialog.action === "SAVE" ? "เพิ่ม" : "แก้ไข") +
          "เงื่อนไขการดึงข้อมูลแปลงที่ดิน"
        }
        visible={dialog.dialog}
        style={{ width: "55vw" }}
        footer={footer()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-12">
            <label>
              แหล่งข้อมูล<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.source_seq + ""}
              options={msDataSource}
              onChange={(e) =>
                setformObject({ ...formObject, source_seq: e.value })
              }
              placeholder="แหล่งข้อมูล"
              appendTo={document.body}
            />
            {submitted &&
              formObject.source_seq === 0 &&
              validateInputText("source_seq", "แหล่งข้อมูล")}
          </div>
          <div className="p-col-6">
            <label>
              Schema<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="label"
              value={formObject.source_schema}
              options={msSchema}
              onChange={(e) =>
                setformObject({ ...formObject, source_schema: e.value })
              }
              placeholder="แหล่งข้อมูล"
              appendTo={document.body}
            />
            {submitted &&
              formObject.source_schema === "กรุณาเลือก Schema" &&
              validateInputText("source_schema", "Schema")}
          </div>
          <div className="p-col-6">
            <label>
              Table<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.transfer_data_seq + ""}
              options={msDataTable}
              onChange={(e) => {
                setformObject({ ...formObject, transfer_data_seq: e.value });
                setIdDataTable(e.value);
              }}
              placeholder="Table"
              appendTo={document.body}
            />
            {submitted &&
              formObject.transfer_data_seq === 0 &&
              validateInputText("transfer_data_seq ", "Table")}
          </div>
          {idDataTable === "1" ? ( //change field
            <>
              <div className="p-col-4">
                <label htmlFor="state">จังหวัด</label>
                <Dropdown
                  value={formObject.province_seq} //change field
                  options={optionProvince}
                  optionLabel="label"
                  optionValue="value"
                  appendTo={document.body}
                  onChange={(e) => (
                    setformObject({ ...formObject, province_seq: e.value }), //change field
                    setIdProvince(e.value)
                  )}
                />
              </div>
              <div className="p-col-4">
                <label htmlFor="state">อำเภอ</label>
                <Dropdown
                  value={formObject.amphur_seq}
                  options={optionDistrict}
                  optionLabel="label"
                  optionValue="value"
                  appendTo={document.body}
                  onChange={(e) =>
                    setformObject({ ...formObject, amphur_seq: e.value })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="p-col-4">
                <label htmlFor="state">มาตราส่วน</label>
                <Dropdown
                  value={formObject.utmscale}
                  options={msDataScale}
                  optionLabel="label"
                  optionValue="value"
                  appendTo={document.body}
                  onChange={(e) => (
                    setformObject({ ...formObject, utmscale: e.value }),
                    onScalePage(e.value)
                  )}
                />
              </div>
              <div className="p-col-4 ">
                <label>UTMMAP1</label>
                <InputText
                  value={formObject.utmmap1}
                  keyfilter="int"
                  maxLength={4}
                  onChange={(e) =>
                    setformObject({ ...formObject, utmmap1: e.target.value })
                  }
                />
              </div>
              <div className="p-col-4">
                <label htmlFor="state">UTMMAP2</label>
                <Dropdown
                  value={formObject.utmmap2}
                  options={optionUMT2}
                  optionLabel="label"
                  optionValue="value"
                  appendTo={document.body}
                  onChange={(e) =>
                    setformObject({ ...formObject, utmmap2: e.value })
                  }
                />
              </div>
              <div className="p-col-4">
                <label>UTMMAP3</label>
                <InputText
                  value={formObject.utmmap3}
                  keyfilter="int"
                  maxLength={4}
                  onChange={(e) =>
                    setformObject({ ...formObject, utmmap3: e.target.value })
                  }
                />
              </div>
              <div className="p-col-4">
                <label>UTMMAP4</label>
                <Dropdown
                  value={formObject.utmmap4}
                  options={msDataScalePage}
                  optionValue="value"
                  optionLabel="label"
                  appendTo={document.body}
                  onChange={(e) =>
                    setformObject({ ...formObject, utmmap4: e.value })
                  }
                />
              </div>
            </>
          )}
          <div className={dialog?.data?.source_table ? "p-col-4" : "p-col-12"}>
            <label>เลขที่ดิน</label>
            <InputText
              value={formObject.land_no}
              onChange={(e) =>
                setformObject({ ...formObject, land_no: e.target.value })
              }
            />
          </div>{" "}
        </div>
      </Dialog>
    );
  };

  return (
    <>
      {/* {dialogUpdate()} */}
      {dialogData()}
    </>
  );
}
