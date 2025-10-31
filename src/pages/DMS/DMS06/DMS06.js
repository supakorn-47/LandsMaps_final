import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateAPI } from "../../../utils/DateUtil";
import { Loading } from "../../../components/Loading/Loading";
import {
  formatDateTH,
  formatDateTH2,
  formatDateTH_full2,
} from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import DMS06Search from "./DMS06Search";
import DMS06List from "./DMS06List";

//SERVICE
import { DMS06GetDataList } from "../../../service/ServiceDMS/ServiceDMS06";
import {
  masterService,
  masterGenSpreadsheet,
} from "../../../service/ServiceMaster/MasterService";

//PDF
import {
  generateTableDMS6,
  generatePdfOpenNewTab,
} from "../../../utils/PDFMakeUtil";

//EXCEL
import { URL_API_EXPORT } from "../../../service/Config";

export default function DMS06() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  // SEARCH
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  const [searchData, setSearchData] = useState({
    start_date: date,
    end_date: new Date(),
    source_seq: "-1",
    transfer_data_group_seq: "-1",
    source_schema: "-1",
  });
  const [sourceList, setSourceList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [selectedTF, setSelectedTF] = useState([]);

  const onDMS06GetDataList = () => {
    let transfer_data_group_seq = "-1";
    let index = 1;
    if (selectedTF !== null && selectedTF !== "" && selectedTF !== undefined) {
      transfer_data_group_seq = "";
      selectedTF.forEach((element) => {
        if (selectedTF.length === index || selectedTF.length === 1) {
          transfer_data_group_seq += element + "";
        } else {
          transfer_data_group_seq += element + ",";
        }
        index++;
      });
    }
    setLoading(true);
    let data = {
      start_date:
        searchData.start_date !== ""
          ? formatDateAPI(searchData.start_date, false)
          : "",
      end_date:
        searchData.end_date !== ""
          ? formatDateAPI(searchData.end_date, false)
          : "",
      source_seq:
        searchData.source_seq === "0" ? 0 : parseInt(searchData.source_seq),
      transfer_data_group_seq: transfer_data_group_seq,
      source_schema: searchData.source_schema + "",
    };
    DMS06GetDataList(data).then(
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
            res.message
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

  useEffect(() => {
    onDMS06GetDataList();

    masterService("GetDataSource?mode=0&source_process=1", {}, "GET").then(
      (res) => {
        setSourceList(res.result);
        setLoading(false);
      },
      function (err) {
        setLoading(false);
      }
    );

    // masterService("GetTransferDataGroup?mode=0", {}, "GET")
    //     .then(res => {
    //         let temp = res.result;
    //         temp.splice(0, 1);
    //         setTableList(temp);
    //         setLoading(false);
    //     }, function (err) {
    //         setLoading(false);
    //     });
    onGetTransferDataGroup();
  }, []);

  const onGetTransferDataGroup = (source_schema = "") => {
    masterService(
      `GetTransferDataGroup?mode=1&source_schema=${source_schema}`,
      {},
      "GET"
    ).then((res) => {
      let temp = res.result;
      temp.splice(0, 1);
      setTableList(temp);
      // setMsDataTransferGroup(res.result);
    });
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
    // setLoading(true)
    let data = dataTable;
    let _arr = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        _arr.push([
          {
            text: data[i].order_no,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: formatDateTH2(data[i].log_start_dtm, false),
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].source_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].source_schema,
            style: { fontSize: 12 },
          },
          {
            text: data[i].transfer_data_group_name,
            style: { fontSize: 12 },
          },
          {
            text: data[i].source_record
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            style: { alignment: "right", fontSize: 12 },
          },
          {
            text: data[i].total_record
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            style: { alignment: "right", fontSize: 12 },
          },
          {
            text: data[i].schedule_mode,
            style: { alignment: "center", fontSize: 12 },
          },
          {
            text: data[i].transfer_process_status,
            style: { alignment: "center", fontSize: 12 },
          },
        ]);
      }
      var content = {
        pageOrientation: "landscape",
        pageSize: "A4",
        content: [generateTableDMS6(searchData, _arr)],
        pageMargins: [20, 20, 20, 40],
        style: "tableExample",
        // styles: styles
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
      // let record_status = element.transfer_process_status === 'N' ? "ใช้งาน" : "ไม่ใช้งาน"
      _exportData.push({
        index: index,
        log_start_dtm: formatDateTH2(element.log_start_dtm, false),
        source_name: element.source_name,
        source_schema: element.source_schema,
        transfer_data_group_name: element.transfer_data_group_name,
        source_record: numberWithCommas(element.source_record),
        total_record: numberWithCommas(element.total_record),
        schedule_mode: element.schedule_mode,
        transfer_process_status: element.transfer_process_status,
      });
      index++;
    });

    let fileName = `DMS06-${new Date().getTime().toString()}.xlsx`;
    let txtHead =
      "รายงานสรุปการถ่ายโอนข้อมูล" +
      "\n" +
      formatDateTH_full2(searchData.start_date) +
      " ถึง " +
      formatDateTH_full2(searchData.end_date);
    let json_data = {
      nameTemplate: "DMS06",
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
    await masterGenSpreadsheet("spreadsheet", json_data).then((response) => {
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

  const numberWithCommas = (data) => {
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        <Toast ref={toast} position="top-right" />
        <DMS06Search
          searchData={searchData}
          setSearchData={setSearchData}
          sourceList={sourceList}
          tableList={tableList}
          onDMS06GetDataList={onDMS06GetDataList}
          selectedTF={selectedTF}
          setSelectedTF={setSelectedTF}
          onGetTransferDataGroup={onGetTransferDataGroup}
        />

        <DMS06List dataTable={dataTable} />
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
    </>
  );
}
