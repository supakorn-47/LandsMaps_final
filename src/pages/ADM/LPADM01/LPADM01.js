import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import {
  DialogConfirm,
  DialogDelete,
} from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Iframe from "react-iframe";
import { formatDateTH, formatDateTH_full2 } from "../../../utils/DateUtil";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";
import LPADM01Search from "./LPADM01Search";
import LPADM01List from "./LPADM01List";
import LPADM01Dialog from "./LPADM01Dialog";
import LPADM01Services from "../../../service/ServiceADM/ServiceLPADM01";
import * as FileSaver from "file-saver";
import XLSX from "tempa-xlsx";
import { URL_API_EXPORT } from "../../../service/Config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function LPADM01() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableReport, setDataTableReport] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, data: null });
  const [submitted, setSubmitted] = useState(false);
  const [First, setFirst] = useState(0);
  const [Rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dialogPDF, setDialogPDF] = useState(false);
  const [searchData, setSearchData] = useState({
    person_fullname: "",
    create_dtm_from: new Date(),
    create_dtm_to: new Date(),
    rowofpage: 10000,
  });

  const onLPADM01GetDataList = async () => {
    setLoading(true);
    try {
      const res = await LPADM01Services.LPADM01GetDataList(searchData);
      if (res?.status === 200 || res?.result) {
        setDataTable(res.result || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        showMessages("warn", "ไม่พบข้อมูล", res.errors?.message || "");
      }
    } catch (err) {
      console.error("[onLPADM01GetDataList] Error:", err);
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ อนุมัติผู้ใช้งาน
  const onApproveUser = async (rowData) => {
    try {
      setLoading(true);
      const res = await LPADM01Services.LPADM01ApproveUserData({
        register_seq: rowData.register_seq,
        approve_flag: 1,
      });
      if (res.status === 200) {
        showMessages("success", "สำเร็จ", "อนุมัติผู้ใช้งานสำเร็จ");
        onLPADM01GetDataList();
      } else {
        showMessages("error", "เกิดข้อผิดพลาด", res.errors?.message);
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };
  const onLPADM01DeleteData = async (rowData) => {
    try {
      setLoading(true);
      // ✅ ต้องส่ง register_file_seq ไม่ใช่ register_seq
      const res = await LPADM01Services.LPADM01DeleteRegisterFile(
        rowData.register_file_seq
      );
      if (res.status === 200) {
        showMessages("success", "สำเร็จ", "ลบไฟล์แนบสำเร็จ");
        onLPADM01GetDataList();
      } else {
        showMessages("error", "เกิดข้อผิดพลาด", res.errors?.message);
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
      setDeleteDialog(false);
    }
  };

  // ✅ แสดงรายการไฟล์แนบ
  const onGetFileList = async (rowData) => {
    setLoading(true);
    try {
      // ✅ ต้องส่ง register_seq ให้ API
      const res = await LPADM01Services.LPADM01GetRegisterFileList(
        rowData.register_seq
      );
      if (res.status === 200) {
        console.log("File list:", res.result);
        showMessages("info", "โหลดข้อมูลไฟล์สำเร็จ", "");
      } else {
        showMessages("warn", "ไม่พบข้อมูลไฟล์แนบ", res.errors?.message || "");
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ส่งอีเมล
  const onSendMail = async (rowData) => {
    setLoading(true);
    try {
      // ✅ API ต้องการ email เป็น query param
      const res = await LPADM01Services.LPADM01SendMail(rowData.email);
      if (res.status === 200) {
        showMessages("success", "ส่งอีเมลสำเร็จ", "");
      } else {
        showMessages("error", "เกิดข้อผิดพลาด", res.errors?.message);
      }
    } catch (err) {
      showMessages("error", "เกิดข้อผิดพลาด", err.message);
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

  const onPageChange = async (e) => {
    setFirst(e.first);
    setRows(e.rows);
    await onLPADM01GetDataList();
  };

  // ✅ โหลดข้อมูลตอนเริ่มต้น
  useEffect(() => {
    onLPADM01GetDataList();
  }, []);

  const footerButton = () => (
    <FooterButtonCenter
      onClickOk={() => onLPADM01DeleteData(deleteDialog.data.register_seq)}
      onClickCancle={() => setDeleteDialog(false)}
    />
  );

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      {/* ส่วนหัว */}
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "อนุมัติผู้ใช้งาน ",
              actionButton: (
                <div>
                  <Button
                    label="ส่งออก Excel"
                    icon="pi pi-file-excel"
                    onClick={() => showMessages("info", "ยังไม่เปิดใช้", "")}
                    className="p-button-success p-button-rounded p-button-outlined"
                  />
                </div>
              ),
            }}
          />
        }
        body={
          <LPADM01Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={onLPADM01GetDataList}
          />
        }
      />

      {/* ตารางข้อมูล */}
      <CustomCard>
        <LPADM01List
          dataTable={dataTable}
          setDialog={setDialog}
          setDeleteDialog={setDeleteDialog}
          onPageChange={onPageChange}
          First={First}
          Rows={Rows}
          totalRecords={totalRecords}
          onApproveUser={onApproveUser}
          onSendMail={onSendMail}
          onGetFileList={onGetFileList}
        />
      </CustomCard>

      {/* Dialog ลบข้อมูล */}
      {deleteDialog.open && (
        <DialogDelete
          visible={deleteDialog.open}
          header="ยืนยันการลบข้อมูล"
          modal
          footer={footerButton()}
          onHide={() => setDeleteDialog(false)}
          textContent={`คุณต้องการลบข้อมูล "${deleteDialog.data?.person_fullname}" ใช่หรือไม่ ?`}
        />
      )}
    </div>
  );
}
