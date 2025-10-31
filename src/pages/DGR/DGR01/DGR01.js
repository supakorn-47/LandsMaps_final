import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Loading } from "../../../components/Loading/Loading";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { formatDateAPI } from "../../../utils/DateUtil";
import { Accordion, AccordionTab } from "primereact/accordion";
import { getTextMenu } from "../../../utils/MenuUtil";

//PDF
import { generatePdf, generateHead_DGR01 } from "../../../utils/PDFMakeUtil";

//SERVICE
import ServiceDGR02 from "../../../service/ServiceDGR/ServiceDGR02";
import { formatDateTH2 } from "../../../utils/DateUtil";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

var dateFormat = require("dateformat");

export default function DGR01() {
  const toast = useRef(null);
  // const [dataTable, setDataTable] = useState([]);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState([]);

  //Graph
  const [graph, setGraph] = useState({ title: { text: "" } });
  // SEARCH
  let date = new Date(new Date().setDate(new Date().getDate() - 7));
  // let date = new Date()
  // date.setMinutes(date.getMinutes() - 5)
  const [searchData, setSearchData] = useState({
    request_dtm_from: date,
    request_dtm_to: new Date(),
  });

  useEffect(() => {
    onGetDataList();
  }, []);

  const onGetDataList = () => {
    setLoading(true);
    ServiceDGR02.GetDataList().then(
      (res) => {
        setLoading(false);
        if (res.status == 200 && res.result != null) {
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
          console.error(err);

          // alert(JSON.stringify(err.response.data));
        }
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

  const onCreatePDFClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={
          <PageHeader config={{ title: "รายงานธรรมาภิบาลข้อมูลภาครัฐ" }} />
        }
        body={
          <Accordion activeIndex={0}>
            {dataTable.map((value, index) => {
              return (
                <AccordionTab header={value.gdg_document_name}>
                  <div className="p-grid" style={{ marginBottom: 30 }}>
                    <div className="p-col-2" style={{ color: "blue" }}>
                      เวอร์ชันเอกสาร
                    </div>
                    <div
                      className="p-col-10"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label>{value.gdg_version}</label>
                      <Button
                        style={{ height: "35px", marginLeft: "5px" }}
                        label="ดาวน์โหลด PDF"
                        icon="pi pi-file-pdf"
                        onClick={() => onCreatePDFClick(value.gdg_file_path)}
                        className="p-button-danger p-button-rounded p-button-outlined"
                        tooltip="คลิกเพื่อ ดาวน์โหลด PDF"
                        tooltipOptions={{ position: "top" }}
                      />
                    </div>
                    <div
                      className="p-col-2"
                      style={{ marginTop: "-11px", color: "blue" }}
                    >
                      วันที่ปรับปรุงเอกสาร
                    </div>
                    <div className="p-col-10" style={{ marginTop: "-11px" }}>
                      {formatDateTH2(value.gdg_version_date, false)}
                    </div>
                    <div className="p-col-2" style={{ color: "blue" }}>
                      รายละเอียดการแก้ไขเอกสาร
                    </div>
                    <div className="p-col-10">{value.gdg_document_desc}</div>
                    <div className="p-col-2" style={{ color: "blue" }}>
                      ผู้จัดทำ
                    </div>
                    <div className="p-col-10">{value.gdg_organizer}</div>
                    <div className="p-col-2" style={{ color: "blue" }}>
                      ผู้อนุมัติ
                    </div>
                    <div className="p-col-10">{value.gdg_approver}</div>
                  </div>
                  <Iframe
                    url={value.gdg_file_path}
                    width="100%"
                    height={window.innerHeight - 110}
                    display="initial"
                    position="relative"
                  />
                </AccordionTab>
              );
            })}
          </Accordion>
        }
      />
    </div>
  );
}
