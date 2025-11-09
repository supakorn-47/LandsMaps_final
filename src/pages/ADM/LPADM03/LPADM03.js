import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Loading } from "../../../components/Loading/Loading";
import LPADM03Search from "./LPADM03Search";
import LPADM03List from "./LPADM03List";
import LPADM03Services from "../../../service/ServiceADM/ServiceLPADM03";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function LPADM03() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    announce_date_from: "",
    announce_date_to: "",
    announce_type: "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    data: null,
  });

  const [fileDialog, setFileDialog] = useState({
    open: false,
    data: [],
  });

  useEffect(() => {
    onLPADM03GetDataList();
  }, []);
  const onLPADM03GetDataList = async () => {
    setLoading(true);
    try {
      const res = await LPADM03Services.GetDataList(searchData);
      const data =
        Array.isArray(res?.result) && res.result.length > 0
          ? res.result
          : Array.isArray(res?.result?.data)
          ? res.result.data
          : [];

      if (res?.status === 200 && data.length > 0) {
        const temp = data.map((element, index) => ({
          ...element,
          index: index + 1,
        }));
        setDataTable(temp);
      } else {
        showMessages(
          "warn",
          "ไม่พบข้อมูล",
          `สถานะตอบกลับ: ${res?.status || "-"}`
        );
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

  // ✅ โหลดไฟล์แนบ/รูปภาพ (ป้องกัน ORA-00904)
  const onViewFileClick = async (rowData) => {
    setLoading(true);
    try {
      const res = await LPADM03Services.GetAnnounceFileList({
        announce_seq: rowData.announce_seq,
      });

      const msg = res?.errors?.message || "";
      const isORAError =
        msg.includes("ORA-00904") || msg.includes("invalid identifier");

      if (res?.status === 404 && isORAError) {
        // 🔸 ถ้า backend พัง ให้แสดงไฟล์จาก state เดิมแทน
        showMessages(
          "warn",
          "ไม่สามารถโหลดไฟล์แนบได้",
          "ข้อมูลไฟล์แนบไม่พร้อมใช้งาน"
        );
        return;
      }

      const files = Array.isArray(res?.result) ? res.result : [];
      setFileDialog({ open: true, data: files });
    } catch (err) {
      showMessages("error", "โหลดไฟล์แนบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันลบข้อมูล
  const onDelete = async () => {
    if (!deleteDialog?.data) return;
    setLoading(true);
    try {
      await LPADM03Services.DeleteData({
        announce_seq: deleteDialog.data.announce_seq,
      });
      showMessages("success", "ลบข้อมูลสำเร็จ");
      setDeleteDialog({ open: false, data: null });
      onLPADM03GetDataList();
    } catch (err) {
      {showMessages(
        "error",
        "ลบไม่สำเร็จ",
        err?.response?.data?.message || err.message
      );}
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toast แจ้งเตือน
  const showMessages = (severity = "error", summary = "", detail = "") => {
 
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />

      {/* ✅ ส่วนค้นหา */}
      <CustomCard
        title={<PageHeader config={{ title: "ข่าวประกาศ" }} />}
        body={
          <LPADM03Search
            searchData={searchData}
            setSearchData={setSearchData}
            onSearch={onLPADM03GetDataList}
          />
        }
      />

      {/* ✅ ตารางรายการ */}
      <CustomCard>
        <LPADM03List
          dataTable={dataTable}
          setDataTable={setDataTable}
          onReload={onLPADM03GetDataList}
          setDeleteDialog={setDeleteDialog}
          onViewFileClick={onViewFileClick} // ✅ เพิ่มฟังก์ชันดูไฟล์
        />
      </CustomCard>

      {/* ✅ Dialog ลบ */}
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
              onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            />
            <Button
              label="ตกลง"
              icon="pi pi-check"
              className="p-button-info"
              onClick={onDelete}
            />
          </div>
        }
      >
        <p>คุณต้องการลบรายการนี้ใช่หรือไม่?</p>
      </Dialog>

      {/* ✅ Dialog แสดงไฟล์แนบ/รูปภาพ */}
      <Dialog
        header="ไฟล์แนบ / รูปภาพ"
        visible={fileDialog.open}
        style={{ width: "60vw" }}
        modal
        onHide={() => setFileDialog({ ...fileDialog, open: false })}
      >
        {fileDialog.data.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {fileDialog.data.map((file, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                {file.file_type === "IMAGE" ? (
                  <img
                    src={`data:image/png;base64,${file.file_data}`}
                    alt={file.file_name}
                    width="150"
                    style={{
                      borderRadius: "6px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : (
                  <a
                    href={`data:application/pdf;base64,${file.file_data}`}
                    download={file.file_name}
                  >
                    {file.file_name}
                  </a>
                )}
                <p style={{ marginTop: ".5rem" }}>{file.file_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            ไม่พบไฟล์แนบหรือระบบไม่สามารถโหลดข้อมูลได้
          </p>
        )}
      </Dialog>
    </div>
  );
}
