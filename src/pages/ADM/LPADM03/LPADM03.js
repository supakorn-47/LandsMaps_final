import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import LPADM03Search from "./LPADM03Search";
import LPADM03List from "./LPADM03List";
import LPADM03Services from "../../../service/ServiceADM/ServiceLPADM03";
import { masterGenSpreadsheet } from "../../../service/ServiceMaster/MasterService";
import { URL_API_EXPORT } from "../../../service/Config";
import * as FileSaver from "file-saver";
import XLSX from "xlsx";
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

  const [searchData, setSearchData] = useState({
    announce_date_from: "",
    announce_date_to: "",
    announce_type: "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    data: null,
    onClickDelete: "",
  });

  useEffect(() => {
    onLPADM03GetDataList();
  }, []);

  const onLPADM03GetDataList = async () => {
    setLoading(true);
    try {
      const res = await LPADM03Services.GetDataList(searchData);
      const data = Array.isArray(res.result)
        ? res.result
        : res.result?.data || [];

      if (res?.status === 200 && data.length > 0) {
        const temp = data.map((element, index) => ({
          ...element,
          index: index + 1,
        }));

        setDataTable(temp);
        setDataTableReport(
          [...data].sort((a, b) =>
            new Date(a.announce_date_from) < new Date(b.announce_date_from)
              ? 1
              : -1
          )
        );
      } else {
        showMessages("warn", "ไม่พบข้อมูล", `สถานะตอบกลับ: ${res?.status}`);
        setDataTable([]);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        window.location.href = "/login";
      } else {
        showMessages(
          "error",
          "เกิดข้อผิดพลาด",
          err?.response?.data?.message || err.message
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity,
      summary,
      detail,
      life: 8000,
    });
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
        <LPADM03List
          dataTable={dataTable}
          setDataTable={setDataTable}
          onRefresh={onLPADM03GetDataList}
          setDeleteDialog={setDeleteDialog}
          
        />
      </CustomCard>

      {deleteDialog.open && (
        <Dialog
          header="ยืนยันการลบ"
          visible={deleteDialog.open}
          style={{ width: "30vw" }}
          modal
          onHide={() => setDeleteDialog({ ...deleteDialog, open: false })}
          footer={
            <div style={{ textAlign: "right" }}>
              <Button
                label="ยกเลิก"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() =>
                  setDeleteDialog({ ...deleteDialog, open: false })
                }
              />
              <Button
                label="ตกลง"
                icon="pi pi-check"
                className="p-button info"
                onClick={() =>
                  setDeleteDialog({ ...deleteDialog, open: false })
                }
              />
            </div>
          }
        >
          <p>คุณต้องการลบรายการนี้ใช่หรือไม่?</p>
        </Dialog>
      )}
    </div>
  );
}
