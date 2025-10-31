import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import ConsumerDialog from "./LPADM02Dialog";

import {
  formatDateTH2,
  formatDateTH_full2,
  formatDateAPI,
} from "../../../utils/DateUtil";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import LPADM02Search from "./LPADM02Search";
import LPADM02List from "./LPADM02List";
import LPADM02Dialog from "./LPADM02Dialog";

//SERVICE
import LPADM02Services from "../../../service/ServiceADM/ServiceLPADM02";
import { masterService } from "../../../service/ServiceMaster/MasterService";

import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function LPADM02() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    dialog: false,
    action: "",
    data: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const [dialogPDF, setDialogPDF] = useState({ open: false, pdfURL: null });
  const [selectedTF, setSelectedTF] = useState([]);

  // SEARCH
  const [searchData, setSearchData] = useState({
    person_fullname: "",
    register_type_seq: -1,
    department_seq: 0,
    create_dtm_from: new Date(),
    create_dtm_to: new Date(),
    province_seq: -1,
    totalRecords: 0,
    pageofnum: 0,
    rowofpage: 10000,
    source_seq: -1,
  });

  const [msDataSource, setMsDataSource] = useState([]);
  const [msDataTransferGroup, setMsDataTransferGroup] = useState([]);

  useEffect(() => {
    onGetDataList();

    // ✅ โหลดแหล่งข้อมูล (แก้ให้ไม่ซ้อน URL)
    masterService("GetDataSource?mode=0&source_process=1", {}, "GET").then(
      (res) => {
        setMsDataSource(res?.result || []);
      },
      (err) => {
        const status =
          err?.response?.data?.status || err?.response?.status || "-";
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${status}`,
          message
        );
      }
    );

    masterService("GetTransferDataGroup?mode=0", {}, "GET").then(
      (res) => {
        setMsDataTransferGroup(res?.result || []);
      },
      (err) => {
        const status =
          err?.response?.data?.status || err?.response?.status || "-";
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${status}`,
          message
        );
      }
    );
  }, []);

  const onGetTransferDataGroup = (source_schema = "") => {
    const url = `GetTransferDataGroup?mode=1&source_schema=${source_schema}`;
    masterService(url, {}, "GET").then((res) => {
      let temp = res?.result || [];
      if (temp.length > 0) temp.splice(0, 1);
      setMsDataTransferGroup(temp);
    });
  };

  const onGetDataList = () => {
    let transfer_data_group_seq = "-1";
    let index = 1;
    if (selectedTF && selectedTF.length > 0) {
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
    LPADM02Services.getDataList({
      ...searchData,
      start_date: formatDateAPI(searchData.start_date),
      end_date: formatDateAPI(searchData.end_date),
      source_seq: parseInt(searchData.source_seq ?? -1),
      transfer_data_seq: transfer_data_group_seq,
      source_schema: searchData.source_seq
        ? searchData.source_seq + ""
        : "",
    }).then(
      (res) => {
        setLoading(false);
        if (res?.status === 200) {
          setDataTable(res?.result || []);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res?.status || "-"}`,
            `${res?.errors?.message || "ไม่พบข้อมูล"}`
          );
        }
      },
      function (err) {
        setLoading(false);
        if (err?.response?.data?.status === 401) {
          alert("Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่");
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err?.response?.data || err));
        }
      }
    );
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

      {/* Header */}
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "จัดการสิทธิผู้ใช้งาน",
              actionButton: (
                <div>
                  <Button
                    style={{ height: "35px", color: "green" }}
                    label="ส่งออก Excel"
                    icon="pi pi-file-excel"
                    className="p-button-info p-button-rounded p-button-outlined"
                    tooltip="คลิกเพื่อ ส่งออก Excel"
                    tooltipOptions={{ position: "top" }}
                    disabled={dataTable.length === 0}
                  />
                  <Button
                    style={{ height: "35px", marginLeft: "5px" }}
                    label="ส่งออก PDF"
                    icon="pi pi-file-pdf"
                    className="p-button-danger p-button-rounded p-button-outlined"
                    tooltip="คลิกเพื่อ ส่งออก PDF"
                    tooltipOptions={{ position: "top" }}
                    disabled={dataTable.length === 0}
                  />
                </div>
              ),
            }}
          />
        }
        body={
          <LPADM02Search
            searchData={searchData}
            setSearchData={setSearchData}
            onGetDataList={onGetDataList}
            msDataSource={msDataSource}
            msDataTransferGroup={msDataTransferGroup}
            selectedTF={selectedTF}
            setSelectedTF={setSelectedTF}
            onGetTransferDataGroup={onGetTransferDataGroup}
          />
        }
      />

      {/* List */}
      <CustomCard>
        <LPADM02List dataTable={dataTable} setDialog={setDialog} />
      </CustomCard>

      {/* Dialog CRUD */}
      {dialog.dialog && (
        <LPADM02Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      )}

      {/* Dialog PDF */}
      {dialogPDF.open && (
        <Dialog
          header="PDF"
          visible={dialogPDF.open}
          blockScroll
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
  );
}
