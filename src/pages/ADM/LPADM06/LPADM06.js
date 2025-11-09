import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import LPADM06Search from "./LPADM06Search";
import LPADM06List from "./LPADM06List";

//SERVICE
import { LPADM06GetDataList } from "../../../service/ServiceADM/ServiceLPADM06";
import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";


var dateFormat = require("dateformat");
var d = new Date();
d.setFullYear(2564);

export default function LPADM06() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [loading, setLoading] = useState(false);

  // SEARCH
  const [searchData, setSearchData] = useState({
    otp_dtm_from: new Date(),
    otp_dtm_to: new Date(),
  });

  useEffect(() => {
    onLPADM06GetDataList();
  }, []);

  const onLPADM06GetDataList = () => {
    setLoading(true);
    LPADM06GetDataList(searchData).then(
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
            res.result.sort((a, b) => (new Date(a) < new Date(b) ? 1 : -1))
          );
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



  return (
    <>
      <Loading loading={loading} />
      <div className="datatable-crud-demo">
        {/* <Toast ref={(el) => toast = el} /> */}
        <Toast ref={toast} position="top-right" />
        <div className="" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              top: "1rem",
              left: "0",
              right: "1.5rem",
              zIndex: 1000,
            }}
          >
      
        
          </div>
          <LPADM06Search
            searchData={searchData}
            setSearchData={setSearchData}
           onSearch={onLPADM06GetDataList}
          />
          <LPADM06List dataTable={dataTable} />
        </div>
      </div>
  
    </>
  );
}
