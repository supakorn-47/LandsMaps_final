import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  formatDateTH,
  formatDateTH2,
  formatDateTH_full3,
} from "../../../utils/DateUtil";
import {
  currentPageReportTemplate,
  paginatorTemplate,
  rowsPerPageOptions,
} from "../../../utils/TableUtil";
import "./index.css";

export default function MSM36List({ dataTable, onGetDataList, showMessages }) {
  let styleSpan = useStyleSpan();
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <Button
          style={{ height: "35px" }}
          label="Reload"
          icon="pi pi-refresh"
          onClick={() => onGetDataList()}
          className="p-button-rounded __buttonReload"
        />
        {/* <Button label="Monitor Workload (LandsMaps)" icon="pi pi-cog" onClick={() => onClickAPI('LandsMaps')} className=" p-button-rounded" style={{ marginLeft: 5, height: '35px' }} />
                <Button label="Monitor Workload (Exchange)" icon="pi pi-cog" onClick={() => onClickAPI('Exchange')} className="p-button-info p-button-rounded" style={{ marginLeft: 5, height: '35px' }} /> */}
      </span>
      <span className="p-input-icon-left">
        {/* <i className="pi pi-search" /> */}
        {/* <InputText type="search" placeholder="ค้นหา" style={{ height: '38px', width: 400 }} onInput={(e) => setGlobalFilter(e.target.value)} /> */}
      </span>
    </div>
  );

  const onClickAPI = (API) => {
    let a = document.createElement("a");
    if (API === "LandsMaps") {
      a.href = "http://172.16.43.124:30004/kiali/";
      a.target = "_blank";
      a.click();
    } else {
      a.href = "http://172.16.43.127:30004/kiali/";
      a.target = "_blank";
      a.click();
    }
  };

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: datavalue == 1 ? "#c8e6c9" : "#ffcdd2",
            color: datavalue == 1 ? "#256029" : "#c63737",
            ...styleSpan,
          }}
        >
          {datavalue == 1 ? "Running" : "Failed"}
        </span>
      </div>
    );
  };

  const formatDate = (data, key) => {
    return <>{formatDateTH_full3(data[key], true)}</>;
  };

  const actionUrl = (rowdata) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => onChangeUrl(rowdata.servicE_URL)}
          label=""
          className="p-button-rounded p-button-info"
          tooltip="คลิกเพื่อ ตรวจสอบ Service"
          tooltipOptions={{ position: "top" }}
          style={{ height: 33, fontSize: 14 }}
          icon="pi pi-search"
        />
      </div>
    );
  };

  const onChangeUrl = (url) => {
    try {
      window.open(
        url,
        "_blank",
        "height=800,width=800,left=0,top=0,resizable=yes,scrollbars=yes,menubar=no,location=no,directories=no, status=yes"
      );
    } catch (error) {
      showMessages("warn", `เกิดข้อผิดพลาด`, "ไม่สามารถเปิดได้");
    }
  };

  return (
    <div>
      <DataTable
        // ref={(el) => dt = el}
        value={dataTable}
        dataKey="id"
        paginator
        rows={50}
        rowsPerPageOptions={rowsPerPageOptions()}
        paginatorTemplate={paginatorTemplate()}
        currentPageReportTemplate={currentPageReportTemplate()}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        className="p-datatable-responsive-demo"
        autoLayout
        rowHover
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ textAlign: "center", width: "4%" }}
        />
        <Column
          field="loG_MONITOR_NAME"
          header="ชื่อโปรแกรม"
          style={{ width: "15%" }}
        />
        {/* <Column field="log_monitor_ip" header="หมายเลขเครื่อง" style={{ width: '10%', textAlign: 'center' }} /> */}
        <Column
          field="requesT_DTM"
          header="วันเวลา Request"
          body={(e) => formatDate(e, "request_dtm")}
          style={{ textAlign: "center", width: "15%" }}
        />
        <Column
          field="responsE_DTM"
          header="วันเวลา Response"
          body={(e) => formatDate(e, "response_dtm")}
          style={{ textAlign: "center", width: "15%" }}
        />
        <Column
          field="responsE_TIME"
          header="Response Time(s)"
          style={{ textAlign: "center", width: "11%" }}
        />
        <Column
          field="responsE_STATUS"
          header="สถานะ"
          body={(e) => returnStatus(e, "responsE_STATUS")}
          style={{ width: "8%" }}
        />
        <Column
          field="service_url"
          header="ตรวจสอบ Service"
          body={(e) => actionUrl(e)}
          style={{ wordWrap: "break-word", width: "10%" }}
        />
        <Column
          field="loG_DESC"
          header="รายละเอียด"
          style={{ wordWrap: "break-word" }}
        />
        {/* <Column header="รายละเอียด" body={actionBodyView} style={{ width: '6%' }}></Column> */}
      </DataTable>
    </div>
  );
}
function useStyleSpan() {
  return {
    borderRadius: "10px",
    padding: ".25em .5rem",
    // textTransform: 'uppercase',
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: ".3px",
  };
}
