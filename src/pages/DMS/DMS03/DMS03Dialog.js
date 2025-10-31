import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import { formatDateTH } from "../../../utils/DateUtil";

export default function DMS03Dialog({
  dialog,
  setDialog,
  dataTableDetail,
  returnStatus,
}) {
  const [formObject, setformObject] = useState({});

  useEffect(() => {
    if (dialog.dialogDetail === true) {
      setformObject(dialog.data);
    }
  }, [dialog.data]);

  const dialogViewJobFile = () => {
    const formatDate = (data, key) => {
      return <>{formatDateTH(data[key], true)}</>;
    };

    const footer = () => {
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

    const numberWithCommas = (rowData) => {
      return (
        <div style={{ textAlign: "right" }}>
          {rowData.total_record
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      );
    };

    if (dialog.data !== undefined) {
      return (
        <Dialog
          header={"รายละเอียด [ " + dialog.data.source_name + " ]"}
          visible={dialog.dialogDetail}
          style={{ width: "90vw" }}
          footer={footer()}
          onHide={() => setDialog(false)}
          blockScroll={true}
          className="modern-dialog"
          maximizable
          maximized
        >
          <div className="p-grid" style={{ marginBottom: 30 }}>
            <div className="p-col-12">
              <DataTable
                value={dataTableDetail}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                paginatorTemplate={paginatorTemplate()}
                currentPageReportTemplate={currentPageReportTemplate()}
                className="modern-datatable"
                paginatorClassName="modern-paginator"
              >
                <Column
                  field="order_no"
                  header="ลำดับ"
                  className="order-column"
                  style={{ width: "3.5%" }}
                ></Column>
                <Column
                  field="log_start_dtm"
                  header="วันเวลาเริ่มต้น"
                  body={(e) => formatDate(e, "log_start_dtm")}
                  className="date-column"
                  style={{ width: "7%" }}
                ></Column>
                <Column
                  field="log_end_dtm"
                  header="วันเวลาสิ้นสุด"
                  body={(e) => formatDate(e, "log_end_dtm")}
                  className="date-column"
                  style={{ width: "7%" }}
                ></Column>
                <Column
                  field="source_name"
                  header="แหล่งข้อมูล"
                  className="name-column"
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="transfer_data_group_name"
                  header="กลุ่มตาราง"
                  className="name-column"
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="transfer_data_group_process_seq"
                  header="ลำดับการทำงาน"
                  className="order-column"
                  style={{ width: "3.5%" }}
                ></Column>
                <Column
                  field="source_process"
                  header="แหล่งข้อมูลต้นทาง"
                  className="name-column"
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="source_schema"
                  header="Schema ต้นทาง"
                  className="name-column"
                  style={{ width: "6%" }}
                ></Column>
                <Column
                  field="source_table"
                  header="ตารางต้นทาง"
                  className="name-column"
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="target_process"
                  header="แหล่งข้อมูลปลายทาง"
                  className="name-column"
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="target_schema"
                  header="Schema ปลายทาง"
                  className="name-column"
                  style={{ width: "6%" }}
                ></Column>
                <Column
                  field="target_table"
                  header="ตารางปลายทาง"
                  className="name-column"
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="schedule_mode"
                  header="Schedule Mode"
                  className="type-column"
                  style={{ width: "5.5%" }}
                ></Column>
                <Column
                  body={numberWithCommas}
                  header="จำนวนข้อมูล"
                  className="order-column"
                  style={{ width: "5%" }}
                ></Column>
                <Column
                  field="transfer_process_status"
                  header="สถานะการถ่ายโอน"
                  body={(e) => returnStatus(e, "transfer_process_status")}
                  style={{ textAlign: "center", width: "6.5%" }}
                ></Column>
                <Column
                  field="log_desc"
                  header="ข้อผิดพลาด"
                  style={{ width: "5%", textAlign: "center" }}
                ></Column>
                <Column
                  field="log_path"
                  header="Log Path"
                  style={{ width: "7%", textAlign: "center" }}
                ></Column>
              </DataTable>
            </div>
          </div>
        </Dialog>
      );
    }
  };

  return <>{dialogViewJobFile()}</>;
}
