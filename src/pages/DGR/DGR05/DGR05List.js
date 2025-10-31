import React, { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import useResponsivePaginator from "../../../hooks/useResponsivePaginator";
import { DataTable } from "primereact/datatable";
import { useHistory } from "react-router-dom";
import { formatDateTH } from "../../../utils/DateUtil";

export default function DGR05List({ dataTable, setGetDataID }) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const history = useHistory();
  const {
    rows,
    pageLinkSize,
    rowsPerPageOptions,
    currentPageReportTemplate,
    paginatorTemplate,
  } = useResponsivePaginator();

  const handleClick = (rowData) => {
    history.push("/LPSTS05/Report");
    // setGetDataID(rowData.formSeq);
    setGetDataID(rowData.report);
  };
  const actionView = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          icon="pi pi-eye"
          className="p-button-rounded"
          onClick={() => handleClick(rowData)}
        ></Button>
      </div>
    );
  };
  const header = (
    <div className="table-header">
      <div className="header-left">
        {/* <Button
                  label="เพิ่มเอกสาร"
                  icon="pi pi-plus"
                  onClick={() => props.setDialog({ dialog: true, action: "ADD" })}
                  className="p-button-rounded p-button-info"
                /> */}
      </div>
      <div className="header-right">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            placeholder="ค้นหา"
            onInput={(e) => setGlobalFilter(e.target.value)}
          />
        </span>
      </div>
    </div>
  );
  return (
    <div>
      <DataTable
        value={dataTable}
        dataKey="formSeq"
        paginator
        pageLinkSize={pageLinkSize}
        rows={rows}
        paginatorTemplate={paginatorTemplate}
        rowsPerPageOptions={rowsPerPageOptions}
        currentPageReportTemplate={currentPageReportTemplate}
        emptyMessage="ไม่พบข้อมูลที่ค้นหา"
        globalFilter={globalFilter}
        header={header}
        rowHover
        scrollable
        scrollDirection="horizontal"
      >
        <Column
          field="index"
          header="ลำดับ"
          style={{ width: 80, textAlign: "center" }}
          body={(rowData) => rowData.index}
        />
        <Column
          field="formDate"
          header="วันที่สร้างแบบสำรวจ"
          body={(e) => formatDateTH(e.formDate)}
          style={{ textAlign: "center", width: 150 }}
        />
        <Column
          field="formStartDate"
          header="วันที่เริ่มต้นสำรวจ"
          body={(e) => formatDateTH(e.formStartDate)}
          style={{ textAlign: "center", width: 150 }}
        />
        <Column
          field="formFinishDate"
          header="วันที่สิ้นสุดสำรวจ"
          body={(e) => formatDateTH(e.formFinishDate)}
          style={{ textAlign: "center", width: 150 }}
        />
        <Column
          field="formNameTh"
          header="หัวข้อแบบสำรวจ(ภาษาไทย)"
          style={{ width: 300 }}
        />

        <Column
          field="formNameEn"
          header="หัวข้อแบบสำรวจ(ภาษาอังกฤษ)"
          style={{ width: 300 }}
        />
        <Column
          header="ดูลายละเอียด"
          body={actionView}
          style={{ width: 80 }}
        ></Column>
      </DataTable>
    </div>
  );
}
