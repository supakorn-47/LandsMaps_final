import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendars } from "../../../components/Calendar/Calendar";
import { validateInputText } from "../../../utils/ValidateUtil";
import { ListBox } from "primereact/listbox";
import { Galleria } from "primereact/galleria";
import { TabView, TabPanel } from "primereact/tabview";
import { Editor } from "primereact/editor";

export default function ADM06Dialog({
  dialog,
  setDialog,
  submitForm,
  submitted,
  showMessages,
  arrFile,
  setArrFile,
  arrImg,
  setArrImg,
  setPopupViewFile,
  setDeleteDialog,
  annouceType,
}) {
  const [selectedTable, setSelectedTable] = useState([]);
  const [formObject, setformObject] = useState({});
  const [size, setSize] = useState(50);

  useEffect(() => {
    if (dialog.dialog === true && dialog.action === "แก้ไข") {
      // console.log('dialog.data', dialog.data)
      setformObject(dialog.data);
    } else {
      let _getDateTime = new Date();
      _getDateTime.setHours(0, 0, 0, 0);
      setformObject({
        announce_seq: 0,
        announce_date: new Date(),
        announce_start_date: _getDateTime,
        announce_finish_date: new Date(),
        announce_title_th: "",
        announce_title_en: "",
        announce_desc_th: "",
        announce_desc_en: "",
        announce_attach: "",
        announce_type: "-1",
      });
    }
  }, [dialog.data]);

  useEffect(() => {
    if (size > 100) {
      setSize(100);
    } else if (size < 25) {
      setSize(25);
    }
  }, [size]);

  useEffect(() => {
    if (dialog.dialogLayer == true) {
      let arr_Temp = [];
      dialog.data.usergrouplayer_list.forEach((element) => {
        console.log("element", element);
        if (element.ischecked === "1") {
          arr_Temp.push(element);
        }
      });
      setSelectedTable(arr_Temp);
    }
  }, [dialog.dialogLayer]);

  const renderFooter = () => {
    return (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        <Button
          label={dialog.action}
          icon="pi pi-check"
          onClick={() => submitForm(formObject, arrFile, arrImg)}
          autoFocus
          className="p-button-rounded"
        />
      </div>
    );
  };

  const renderFooter2 = () => {
    return (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
      </div>
    );
  };

  const popupViewFile = () => {
    if (dialog.viewImage === undefined || dialog.viewPDF === undefined) return;
    const itemTemplate = (item) => {
      return (
        <img
          src={item.announce_file_path}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          alt={"dds"}
          style={{
            maxWidth: "60%",
            display: "block",
            minWidth: "60%",
            height: "400px",
            maxHeight: "500px",
          }}
        />
      );
    };

    return (
      <Dialog
        header={dialog.action}
        visible={dialog.dialogViewImage}
        style={{ width: "60vw" }}
        footer={renderFooter2()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable={true}
      >
        <div className="grid">
          <TabView>
            <TabPanel
              header={`ไฟล์รูปภาพ ( ${dialog.viewImage.length} )`}
              disabled={dialog.viewImage.length === 0}
            >
              <Galleria
                value={dialog.viewImage}
                responsiveOptions={[
                  {
                    breakpoint: "1024px",
                    numVisible: 5,
                  },
                  {
                    breakpoint: "768px",
                    numVisible: 3,
                  },
                  {
                    breakpoint: "560px",
                    numVisible: 1,
                  },
                ]}
                numVisible={5}
                showThumbnails={false}
                showIndicators
                item={itemTemplate}
              />
            </TabPanel>
            <TabPanel
              header={`ไฟล์เอกสาร ( ${dialog.viewPDF.length} )`}
              disabled={dialog.viewPDF.length === 0}
            >
              {/* <div style={{ marginBottom: 30, marginTop: 20 }}>
                                {
                                    dialog.viewPDF.map((list, index) => {
                                        return (
                                            <div className="p-col-6">
                                                <Button
                                                    className="p-button-link"
                                                    label={`${index + 1}. ${list.announce_file_path.replace('http://sitdev.dyndns.org:9121/apiWebAdmin/Upload/Announce/', '')}`}
                                                    onClick={() => setPopupViewFile({ open: true, linkURL: list.announce_file_path })}
                                                    tooltip={`คลิกที่นี่เพื่อดูไฟล์ PDF`}
                                                    tooltipOptions={{ position: 'bottom' }}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div> */}
              {dialog.viewPDF.map((list, index) => {
                return (
                  <div style={{ marginTop: "15px" }}>
                    <a
                      onClick={() =>
                        setPopupViewFile({
                          open: true,
                          linkURL: list.announce_file_path,
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >{`${index + 1}. ${list.announce_file_name}`}</a>
                  </div>
                );
              })}
            </TabPanel>
          </TabView>
        </div>
      </Dialog>
    );
  };

  const onHide = () => {
    setDialog(false);
    setformObject({});
  };

  const onChangefile = (e, index, _EVENT) => {
    if (e.target.files[0] === undefined) return;
    if (_EVENT === "IMG") {
      if (e.target.files[0].size > 5242880) {
        showMessages("warn", `แจ้งเตือน`, `ขนาดไม่เกิน 5MB`);
        document.getElementById(`_uploadIMG_${index + 1}`).value = "";
        return;
      }
      if (
        e.target.files[0].type !== "image/jpeg" &&
        e.target.files[0].type !== "image/png"
      ) {
        showMessages(
          "error",
          `กรุณาตรวจสอบ`,
          "ไฟล์ภาพเฉพาะนามสกุล .png, .jpeg เท่านั้น"
        );
        document.getElementById(`_uploadIMG_${index + 1}`).value = "";
        return;
      } else {
        let temp = arrImg;
        temp[index] = e.target.files[0];
        setArrImg(temp);
      }
    } else if (_EVENT === "FILE") {
      if (e.target.files[0].size > 5242880) {
        showMessages("warn", `แจ้งเตือน`, `ขนาดไม่เกิน 5MB`);
        document.getElementById(`_uploadFILE_${index + 1}`).value = "";
        return;
      }
      if (e.target.files[0].type !== "application/pdf") {
        showMessages(
          "error",
          `กรุณาตรวจสอบ`,
          "ไฟล์แนบเฉพาะนามสกุล .pdf เท่านั้น"
        );
        document.getElementById(`_uploadFILE_${index + 1}`).value = "";
        return;
      } else {
        let temp = arrFile;
        temp[index] = e.target.files[0];
        setArrFile(temp);
      }
    }
  };

  const onAddFileClick = (_E) => {
    if (_E === "FILE") {
      let temp = arrFile;
      temp.push({ file: "" });
      setArrFile(temp);
    } else if (_E === "IMG") {
      let temp = arrImg;
      temp.push({ file: "" });
      setArrImg(temp);
    }
  };

  const removeArrFile = (list, index, _EVENT) => {
    if (_EVENT === "FILE") {
      if (list.announce_file_path !== undefined) {
        setDeleteDialog({
          open: true,
          data: list,
          onClickDelete: "FILE",
          indexDelete: index,
        });
      } else {
        arrFile.splice(index, 1);
      }
    } else if (_EVENT === "IMG") {
      if (list.announce_file_path !== undefined) {
        setDeleteDialog({
          open: true,
          data: list,
          onClickDelete: "FILE",
          indexDelete: index,
        });
      } else {
        arrImg.splice(index, 1);
      }
    }
  };

  const editorHeader = <div></div>;

  var toolbarOptions = [
    ["bold", "italic", "underline"],
    // [{ 'size': ['`small`', false, 'large', 'huge'] }],
    [{ color: [] }, { background: [] }],
    // [{ 'list': 'ordered' }],
    ["clean"],
  ];

  return (
    <>
      <Dialog
        header={
          dialog.action === "บันทึก"
            ? "เพิ่มข่าวประกาศ"
            : dialog.action + "ข่าวประกาศ"
        }
        visible={dialog.dialog}
        style={{ width: "65vw" }}
        footer={renderFooter()}
        onHide={() => onHide()}
        blockScroll={true}
        className="p-fluid"
        maximizable={true}
      >
        <div className="p-grid" style={{ marginBottom: 30 }}>
          <div className="p-col-6">
            <label>
              วันที่ประกาศ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              value={new Date(formObject.announce_date)}
              onChange={(e) =>
                setformObject({ ...formObject, announce_date: e.target.value })
              }
            />
          </div>
          <div className="p-col-6">
            <label>
              ประเภทข่าว<span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              optionLabel="label"
              optionValue="value"
              value={formObject.announce_type + ""}
              options={annouceType}
              onChange={(e) =>
                setformObject({ ...formObject, announce_type: e.value })
              }
              appendTo={document.body}
            />
            {submitted &&
              formObject.announce_type === "-1" &&
              validateInputText("announce_type", "ประเภทข่าว")}
          </div>
          <div className="p-col-6">
            <label>
              วันที่เริ่มต้นประกาศ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              showTime
              value={new Date(formObject.announce_start_date)}
              maxDate={new Date(formObject.announce_finish_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  announce_start_date: e.target.value,
                })
              }
            />
          </div>
          <div className="p-col-6">
            <label>
              วันที่สิ้นสุดประกาศ<span style={{ color: "red" }}>*</span>
            </label>
            <Calendars
              showTime
              value={new Date(formObject.announce_finish_date)}
              minDate={new Date(formObject.announce_start_date)}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  announce_finish_date: e.target.value,
                })
              }
            />
          </div>
          <div className="p-col-6">
            <label>
              หัวข้อประกาศ(ภาษาไทย)<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.announce_title_th}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  announce_title_th: e.target.value,
                })
              }
              maxLength="500"
            />
            {submitted &&
              !formObject.announce_title_th &&
              validateInputText("announce_title_th", "หัวข้อประกาศ(ภาษาไทย)")}
          </div>
          <div className="p-col-6">
            <label>
              หัวข้อประกาศ(ภาษาอังกฤษ)<span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              value={formObject.announce_title_en}
              onChange={(e) =>
                setformObject({
                  ...formObject,
                  announce_title_en: e.target.value,
                })
              }
              maxLength="500"
            />
            {submitted &&
              !formObject.announce_title_en &&
              validateInputText(
                "announce_title_en",
                "หัวข้อประกาศ(ภาษาอังกฤษ)"
              )}
          </div>
          <div className="p-col-12">
            <label>
              รายละเอียดประกาศ(ภาษาไทย)<span style={{ color: "red" }}>*</span>
            </label>
            {/* <InputTextarea rows={5} value={formObject.announce_desc_th} onChange={(e) => setformObject({ ...formObject, announce_desc_th: e.target.value })} style={{ height: '100px' }} maxLength="4000" /> */}
            <Editor
              headerTemplate={editorHeader}
              style={{ height: "200px" }}
              value={formObject.announce_desc_th}
              onTextChange={(e) =>
                setformObject({ ...formObject, announce_desc_th: e.htmlValue })
              }
              modules={{
                toolbar: toolbarOptions,
              }}
            />
            {submitted &&
              !formObject.announce_desc_th &&
              validateInputText(
                "announce_desc_th",
                "รายละเอียดประกาศ(ภาษาไทย)"
              )}
          </div>
          <div className="p-col-12">
            <label>
              รายละเอียดประกาศ(ภาษาอังกฤษ)
              <span style={{ color: "red" }}>*</span>
            </label>
            {/* <InputTextarea rows={5} value={formObject.announce_desc_en} onChange={(e) => setformObject({ ...formObject, announce_desc_en: e.target.value })} style={{ height: '100px' }} maxLength="4000" /> */}
            <Editor
              headerTemplate={editorHeader}
              style={{ height: "200px" }}
              value={formObject.announce_desc_en}
              onTextChange={(e) =>
                setformObject({ ...formObject, announce_desc_en: e.htmlValue })
              }
              modules={{
                toolbar: toolbarOptions,
              }}
            />
            {submitted &&
              !formObject.announce_desc_en &&
              validateInputText(
                "announce_desc_en",
                "รายละเอียดประกาศ(ภาษาอังกฤษ)"
              )}
          </div>
          <div className="p-col-12">
            <label>ลิ้งเพิ่มเติม(ถ้ามี)</label>
            <InputText
              value={formObject.announce_url}
              onChange={(e) =>
                setformObject({ ...formObject, announce_url: e.target.value })
              }
              placeholder="www.example.com"
              maxLength="255"
            />
          </div>

          <div className="p-col-6">
            <div className="p-grid">
              <div className="p-col-12">
                <Button
                  label="เพิ่มรูปภาพ"
                  icon="pi pi-plus"
                  onClick={() => onAddFileClick("IMG")}
                  className="p-button-rounded p-button-info"
                  style={{ width: "150px" }}
                />
              </div>
              <div className="p-col-12">
                <small style={{ color: "red" }}>
                  *ไฟล์ภาพเฉพาะนามสกุล .png, .jpeg เท่านั้น
                </small>
              </div>
              {arrImg.map((list, index) => {
                return list.announce_file_name === undefined ? (
                  <>
                    <div className="p-col-12">
                      <label>{`${index + 1}. รูปภาพ ${
                        list.announce_file_path !== undefined
                          ? list.announce_file_name
                          : ""
                      }`}</label>
                      <div style={{ display: "flex" }}>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={(e) => onChangefile(e, index, "IMG")}
                          id={`_uploadIMG_${index + 1}`}
                          name="filename"
                          style={{
                            border: "1px solid #E0E0E0",
                            width: "100%",
                            height: "33px",
                            padding: "7px",
                          }}
                        />
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-danger"
                          aria-label="Minus"
                          onClick={() => removeArrFile(list, index, "IMG")}
                          style={{
                            marginLeft: "5px",
                            height: "30px",
                            width: "30px",
                          }}
                          tooltip={`คลิกที่นี่เพื่อลบรูปที่ ${index + 1}`}
                        />
                      </div>
                    </div>
                    {list.announce_file_path !== undefined ? (
                      <div className="p-col-12" style={{ textAlign: "center" }}>
                        <img
                          src={list.announce_file_path}
                          width="80%"
                          height="200px"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    <div className="p-col-12">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          border: "1px solid #ced4da",
                          padding: "3px",
                        }}
                      >
                        <label style={{ marginTop: "3px" }}>{`${
                          index + 1
                        }. รูปภาพ ${
                          list.announce_file_path !== undefined
                            ? list.announce_file_name
                            : ""
                        }`}</label>
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-danger"
                          aria-label="Minus"
                          onClick={() => removeArrFile(list, index, "IMG")}
                          style={{
                            marginLeft: "5px",
                            height: "30px",
                            width: "30px",
                          }}
                          tooltip={`คลิกที่นี่เพื่อลบรูปที่ ${index + 1}`}
                        />
                      </div>
                    </div>
                    {list.announce_file_path !== undefined ? (
                      <div className="p-col-12" style={{ textAlign: "center" }}>
                        <img
                          src={list.announce_file_path}
                          width="80%"
                          height="200px"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
            </div>
          </div>

          <div className="p-col-6">
            <div className="p-grid">
              <div className="p-col-12">
                <Button
                  label="เพิ่มไฟล์ PDF"
                  icon="pi pi-plus"
                  onClick={() => onAddFileClick("FILE")}
                  className="p-button-rounded p-button-info"
                  style={{ width: "150px" }}
                />
              </div>
              <div className="p-col-12">
                <label style={{ color: "red", fontWeight: true }}>
                  *ไฟล์แนบเฉพาะนามสกุล .pdf เท่านั้น
                </label>
              </div>
              {arrFile.map((list, index) => {
                return list.announce_file_name === undefined ? (
                  <>
                    <div className="p-col-12">
                      <label>{`${index + 1}. ไฟล์แนบ ${
                        list.announce_file_name !== undefined
                          ? list.announce_file_name
                          : ""
                      }`}</label>
                      <div style={{ display: "flex" }}>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => onChangefile(e, index, "FILE")}
                          id={`_uploadFILE_${index + 1}`}
                          name="filename"
                          style={{
                            border: "1px solid #E0E0E0",
                            width: "100%",
                            height: "33px",
                            padding: "7px",
                          }}
                        />
                        {list.announce_file_path !== undefined ? (
                          <Button
                            icon="pi pi-external-link"
                            className="p-button-rounded p-button-info"
                            aria-label="Minus"
                            onClick={() =>
                              setPopupViewFile({
                                open: true,
                                linkURL: list.announce_file_path,
                              })
                            }
                            style={{
                              marginLeft: "5px",
                              height: "30px",
                              width: "30px",
                            }}
                            tooltip={`คลิกที่นี่เพื่อดูไฟล์`}
                          />
                        ) : (
                          ""
                        )}
                        <Button
                          icon="pi pi-trash"
                          className="p-button-rounded p-button-danger"
                          aria-label="Minus"
                          onClick={() => removeArrFile(list, index, "FILE")}
                          style={{
                            marginLeft: "5px",
                            height: "30px",
                            width: "30px",
                          }}
                          tooltip={`คลิกที่นี่เพื่อลบไฟล์ที่ ${index + 1}`}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-col-12">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          border: "1px solid #ced4da",
                          padding: "3px",
                        }}
                      >
                        <label style={{ marginTop: "3px" }}>{`${
                          index + 1
                        }. ไฟล์แนบ ${
                          list.announce_file_name !== undefined
                            ? list.announce_file_name
                            : ""
                        }`}</label>
                        <div>
                          {list.announce_file_path !== undefined ? (
                            <Button
                              icon="pi pi-external-link"
                              className="p-button-rounded p-button-info"
                              aria-label="Minus"
                              onClick={() =>
                                setPopupViewFile({
                                  open: true,
                                  linkURL: list.announce_file_path,
                                })
                              }
                              style={{
                                marginLeft: "5px",
                                height: "30px",
                                width: "30px",
                              }}
                              tooltip={`คลิกที่นี่เพื่อดูไฟล์`}
                            />
                          ) : (
                            ""
                          )}
                          <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            aria-label="Minus"
                            onClick={() => removeArrFile(list, index, "FILE")}
                            style={{
                              marginLeft: "5px",
                              height: "30px",
                              width: "30px",
                            }}
                            tooltip={`คลิกที่นี่เพื่อลบไฟล์ที่ ${index + 1}`}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </Dialog>
      {popupViewFile()}
    </>
  );
}
