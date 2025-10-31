import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { formatDateTH2 } from "../../../utils/DateUtil";

export default function LPSMS01Dialog({ dialog, setDialog }) {
  const ___label = { fontWeight: 800, textAlign: "right" };

  const renderFooter = () => {
    return (
      <div style={{ textAlign: "right" }}>
        <Button
          label="ปิดหน้าต่าง"
          icon="pi pi-times"
          onClick={() => setDialog(false)}
          className="p-button-secondary p-button-rounded"
        />
        {/* <Button label="ตกลง" icon="pi pi-check" onClick={() => setDialog(false)} autoFocus className="p-button-rounded" /> */}
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
          background: data === "สำเร็จ" ? "#c8e6c9" : "#ffcdd2",
          color: data === "สำเร็จ" ? "#256029" : "#c63737",
          borderRadius: "10px",
          padding: ".25em .5rem",
          textTransform: "uppercase",
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: ".3px",
        }}
      >
        {data}
      </span>
    );
  };

  const dialogView = () => {
    return (
      <Dialog
        header={"รายละเอียด"}
        visible={dialog.dialog}
        style={{ width: "35vw" }}
        footer={renderFooter()}
        onHide={() => setDialog(false)}
        blockScroll={true}
        className="modern-dialog p-fluid"
        maximizable
      >
        <div className="p-grid">
          <div className="p-col-4" style={___label}>
            JOB ID
          </div>
          <div className="p-col-7">
            {dialog.data.logTransferSeq === null
              ? "-"
              : dialog.data.logTransferSeq}
          </div>

          <div className="p-col-4" style={___label}>
            ประเภทการดำเนินการ
          </div>
          <div className="p-col-7">ถ่ายโอนข้อมูล</div>

          <div className="p-col-4" style={___label}>
            ประเภทการถ่ายโอน
          </div>
          <div className="p-col-7">
            {dialog.data.scheduleMode === null ? "-" : dialog.data.scheduleMode}
          </div>

          <div className="p-col-4" style={___label}>
            แหล่งข้อมูล
          </div>
          <div className="p-col-7">{dialog.data.sourceName}</div>
          <div className="p-col-4" style={___label}>
            วันที่บันทึกรายการ
          </div>
          <div className="p-col-7">
            {formatDateTH2(dialog.data.logEndDtm, false)}
          </div>

          {/* <div className="p-col-4" style={___label}>
                        IP Address
                    </div>
                    <div className="p-col-7">
                        {dialog.data.ip_address === null || dialog.data.ip_address === undefined ? "-" : dialog.data.ip_address}
                    </div> */}

          {/* <div className="p-col-4" style={___label}>
                        Mac Address
                    </div>
                    <div className="p-col-7">
                        {dialog.data.mac_address === null || dialog.data.mac_address === undefined ? "-" : dialog.data.mac_address}
                    </div> */}

          {/* <div className="p-col-4" style={___label}>
                        เลขประจำตัวประชาชน
                    </div>
                    <div className="p-col-7">
                        {personalFormat(dialog.data.personal_id)}
                    </div> */}

          {/* <div className="p-col-4" style={___label}>
                        ชื่อ-นามสกุล
                    </div>
                    <div className="p-col-7">
                        {dialog.data.full_name}
                    </div> */}

          <div className="p-col-4" style={___label}>
            รายละเอียด
          </div>
          <div className="p-col-7">
            {dialog.data.logDesc === null ? "-" : dialog.data.logDesc}
          </div>

          <div className="p-col-4" style={___label}>
            วันเวลา (เริ่มต้น)
          </div>
          <div className="p-col-7">
            {formatDateTH2(dialog.data.logStartDtm, true)}
          </div>

          <div className="p-col-4" style={___label}>
            วันเวลา (สิ้นสุด)
          </div>
          <div className="p-col-7">
            {formatDateTH2(dialog.data.logEndDtm, true)}
          </div>

          <div className="p-col-4" style={___label}>
            จำนวนข้อมูลต้นทาง
          </div>
          <div className="p-col-7">{dialog.data.totalRecord}</div>

          <div className="p-col-4" style={___label}>
            จำนวนข้อมูลปลายทาง
          </div>
          <div className="p-col-7">{dialog.data.totalRecord}</div>

          <div className="p-col-4" style={___label}>
            สถานะ
          </div>

          <div className="p-col-7">
            {returnStatus(dialog.data.transferProcessStatus)}
          </div>

          {/* <div className="p-col-4" style={___label}>
                        ขนาดข้อมูล(byte)
                    </div>
                    <div className="p-col-7">
                        {dialog.data.data_size === null ? "-" : dialog.data.data_size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </div> */}
        </div>
      </Dialog>
    );
  };
  return <>{dialogView()}</>;
}
