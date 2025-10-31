import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import ADM03List from "./ADM03List";
import ADM03Dialog from "./ADM03Dialog";

//SERVICE
import {
  ADM03GetDataList,
  ADM03CreateData,
  ADM03UpdateData,
  ADM03CancelData,
  ADM03UpdateServiceUse,
  ADM03GetServiceReqAndRes,
  ADM03AddServiceReqAndRes,
  ADM03UpdateServiceReqAndRes,
  ADM03DeleteServiceReqAndRes,
  updateOrder,
  updateOrderList,
  updateServicePublic,
} from "../../../service/ServiceADM/ServiceADM03";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateTableADM3,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import {
  strToArrBuffer,
  excelSheetFromAoA,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";
import { URL_API_EXPORT } from "../../../service/Config";

export default function ADM03() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);

  //REQ
  const [reqAndResList, setReqAndResList] = useState([]);

  //RES

  // 'SOAP', 'REST', 'WMS', 'WMTS'
  const [serviceOption, setServiceOption] = useState([
    { label: "REST", value: "REST" },
    { label: "WMS", value: "WMS" },
    { label: "GEOJSON", value: "GEOJSON" },
  ]);
  // 'TEXT', 'SPATIAL'
  const [dataOption, setDataOption] = useState([
    { label: "TEXT", value: "TEXT" },
    { label: "SPATIAL", value: "SPATIAL" },
  ]);

  const [lastServiceSeq, setLastServiceSeq] = useState(0);

  const [typeRequestResponse, setTypeRequestResponse] = useState(0);
  const [optionDepartment, setOptionDepartment] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    onADM03GetDataList();

    // ประเภทผู้ใช้งาน
    masterService("GetTypeRequestResponse?mode=1", {}, "GET").then(
      (res) => {
        setTypeRequestResponse(res.result);
        setLoading(false);
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );

    masterService(`GetDepartment?mode=1`, {}, "GET").then((res) => {
      setOptionDepartment(res.result);
    });
  }, []);

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
            });
            index++;
          });
          setDataTable(temp);
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

  const validation = (object) => {
    if (
      object.service_name === "" ||
      object.service_id === "" ||
      object.service_protocol === "" ||
      object.service_host === "" ||
      object.service_path === "" ||
      object.service_type === null ||
      object.service_method === null ||
      object.service_data_type === null ||
      object.department_seq === "-1" ||
      object.department_seq === -1 ||
      object.service_url === "" ||
      object.service_url === null ||
      object.service_url === undefined
    ) {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const submitForm = (submitForm) => {
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      setLoading(true);
      ADM03CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "บันทึกข้อมูลการให้บริการ");
            // setDataTable(res.result);
            onADM03GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.errors.message}`
            );
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
      setLoading(true);
      console.log("submitForm", submitForm);
      ADM03UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "แก้ไขข้อมูลการให้บริการ");
            // setDataTable(res.result);
            onADM03GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.errors.message}`
            );
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    }
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const onServiceStatusChange = (rowData, isChecked) => {
    setLoading(true);
    ADM03UpdateServiceUse({
      service_seq: rowData.service_seq,
      use_flag: isChecked === true ? "1" : "0",
    }).then(
      (res) => {
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            isChecked === true ? "เปิด Service" : "ปิด Service"
          );
          onADM03GetDataList();
          setDeleteDialog(false);
        }
        setLoading(false);
      },
      function (err) {
        setLoading(false);
      }
    );
  };

  const onUpdateServicePublic = (rowData, isChecked) => {
    setLoading(true);
    updateServicePublic({
      service_seq: rowData.service_seq,
      public_flag: isChecked === true ? "1" : "0",
    }).then(
      (res) => {
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            isChecked === true ? "เปิด เผยแพร่ Service" : "ปิด เผยแพร่ Service"
          );
          onADM03GetDataList();
          setDeleteDialog(false);
        }
        setLoading(false);
      },
      function (err) {
        setLoading(false);
      }
    );
  };

  const onCreatePDFClick = async () => {
    // setLoading(true)
    let data = dataTable;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let record_status =
          data[i].record_status == "N" ? "ใช้งาน" : "ไม่ใช้งาน";
        _arr.push([
          {
            text: data[i].index,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].department_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].service_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].service_id,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].service_protocol,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].service_path,
            style: { fontSize: 12 },
          },
          {
            text: data[i].service_param,
            style: { fontSize: 12 },
          },
          {
            text: data[i].service_method,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].service_type,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].service_data_type,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: record_status,
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }
      var content = {
        pageSize: "A4",
        pageOrientation: "landscape",
        content: [generateTableADM3(_arr)],
        pageMargins: [20, 20, 40, 40],
        style: "tableExample",
      };
      generatePdfOpenNewTab(true, content, (dataUrl) => {
        // this.setState({ pdfURL: dataUrl, viewPDF: true });
        // setDialogPDF({ open: true, pdfURL: dataUrl })
        setLoading(false);
      });
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const onExportExcelClick = async () => {
    setLoading(true);
    let _exportData = [];
    let index = 1;
    dataTable.forEach((element) => {
      let record_status =
        element.record_status === "N" ? "ใช้งาน" : "ไม่ใช้งาน";
      _exportData.push({
        index: index,
        department_name: element.department_name,
        service_name: element.service_name,
        service_id: element.service_id,
        service_protocol: element.service_protocol,
        service_path: element.service_path,
        service_param:
          element.service_param === null ? " " : element.service_param,
        service_method: element.service_method,
        service_type: element.service_type,
        service_data_type: element.service_data_type,
        record_status: record_status,
      });
      index++;
    });

    let fileName = `ADM03-${new Date().getTime().toString()}.xlsx`;
    let txtHead =
      "รายงานกำหนดข้อมูลการให้บริการ" +
      "\n" +
      "รายงาน ณ " +
      formatDateTH_full2(new Date(), true);
    let json_data = {
      nameTemplate: "ADM03",
      namefileExport: fileName,
      sumCell: [false],
      footerCell: [false],
      list: [
        {
          headCell: ["A", 1, txtHead],
          dateCell: false,
          bodyCell: ["A", 4],
          sheetName: "รายงาน",
          data: _exportData,
        },
      ],
    };
    await masterGenSpreadsheet("spreadsheet", json_data).then((res) => {
      setLoading(false);
      let url = "";
      if (window.location.hostname.indexOf("localhost") !== -1) {
        url = `http://localhost:30004/export/downloadfile?filename=${fileName}`;
      } else {
        url = URL_API_EXPORT(`export/downloadfile?filename=${fileName}`);
      }
      fetch(url).then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
        });
      });
    });
  };

  // REQ RES ALL FN
  const onGetServiceReqAndRes = (typeService, rowData, openDialog = false) => {
    setLoading(true);
    setLastServiceSeq(rowData.service_seq);
    ADM03GetServiceReqAndRes(typeService, rowData.service_seq).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              index: index,
            });
            index++;
          });
          setReqAndResList(temp);
          if (typeService === "Request" && openDialog) {
            setDialog({
              dialogRequest: true,
              action: "Request",
              data: rowData,
            });
          } else if (typeService === "Response" && openDialog) {
            setDialog({
              dialogResponse: true,
              action: "Response",
              data: rowData,
            });
          }
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
      }
    );
  };

  //ADD
  const onAddServiceReqAndRes = (typeService, rowData) => {
    setLoading(true);
    ADM03AddServiceReqAndRes(typeService, rowData).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            `บันทึกข้อมูลพจนานุกรม ${
              typeService === "Request"
                ? "ข้อมูลคำขอ (Request)"
                : "ที่ตอบกลับ (Response)"
            }`
          );
          onGetServiceReqAndRes(typeService, rowData);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  //UPDATE
  const onUpdateServiceReqAndRes = (typeService, formObject) => {
    setLoading(true);
    ADM03UpdateServiceReqAndRes(typeService, formObject).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            `แก้ไขข้อมูลพจนานุกรมข้อมูลคำขอ (${typeService})`
          );
          onGetServiceReqAndRes(typeService, formObject);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  //DELETE
  const onDeleteServiceReqAndRes = (typeService, formObject) => {
    setLoading(true);
    ADM03DeleteServiceReqAndRes(
      typeService,
      typeService === "Request"
        ? formObject.request_seq
        : formObject.response_seq
    ).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            `ลบข้อมูลพจนานุกรม ${
              typeService === "Request"
                ? "ข้อมูลคำขอ (Request)"
                : "ที่ตอบกลับ (Response)"
            }`
          );
          onGetServiceReqAndRes(typeService, formObject);
          setDeletePopup(false);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  const renderFooter = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => setDialogPDF(false)}
          className="p-button-secondary p-button-rounded"
          style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        />
      </div>
    );
  };

  const onRowReorder = (e, typeService) => {
    let arr = [];
    e.value.forEach((element) => {
      if (typeService === "UpdateOrderRequest") {
        arr.push(element.request_seq);
      } else if (typeService === "UpdateOrderResponse") {
        arr.push(element.response_seq);
      }
    });
    // setDialog(true);
    updateOrder(typeService, arr).then(
      (res) => {
        setLoading(false);
        showMessages("success", `สำเร็จ`, "บันทึกจัดเรียง");
        onGetServiceReqAndRes(
          typeService === "UpdateOrderRequest" ? "Request" : "Response",
          { service_seq: lastServiceSeq },
          true
        );
        // setDialog(false);
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  const onRowReorders = (e) => {
    let arr = [];
    e.value.forEach((element) => {
      arr.push(element.service_seq);
    });
    setDialog(true);
    updateOrderList(arr).then(
      (res) => {
        setLoading(false);
        showMessages("success", `สำเร็จ`, "บันทึกจัดเรียง");
        onADM03GetDataList();
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  const footerButton = () => {
    const onADM03DeleteData = () => {
      ADM03CancelData(deleteDialog.data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ยกเลิกข้อมูลสำเร็จ");
            onADM03GetDataList();
            setDeleteDialog(false);
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    };

    return (
      <FooterButtonCenter
        onClickOk={() => onADM03DeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        <Toast ref={toast} position="top-right" />
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 className="p-m-0">{getTextMenu()}</h1>
            <div>
              <Button
                style={{ height: "35px", color: "green" }}
                label="ส่งออก Excel"
                icon="pi pi-file-excel"
                onClick={() => onExportExcelClick()}
                className="p-button-info p-button-rounded p-button-outlined"
                tooltip="คลิกเพื่อ ส่งออก Excel"
                tooltipOptions={{ position: "top" }}
              />
              <Button
                style={{ height: "35px", marginLeft: "5px" }}
                label="ส่งออก PDF"
                icon="pi pi-file-pdf"
                onClick={() => onCreatePDFClick()}
                className="p-button-danger p-button-rounded p-button-outlined"
                tooltip="คลิกเพื่อ ส่งออก PDF"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>

          <ADM03List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onServiceStatusChange={(a, b) => onServiceStatusChange(a, b)}
            onUpdateServicePublic={(a, b) => onUpdateServicePublic(a, b)}
            onGetServiceReqAndRes={(a, b, c) => onGetServiceReqAndRes(a, b, c)}
            onRowReorders={onRowReorders}
          />
          {dialog && (
            <ADM03Dialog
              dialog={dialog}
              setDialog={setDialog}
              submitForm={(e) => submitForm(e)}
              submitted={submitted}
              setSubmitted={setSubmitted}
              serviceOption={serviceOption}
              dataOption={dataOption}
              reqAndResList={reqAndResList}
              // setReqAndResList={setReqAndResList}
              onAddServiceReqAndRes={(a, b) => onAddServiceReqAndRes(a, b)}
              onUpdateServiceReqAndRes={(a, b) =>
                onUpdateServiceReqAndRes(a, b)
              }
              onDeleteServiceReqAndRes={(a, b) =>
                onDeleteServiceReqAndRes(a, b)
              }
              onRowReorder={onRowReorder}
              typeRequestResponse={typeRequestResponse}
              optionDepartment={optionDepartment}
              deletePopup={deletePopup}
              setDeletePopup={setDeletePopup}
              showMessages={showMessages}
              setDialogPDF={setDialogPDF}
            />
          )}
        </div>
        {dialogPDF && (
          <Dialog
            header={`${
              dialogPDF.formObject === undefined
                ? "PDF"
                : `JSON file ${dialogPDF.formObject.service_name} - ${dialogPDF.formObject.service_file_name}`
            }`}
            visible={dialogPDF.open}
            blockScroll={true}
            footer={renderFooter()}
            modal
            maximizable
            maximized
            onHide={() => setDialogPDF({ open: false, pdfURL: null })}
          >
            <div className="confirmation-content" style={{ paddingTop: "0em" }}>
              <Iframe
                url={dialogPDF.pdfURL}
                width="100%"
                height={window.innerHeight - 110}
                display="initial"
                position="relative"
              />
            </div>
          </Dialog>
        )}
      </div>
      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        textContent="คุณต้องการยกเลิกข้อมูล ใช่หรือไม่ ?"
      />
    </>
  );
}
