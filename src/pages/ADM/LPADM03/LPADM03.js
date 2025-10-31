import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";

//PAGE
import LPADM03Search from "./LPADM03Search";
import LPADM03List from "./LPADM03List";

//SERVICE
// import { LPADM03GetDataList } from "../../../service/ServiceADM/ServiceLPADM03";
import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";

//PDF
// import {
//   generatePdfOpenNewTab,
//   generateTableLPADM03,
// } from "../../../utils/PDFMakeUtil";

//EXCEL
import * as FileSaver from "file-saver";
import XLSX from "xlsx"; // เปลี่ยนจาก tempa-xlsx เป็น xlsx
import {
  strToArrBuffer,
  excelSheetFromAoA,
  excelSheetFromDataSet,
} from "../../../utils/dataHelpers";

import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

var dateFormat = require("dateformat");

export default function LPADM03() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog PDF state ต้องเริ่มต้นแบบ object
  const [dialogPDF, setDialogPDF] = useState({ open: false, pdfURL: null });

  // SEARCH
  const [searchData, setSearchData] = useState({
    otp_dtm_from: new Date(),
    otp_dtm_to: new Date(),
  });

  useEffect(() => {
    onLPADM03GetDataList();
  }, []);

  const onLPADM03GetDataList = () => {
    setLoading(true);
    LPADM03GetDataList(searchData).then(
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
          setDataTableReport(
            res.result.sort((a, b) =>
              new Date(a.otp_dtm) < new Date(b.otp_dtm) ? 1 : -1
            )
          );
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            `${res.errors?.message || ""}`
          );
        }
      },
      function (err) {
        if (err.response?.data?.status === 401) {
          alert(
            JSON.stringify(
              "เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่"
            )
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response?.data || err));
        }
        setLoading(false);
      }
    );
  };
const LPADM03GetDataList = (searchData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        result: [
          {
            otp_dtm: new Date(),
            otp_expire: new Date(),
            ref_code: "REF001",
            otp: "123456",
            to_email: "test@example.com",
            otp_status: 1,
          },
          {
            otp_dtm: new Date(),
            otp_expire: new Date(),
            ref_code: "REF002",
            otp: "654321",
            to_email: "user@example.com",
            otp_status: 0,
          },
        ],
      });
    }, 500);
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

                   

  const availableExportedData = (type = "excel") => {
    if (type === "excel") {
      return dataTable?.length > 0;
    } else if (type === "pdf") {
      return dataTableReport?.length > 0;
    }
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />

      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "ข่าวประกาศ",
            }}
          />
        }
        body={
          <LPADM03Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={() => onLPADM03GetDataList()}
          />
        }
      />
      <CustomCard>
        <LPADM03List dataTable={dataTable} />
      </CustomCard>

      {dialogPDF.open && (
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
    </div>
  );
}

