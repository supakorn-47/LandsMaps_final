import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import ADM13Search from "./ADM13Search";
import ADM13List from "./ADM13List";

//SERVICE
import {
  ADM13GetDataList,
  GetLogList,
  downloadFile,
} from "../../../service/ServiceADM/ServiceADM13";
import { masterService } from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateTableADM13,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";

import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";
import { monthNamesTH } from "../../../utils/DateUtil";

var dateFormat = require("dateformat");
var d = new Date();
d.setFullYear(2564);

export default function ADM13() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataViewLogDetail, setDataViewLogDetail] = useState({
    open: false,
    rowData: [],
    result: [],
  });
  const [dialogPDF, setDialogPDF] = useState(false);
  const [First, setFirst] = useState(0);
  const [Rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // SEARCH
  const [searchData, setSearchData] = useState({
    log_mm_from: String(new Date().getMonth() + 1).padStart(2, "0"),
    log_mm_to: String(new Date().getMonth() + 1).padStart(2, "0"),
    log_year: "" + (new Date().getFullYear() + 543),
    province_seq: -1,
    amphur_seq: -1,
    opt_seq: "-1",
    wp_mcode: "-1",
    landoffice_id: "-1",
    totalRecords: 0,
    pageofnum: 0,
    rowofpage: 10000,
  });

  const [optionProvince, setOptionProvince] = useState([]);
  const [optionAmphur, setOptionAmphur] = useState([]);
  const [optionOpt, setOptionOpt] = useState([]);
  const [landOffice, setLandOffice] = useState([]);

  const ___label = { fontWeight: 800, textAlign: "right" };

  useEffect(() => {
    onGetMaster();
    onADM13GetDataList();
  }, []);

  const onGetMaster = (_VALUE = 0) => {
    masterService(`GetProvince?mode=${_VALUE}`, {}, "GET").then((res) => {
      setOptionProvince(res.result);
    });
  };

  const onGetAmphur = (province_seq, _TYPE = "") => {
    if (_TYPE === "") {
      setSearchData({
        ...searchData,
        province_seq: province_seq,
        amphur: "-1",
      });
    }
    masterService(
      `GetAmphur?mode=1&province_seq=${province_seq}`,
      {},
      "GET"
    ).then((res) => {
      setOptionAmphur(res.result);
    });
  };

  const onGetOpt = (amphur_seq, _TYPE = "", _VALUE) => {
    masterService(
      `GetOpt?mode=${_TYPE !== "" ? 1 : 0}&amphur_seq=${amphur_seq}`,
      {},
      "GET"
    ).then((res) => {
      setOptionOpt(res.result);
    });
  };

  const onProvinceChange = (province_seq, landoffice_id) => {
    masterService(
      `GetLandoffice?mode=1&province_seq=${province_seq}`,
      {},
      "GET"
    ).then((res) => {
      setLandOffice(res.result);
      setSearchData({
        ...searchData,
        province_seq: province_seq,
        landoffice_id: landoffice_id,
      });
    });
  };

  const onADM13GetDataList = () => {
    setLoading(true);
    setFirst(0);
    setRows(10);
    ADM13GetDataList(searchData).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          // let temp = [];
          // let index = 1;
          // res.result.forEach(element => {
          //     temp.push({
          //         ...element,
          //         index: index
          //     })
          //     index++;
          // });
          setDataTable(res.result);
          setDataTableReport(res.result); //รายงาน
          setTotalRecords(res.totalRecords); //จำนวนรายการ
          // setDataTableReport(res.result.sort((a, b) => new Date(a) < new Date(b) ? 1 : -1))
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
      },
      function (err) {
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
      }
    );
  };

  // LOG
  const onGetLogList = (rowData, type) => {
    setLoading(true);
    GetLogList(rowData.wp_seq, type).then(
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
          setDataViewLogDetail({
            open: true,
            rowData: rowData,
            result: res.result,
            type: type,
          });
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
      },
      function (err) {
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
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

  const numberWithCommas = (x) => {
    if (x === null || x === undefined) {
      return "-";
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const onCreatePDFClick = async () => {
    let data = dataTableReport;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let wp_reg_num = numberWithCommas(data[i].wp_reg_num);
        let wp_file_size = numberWithCommas(data[i].wp_file_size);
        let wp_zip_status = data[i].file_status === null ? "x" : "√";
        _arr.push([
          {
            text: i + 1,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].wp_mcode,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].opt_name,
            style: { alignment: "left", fontSize: 12 },
          },
          {
            text: data[i].month_year,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: wp_reg_num,
            style: { alignment: "right", fontSize: 12 },
          },
          {
            text: wp_zip_status,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: wp_file_size,
            style: { alignment: "right", fontSize: 12 },
          },
          {
            text:
              data[i].sendmail_status === null
                ? "ไม่ได้ดำเนินการ"
                : data[i].sendmail_status,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].wp_sendmail_by,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].wp_sendmail_date,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text:
              data[i].download_status === null
                ? "ไม่ได้ดำเนินการ"
                : data[i].download_status,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].wp_download_by,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].wp_download_date,
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }
      let txtHead =
        "รายงานตรวจสอบสถานะข้อมูล" +
        "\nเดือน " +
        monthNamesTH()[parseInt(searchData.log_mm_from) - 1].label +
        " ถึง " +
        monthNamesTH()[parseInt(searchData.log_mm_to) - 1].label +
        " ปี " +
        searchData.log_year;
      var content = {
        pageOrientation: "landscape",
        pageSize: "A4",
        content: [generateTableADM13(searchData, _arr, txtHead)],
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
    dataTableReport.forEach((element) => {
      let wp_reg_num = numberWithCommas(element.wp_reg_num);
      let wp_file_size = numberWithCommas(element.wp_file_size);
      let wp_zip_status = element.file_status === null ? "x" : "√";
      _exportData.push({
        index: index,
        wp_mcode: element.wp_mcode === null ? "" : element.wp_mcode,
        opt_name: element.opt_name === null ? "" : element.opt_name,
        month_year: element.month_year === null ? "" : element.month_year,
        wp_reg_num: wp_reg_num,
        wp_zip_status: wp_zip_status,
        wp_file_size: wp_file_size,
        sendmail_status:
          element.sendmail_status === null ? "" : element.sendmail_status,
        wp_sendmail_by:
          element.wp_sendmail_by === null ? "" : element.wp_sendmail_by,
        wp_sendmail_date:
          element.wp_sendmail_date === null ? "" : element.wp_sendmail_date,
        download_status:
          element.download_status === null ? "" : element.download_status,
        wp_download_by:
          element.wp_download_by === null ? "" : element.wp_download_by,
        wp_download_date:
          element.wp_download_date === null ? "" : element.wp_download_date,
      });
      index++;
    });

    let fileName = `ADM13-${new Date().getTime().toString()}.xlsx`;
    let txtHead =
      "รายงานตรวจสอบสถานะข้อมูล" +
      "\nเดือน " +
      monthNamesTH()[parseInt(searchData.log_mm_from) - 1].label +
      " ถึง " +
      monthNamesTH()[parseInt(searchData.log_mm_to) - 1].label +
      " ปี " +
      searchData.log_year;
    let json_data = {
      nameTemplate: "ADM13",
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

  const numberWithCommasRender = (x) => {
    if (x === null || x === undefined) {
      return <>-</>;
    }
    return <>{x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>;
  };

  const onDownloadFile = (wp_seq) => {
    setLoading(true);
    downloadFile(wp_seq).then(
      (res) => {
        setLoading(false);
        // window.open(res, '_blank');
        let arr = res.split("/");
        //! Download
        fetch(res).then((response) => {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = arr[arr.length - 1];
            a.click();

            //? Get all list
            onADM13GetDataList();
          });
        });
      },
      function (err) {
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
      }
    );
  };

  //Nextpage
  const onPageChange = (e) => {
    setLoading(true);
    setFirst(e.first);
    setRows(e.rows);

    let search_data = {
      ...searchData,
      pageofnum: e.first,
      rowofpage: e.rows,
      totalRecords: totalRecords,
    };

    ADM13GetDataList(search_data).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          setDataTable(res.result);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors.message}`
          );
        }
      },
      function (err) {
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        {/* <Toast ref={(el) => toast = el} /> */}
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
                tooltip={
                  "คลิกเพื่อ ส่งออก Excel" +
                  "\n" +
                  "(ข้อมูลไม่เกิน 10,000 รายการ)"
                }
                tooltipOptions={{ position: "top" }}
              />
              <Button
                style={{ height: "35px", marginLeft: "5px" }}
                label="ส่งออก PDF"
                icon="pi pi-file-pdf"
                onClick={() => onCreatePDFClick()}
                className="p-button-danger p-button-rounded p-button-outlined"
                tooltip={
                  "คลิกเพื่อ ส่งออก PDF" +
                  "\n" +
                  "(ข้อมูลไม่เกิน 10,000 รายการ)"
                }
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
          <ADM13Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onADM13GetDataList()}
            optionProvince={optionProvince}
            optionAmphur={optionAmphur}
            optionOpt={optionOpt}
            onGetAmphur={(e) => onGetAmphur(e)}
            onGetOpt={(e) => onGetOpt(e)}
            onProvinceChange={onProvinceChange}
            landOffice={landOffice}
          />
          <ADM13List
            dataTable={dataTable}
            onGetLogList={onGetLogList}
            onPageChange={(e) => onPageChange(e)}
            First={First}
            Rows={Rows}
            totalRecords={totalRecords}
            onDownloadFile={onDownloadFile}
            // dataViewLogDetail={dataViewLogDetail}
          />
        </div>
      </div>
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

      <Dialog
        header={`สถานะ${
          dataViewLogDetail.type === "MAIL" ? "ส่งเมล" : "ดาวน์โหลด"
        } ${dataViewLogDetail.rowData.landoffice_name}`}
        visible={dataViewLogDetail.open}
        style={{ width: "35vw" }}
        // footer={renderFooter('displayBasic')}
        onHide={() =>
          setDataViewLogDetail({ open: false, rowData: [], result: [] })
        }
        blockScroll
      >
        <div>
          <div className="p-grid">
            <div className="p-col-4" style={___label}>
              ลำดับ :
            </div>
            <div className="p-col-7">{dataViewLogDetail.rowData.index}</div>

            <div className="p-col-4" style={___label}>
              มาตรา :
            </div>
            <div className="p-col-7">{dataViewLogDetail.rowData.wp_mcode}</div>

            <div className="p-col-4" style={___label}>
              สำนักงานที่ดิน :
            </div>
            <div className="p-col-7">
              {dataViewLogDetail.rowData.landoffice_name}
            </div>

            <div className="p-col-4" style={___label}>
              ชื่อ อปท. :
            </div>
            <div className="p-col-7">{dataViewLogDetail.rowData.opt_name}</div>

            <div className="p-col-4" style={___label}>
              เดือน-ปี :
            </div>
            <div className="p-col-7">
              {dataViewLogDetail.rowData.month_year}
            </div>

            <div className="p-col-4" style={___label}>
              จำนวนรายการ(เปลี่ยนแปลง) :
            </div>
            <div className="p-col-7">
              {numberWithCommasRender(dataViewLogDetail.rowData.wp_reg_num)}
            </div>

            <div className="p-col-4" style={___label}>
              ขนาดไฟล์ Zip (KB) :
            </div>
            <div className="p-col-7">
              {numberWithCommasRender(dataViewLogDetail.rowData.wp_file_size)}
            </div>
          </div>
          <br />

          {dataViewLogDetail.type === "DOWNLOAD" ? (
            <>
              <div style={{ fontWeight: 800 }}>
                รายการดาวน์โหลด {dataViewLogDetail.result.length} รายการ
              </div>
              <DataTable
                value={dataViewLogDetail.result}
                responsiveLayout="scroll"
                style={{ marginTop: "10px" }}
                rowHover
                emptyMessage="ไม่พบข้อมูลที่ค้นหา"
                className="p-datatable-responsive-demo"
                autoLayout
              >
                <Column
                  field="index"
                  header="ลำดับ"
                  headerStyle={{ width: "13%", textAlign: "center" }}
                  bodyStyle={{ textAlign: "center" }}
                ></Column>
                <Column field="wp_download_by" header="ชื่อ"></Column>
                <Column field="wp_download_date" header="วันที่"></Column>
              </DataTable>
            </>
          ) : (
            ""
          )}
          {dataViewLogDetail.type === "MAIL" ? (
            <>
              <div style={{ fontWeight: 800 }}>
                รายการส่งเมล {dataViewLogDetail.result.length} รายการ
              </div>
              <DataTable
                value={dataViewLogDetail.result}
                responsiveLayout="scroll"
                style={{ marginTop: "10px" }}
                rowHover
                emptyMessage="ไม่พบข้อมูลที่ค้นหา"
                className="p-datatable-responsive-demo"
                autoLayout
              >
                <Column
                  field="index"
                  header="ลำดับ"
                  headerStyle={{ width: "13%", textAlign: "center" }}
                  bodyStyle={{ textAlign: "center" }}
                ></Column>
                <Column field="wp_sendmail_by" header="ชื่อ"></Column>
                <Column field="wp_sendmail_date" header="วันที่"></Column>
              </DataTable>
            </>
          ) : (
            ""
          )}
        </div>
        <br />
      </Dialog>
    </>
  );
}
