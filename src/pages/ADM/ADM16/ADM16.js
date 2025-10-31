import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
//PAGE
import ADM16Search from "./ADM16Search";
import ADM16List from "./ADM16List";
import ADM16Dialog from "./ADM16Dialog";

//SERVICE
import {
  ADM16GetDataList,
  ADM16UpdateData,
  ADM16DeleteData,
} from "../../../service/ServiceADM/ServiceADM16";
import { masterService } from "../../../service/ServiceMaster/MasterService";
//PDF
import {
  generateHead,
  generatePdf,
  styles,
  generateHead_ADM16,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import {
  strToArrBuffer,
  excelSheetFromAoA,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";
//dataMock
import dataMock from "./dataMock.json";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
var dateFormat = require("dateformat");
var d = new Date();
d.setFullYear(2564);

export default function ADM16() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  //Master
  const [provinceList, setProvinceList] = useState([]);
  const [amphurList, setAmphurList] = useState([]);
  const [tambolList, setTambolList] = useState([]);
  // SEARCH
  const [searchData, setSearchData] = useState({
    province_id: "0",
    amcode: "0",
    tamcode: "0",
    opt_name: "",
    consent_flag: "-1",
  });

  //   useEffect(() => {
  //     masterService("GetProvince", {}, "GET").then(
  //       (res) => {
  //         setProvinceList(res.result);
  //       },
  //       function (err) {
  //         console.log("err", err);
  //       }
  //     );
  //   }, []);

  // mock

  const onADM16GetDataList = () => {
    if (searchData.province_id === "0" || !searchData.province_id) {
      showMessages("warn", `แจ้งเตือน`, `กรุณาระบุ จังหวัด`);
      return;
    }

    setLoading(true);

    try {
      let filtered = dataMock.result.filter((item) => {
        let match = true;

        if (searchData.province_id && searchData.province_id !== "0") {
          match = match && item.province_id === searchData.province_id;
        }

        if (searchData.amcode && searchData.amcode !== "0") {
          match = match && String(item.amphur_id) === String(searchData.amcode);
        }

        if (searchData.tamcode && searchData.tamcode !== "0") {
          match =
            match && String(item.tambol_id) === String(searchData.tamcode);
        }

        if (searchData.consent_flag && searchData.consent_flag !== "-1") {
          match =
            match &&
            String(item.consent_flag) === String(searchData.consent_flag);
        }

        // opt_name filter (optional, case-insensitive)
        if (searchData.opt_name && searchData.opt_name.trim() !== "") {
          match =
            match &&
            item.opt_name
              .toLowerCase()
              .includes(searchData.opt_name.trim().toLowerCase());
        }

        return match;
      });

      // เพิ่ม index
      let temp = filtered.map((el, index) => ({ ...el, index: index + 1 }));

      setDataTable(temp);

      // สำหรับ report, sort ตาม consent_date ล่าสุด
      setDataTableReport(
        [...filtered].sort(
          (a, b) =>
            new Date(b.consent_date).getTime() -
            new Date(a.consent_date).getTime()
        )
      );

      setLoading(false);
    } catch (err) {
      console.error(err);
      showMessages("error", "เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลได้");
      setLoading(false);
    }
  };

  //   const onADM16GetDataList = () => {
  //     if (searchData.province_id === "0") {
  //       showMessages("warn", `แจ้งเตือน`, `กรุณาระบุ จังหวัด`);

  //     } else {
  //       setLoading(true);
  //       ADM16GetDataList(searchData).then(
  //         (res) => {
  //           setLoading(false);
  //           if (res.status === 200) {
  //             let temp = [];
  //             let index = 1;
  //             res.result.forEach((element) => {
  //               temp.push({
  //                 ...element,
  //                 index: index,
  //               });
  //               index++;
  //             });
  //             setDataTable(temp);
  //             setDataTableReport(
  //               res.result.sort((a, b) => (new Date(a) < new Date(b) ? 1 : -1))
  //             );
  //           } else {

  //             showMessages(
  //               "error",
  //               `เกิดข้อผิดพลาด Status Code: ${res.status}`,
  //               `${res.message}`
  //             );
  //           }
  //         },

  //         function (err) {
  //           if (err.response.data.status == 401) {
  //             alert(
  //               JSON.stringify(
  //                 "เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่"
  //               )
  //             );
  //             window.location.href = "/login";
  //           } else {
  //             alert(JSON.stringify(err.response.data));
  //           }
  //           setLoading(false);
  //         }
  //       );
  //     }
  //   };

  const validation = (object) => {
    if (
      object.province_id === "0" ||
      object.opt_type === 0 ||
      !object.opt_name ||
      object.landoffice_id === "0" ||
      object.consent_flag === "-1"
    ) {
      setSubmitted(true);
      return false;
    }
    setSubmitted(false);
    return true;
  };
  const submitForm = (data) => {
    if (validation(data)) {
      ADM16UpdateData(data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              "แก้ไขข้อมูล อปท. ที่ยินยอมเผยแพร่ข้อมูลการชำระภาษี"
            );
            onADM16GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              res.message
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

  const onCreatePDFClick = async () => {
    setLoading(true);
    let data = dataTableReport;
    let data2 = {};
    let ol_arr = [];
    // data2.type = 'none';

    //#region
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let data_status =
          data[i].consent_flag === "0"
            ? "ไม่ยินยอม"
            : data[i].consent_flag === "1"
            ? "ยินยอม"
            : "อยู่ระหว่างประสานงาน";

        //columus
        ol_arr.push({
          table: {
            headerRows: 1,
            widths: ["4%", "13%", "13%", "13%", "36%", "12%", "12%"],
            body: [
              [
                {
                  text: i + 1,
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text: data[i].pvnamethai,
                  style: { fontSize: 12 },
                },
                {
                  text: data[i].amnamethai,
                  style: { fontSize: 12 },
                },
                {
                  text: data[i].tamnamethai,
                  style: { fontSize: 12 },
                },
                {
                  text: data[i].opt_name,
                  style: { fontSize: 12 },
                },
                {
                  text: data_status,
                  style: { alignment: "center", fontSize: 12 },
                },
                {
                  text:
                    data[i].consent_date === null
                      ? ""
                      : formatDateTH(data[i].consent_date, false),
                  style: { alignment: "center", fontSize: 12 },
                },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0.25;
            },
            vLineWidth: function (i, node) {
              return 0.25;
            },
          },
        });

        data2 = ol_arr;
      }
      var content = {
        pageOrientation: "landscape",
        pageSize: "A4",
        content: [generateHead_ADM16(searchData), data2],
      };
      generatePdf(true, content, (dataUrl) => {
        // this.setState({ pdfURL: dataUrl, viewPDF: true });
        setDialogPDF({ open: true, pdfURL: dataUrl });
        setLoading(false);
      });
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const onCreateExcelClick = async () => {
    setLoading(true);
    let setBorder = {
      left: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
      right: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
      top: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
      bottom: {
        style: "thin",
        color: {
          auto: 1,
        },
      },
    };
    let styleTextHeaders = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      font: { bold: true },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: setBorder,
    };
    let styleHeaders = {
      fill: {
        fgColor: { rgb: "c7c7c7" },
      },
      font: { bold: true },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: setBorder,
    };

    let styleBorderB = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      border: setBorder,
      alignment: {
        vertical: "center",
        wrapText: true,
      },
    };
    let styleBorderB_Center = {
      fill: {
        fgColor: { rgb: "ffffff" },
      },
      border: setBorder,
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
    };

    // const { readData } = this.props;
    if (dataTableReport.length > 0) {
      let dataRow = dataTableReport;
      let dataExcel = [];
      let headerText = [
        {
          text:
            "รายงานข้อมูล อปท. ที่ยินยอมเผยแพร่ข้อมูลการชำระภาษี" +
            "\n" +
            "รายงาน ณ " +
            formatDateTH_full2(new Date(), true),
          style: styleTextHeaders,
        },
        {
          text: "",
          style: styleTextHeaders,
        },
      ];

      //หัวรายงาน
      for (let i = 0; i < headerText.length; i++) {
        dataExcel.push([
          { value: headerText[i].text, style: headerText[i].style },
        ]);
      }

      // ADD Headers
      dataExcel.push([
        { value: "ลำดับ", style: styleHeaders, width: { wpx: 120 } },
        { value: "จังหวัด", style: styleHeaders },
        { value: "อำเภอ", style: styleHeaders },
        { value: "ตำบล", style: styleHeaders },
        { value: "ชื่อ อปท.", style: styleHeaders },
        { value: "สถานะยินยอม", style: styleHeaders },
        { value: "วันที่ยินยอม", style: styleHeaders },
      ]);

      // ADD Row
      for (let i = 0; i < dataRow.length; i++) {
        //dataExcel
        let data_status =
          dataRow[i].consent_flag === "0"
            ? "ไม่ยินยอม"
            : dataRow[i].consent_flag === "1"
            ? "ยินยอม"
            : "อยู่ระหว่างประสานงาน";
        dataExcel.push([
          { value: i + 1, style: styleBorderB_Center },
          {
            value: dataRow[i].pvnamethai ? dataRow[i].pvnamethai : "",
            style: styleBorderB,
          },
          {
            value: dataRow[i].amnamethai ? dataRow[i].amnamethai : "",
            style: styleBorderB,
          },
          {
            value: dataRow[i].tamnamethai ? dataRow[i].tamnamethai : "",
            style: styleBorderB,
          },
          {
            value: dataRow[i].opt_name ? dataRow[i].opt_name : "",
            style: styleBorderB,
          },
          { value: data_status, style: styleBorderB_Center },
          {
            value: dataRow[i].consent_date
              ? formatDateTH(dataRow[i].consent_date, false)
              : "",
            style: styleBorderB_Center,
          },
        ]);
      }
      //"xlsx"  "csv"
      exportFile(dataExcel);
      // this.handleCloseExport()
    } else {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่พบข้อมูลส่งออก");
      setLoading(false);
    }
  };

  const exportFile = (dataExcel) => {
    let filename = "ADM16_" + dateFormat(new Date(d), "yyyymmdd");

    const wb = {
      SheetNames: [filename],
      Sheets: {
        [filename]: excelSheetFromDataSet([
          {
            columns: null,
            data: dataExcel,
            merges: [{ s: { r: 1, c: 0 }, e: { r: 0, c: 6 } }],
            page: "ADM16",
          },
        ]),
      },
    };
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary",
    });
    let data = new Blob([strToArrBuffer(wbout)], {
      type: "application/octet-stream",
    });
    FileSaver.saveAs(data, filename + "." + "xlsx");
    setLoading(false);
  };

  const footerButton = () => {
    const onADM16DeleteData = () => {
      setLoading(true);
      ADM16DeleteData({
        consent_id: deleteDialog.data.consent_id,
        record_status: "D",
      }).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ลบข้อมูลสำเร็จ");
            onADM16GetDataList();
            setDeleteDialog(false);
          }
        },
        function (err) {
          setLoading(false);
          setDeleteDialog(false);
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
        onClickOk={() => onADM16DeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />

      {/* <Toast ref={(el) => toast = el} /> */}
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "กำหนดข้อมูล อปท. ที่ยินยอมเผยแพร่ข้อมูลการชำระภาษี",
              actionButton: (
                <div>
                  <Button
                    style={{ height: "35px" }}
                    label="ส่งออก Excel"
                    icon="pi pi-download"
                    onClick={() => onCreateExcelClick()}
                    className="p-button-success p-button-rounded p-button-outlined"
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
              ),
            }}
          />
        }
        body={
          <ADM16Search
            searchData={searchData}
            mock
            setSearchData={setSearchData}
            onSearch={() => onADM16GetDataList()}
            provinceList={provinceList}
            provinceListMock={(data) => setProvinceList(data)}
            amphurListMock={(data) => setAmphurList(data)}
            tambolListMock={(data) => setTambolList(data)}
          />
        }
      />

      <CustomCard>
        <ADM16List
          dataTable={dataTable}
          setDialog={setDialog}
          setDeleteDialog={setDeleteDialog}
        />
      </CustomCard>
      {dialog.dialog && (
        <ADM16Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={(e) => submitForm(e)}
          submitted={submitted}
          setSubmitted={setSubmitted}
          provinceList={provinceList}
          amphurList={amphurList}
          tambolList={tambolList}
          mock
        />
      )}

      {dialogPDF && (
        <Dialog
          header="PDF"
          visible={dialogPDF.open}
          blockScroll={true}
          maximized={true}
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

      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        textContent="คุณต้องการลบข้อมูล ใช่หรือไม่ ?"
      />
    </div>
  );
}
