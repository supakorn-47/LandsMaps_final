import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { formatDateTH2 } from "../../../utils/DateUtil";

export default function DEA02Dialog({ dialog, setDialog }) {
  // const [dialog, setDialog] = useState({ dialog: false, action: '' });

  // useEffect(() => {

  // }, [dialog.data])

  const renderFooter = () => {
    return (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
      </div>
    );
  };

  const personalFormat = (personal_id) => {
    if (personal_id === undefined) return "-";
    if (personal_id === null) return "-";
    let str = personal_id.toString();
    if (str.length < 13) return "-";
    return (
      <>
        {str.substring(0, 1) +
          "-" +
          str.substring(1, 5) +
          "-" +
          str.substring(5, 10) +
          "-" +
          str.substring(10, 12) +
          "-" +
          str.substring(12)}
      </>
    );
  };

  const returnStatus = (data) => {
    return (
      <span
        style={{
          background: data === 1 ? "#c8e6c9" : "#ffcdd2",
          color: data === 1 ? "#256029" : "#c63737",
          borderRadius: "10px",
          padding: ".25em .5rem",
          textTransform: "uppercase",
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: ".3px",
        }}
      >
        {data == 1 ? "สำเร็จ" : "ไม่สำเร็จ"}
      </span>
    );
  };

  const dialogView = () => {
    const ___label = { fontWeight: 800, textAlign: "right" };
    const ___wrapText = { wordWrap: "break-word" };
    return (
      <Dialog
        header={"รายละเอียด"}
        visible={dialog.dialog}
        style={{ width: "35vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="p-fluid"
        maximizable
      >
        <div className="p-grid">
          <div className="p-col-4" style={___label}>
            ประเภทการดำเนินการ
          </div>
          <div className="p-col-7" style={___wrapText}>
            {dialog.data.service_name}
          </div>

          <div className="p-col-4" style={___label}>
            วันที่บันทึกรายการ
          </div>
          <div className="p-col-7" style={___wrapText}>
            {formatDateTH2(dialog.data.create_dtm, false)}
          </div>

          <div className="p-col-4" style={___label}>
            IP Address
          </div>
          <div className="p-col-7" style={___wrapText}>
            {dialog.data.ip_address === null ? "-" : dialog.data.ip_address}
          </div>

          {/* <div className="p-col-4" style={___label}>
                        Mac Address
                    </div>
                    <div className="p-col-7" style={___wrapText}>
                        {dialog.data.mac_address === null ? "-" : dialog.data.mac_address}
                    </div> */}

          <div className="p-col-4" style={___label}>
            เลขประจำตัวประชาชน
          </div>
          <div className="p-col-7" style={___wrapText}>
            {personalFormat(dialog.data.personal_id)}
          </div>

          <div className="p-col-4" style={___label}>
            ชื่อ-นามสกุล
          </div>
          <div className="p-col-7" style={___wrapText}>
            {dialog.data.personal_nameth}
          </div>

          <div className="p-col-4" style={___label}>
            รายละเอียด
          </div>
          <div className="p-col-7" style={___wrapText}>
            {dialog.data.log_desc === null ? "-" : dialog.data.log_desc}
          </div>

          <div className="p-col-4" style={___label}>
            วันเวลา Request
          </div>
          <div className="p-col-7" style={___wrapText}>
            {formatDateTH2(dialog.data.request_dtm, true)}
          </div>

          <div className="p-col-4" style={___label}>
            วันเวลา Response
          </div>
          <div className="p-col-7" style={___wrapText}>
            {formatDateTH2(dialog.data.response_dtm, true)}
          </div>

          <div className="p-col-4" style={___label}>
            สถานะ
          </div>
          <div className="p-col-7">{returnStatus(dialog.data.data_status)}</div>

          <div className="p-col-4" style={___label}>
            ขนาดข้อมูล(byte)
          </div>
          <div className="p-col-7" style={___wrapText}>
            {dialog.data.data_size === null
              ? "-"
              : dialog.data.data_size
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      </Dialog>
    );
  };

  return <>{dialogView()}</>;
}
