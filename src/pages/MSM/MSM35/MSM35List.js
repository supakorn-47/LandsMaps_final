import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

export default function MSM35List({ dataTable, activeIndex }) {
  const [globalFilter, setGlobalFilter] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const header = (
    <div className="table-header">
      <div className="header-left"></div>
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

  const headerStyle = {
    textAlign: "center",
  };

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header="ลำดับ"
          rowSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="ตารางข้อมูล"
          rowSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="มกราคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="กุมภาพันธ์"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="มีนาคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="เมษายน"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="พฤษภาคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="มิถุนายน"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="กรกฎาคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="สิงหาคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="กันยายน"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="ตุลาคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="พฤศจิกายน"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="ธันวาคม"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
      </Row>
      <Row>
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
      </Row>
    </ColumnGroup>
  );

  let headerGroupDay = (
    <ColumnGroup>
      <Row>
        <Column
          header="ลำดับ"
          rowSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="ตารางข้อมูล"
          rowSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="00:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="01:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="02:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="03:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="04:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="05:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="06:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="07:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="08:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="09:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="10:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="11:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="12:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="13:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="14:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="15:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="16:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="17:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="18:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="19:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="20:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="21:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="22:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
        <Column
          header="23:00"
          colSpan={2}
          headerStyle={{ textAlign: "center" }}
        />
      </Row>
      <Row>
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
        <Column header="จำนวนข้อมูล" headerStyle={headerStyle} />
        <Column header="ผลต่าง" headerStyle={headerStyle} />
      </Row>
    </ColumnGroup>
  );

  const numberWithCommas = (x) => {
    if (x === null || x === undefined) {
      return <>-</>;
    }
    return <>{x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>;
  };

  const checkRenderTable = () => {
    if (activeIndex === 1) {
      return (
        <>
          <DataTable
            value={dataTable}
            dataKey="rownum"
            header={header}
            globalFilter={globalFilter}
            emptyMessage="ไม่พบข้อมูลที่ค้นหา"
            className="p-datatable-responsive-demo"
            autoLayout
            rowHover
            headerColumnGroup={headerGroup}
          >
            {/* <Column field="index" header="ลำดับ" style={{ textAlign: 'center', width: '5%' }} /> */}
            <Column
              sortable
              field="rownum"
              header="MVIEW_NAME"
              style={{ textAlign: "center" }}
            />
            <Column sortable field="table_name" header="ตารางข้อมูล" />
            <Column
              sortable
              field="m01_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m01_records)}
            />
            <Column
              sortable
              field="m01_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m01_diff_lm)}
            />
            <Column
              sortable
              field="m02_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m02_records)}
            />
            <Column
              sortable
              field="m02_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m02_diff_lm)}
            />
            <Column
              sortable
              field="m03_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m03_records)}
            />
            <Column
              sortable
              field="m03_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m03_diff_lm)}
            />
            <Column
              sortable
              field="m04_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m04_records)}
            />
            <Column
              sortable
              field="m04_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m04_diff_lm)}
            />
            <Column
              sortable
              field="m05_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m05_records)}
            />
            <Column
              sortable
              field="m05_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m05_diff_lm)}
            />
            <Column
              sortable
              field="m06_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m06_records)}
            />
            <Column
              sortable
              field="m06_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m06_diff_lm)}
            />
            <Column
              sortable
              field="m07_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m07_records)}
            />
            <Column
              sortable
              field="m07_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m07_diff_lm)}
            />
            <Column
              sortable
              field="m08_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m08_records)}
            />
            <Column
              sortable
              field="m08_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m08_diff_lm)}
            />
            <Column
              sortable
              field="m09_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m09_records)}
            />
            <Column
              sortable
              field="m09_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m09_diff_lm)}
            />
            <Column
              sortable
              field="m10_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m10_records)}
            />
            <Column
              sortable
              field="m10_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m10_diff_lm)}
            />
            <Column
              sortable
              field="m11_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m11_records)}
            />
            <Column
              sortable
              field="m11_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m11_diff_lm)}
            />
            <Column
              sortable
              field="m12_records"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m12_records)}
            />
            <Column
              sortable
              field="m12_diff_lm"
              header="จำนวนข้อมูล"
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.m12_diff_lm)}
            />
          </DataTable>
        </>
      );
    } else if (activeIndex === 2) {
      const rowExpansionTemplate = (data) => {
        return (
          <div className="orders-subtable">
            <DataTable
              value={data.subList}
              responsiveLayout="scroll"
              headerColumnGroup={headerGroup}
              autoLayout
              emptyMessage="ไม่พบข้อมูลที่ค้นหา"
              dataKey="rownum"
            >
              <Column
                sortable
                field="rownum"
                header="MVIEW_NAME"
                style={{ textAlign: "center" }}
              />
              <Column sortable field="table_name" header="MVIEW_NAME" />
              <Column
                field="m01_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m01_records)}
              />
              <Column
                field="m01_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m01_diff_lm)}
              />
              <Column
                field="m02_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m02_records)}
              />
              <Column
                field="m02_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m02_diff_lm)}
              />
              <Column
                field="m03_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m03_records)}
              />
              <Column
                field="m03_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m03_diff_lm)}
              />
              <Column
                field="m04_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m04_records)}
              />
              <Column
                field="m04_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m04_diff_lm)}
              />
              <Column
                field="m05_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m05_records)}
              />
              <Column
                field="m05_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m05_diff_lm)}
              />
              <Column
                field="m06_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m06_records)}
              />
              <Column
                field="m06_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m06_diff_lm)}
              />
              <Column
                field="m07_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m07_records)}
              />
              <Column
                field="m07_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m07_diff_lm)}
              />
              <Column
                field="m08_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m08_records)}
              />
              <Column
                field="m08_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m08_diff_lm)}
              />
              <Column
                field="m09_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m09_records)}
              />
              <Column
                field="m09_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m09_diff_lm)}
              />
              <Column
                field="m10_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m10_records)}
              />
              <Column
                field="m10_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m10_diff_lm)}
              />
              <Column
                field="m11_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m11_records)}
              />
              <Column
                field="m11_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m11_diff_lm)}
              />
              <Column
                field="m12_records"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m12_records)}
              />
              <Column
                field="m12_diff_lm"
                style={{ textAlign: "right" }}
                body={(e) => numberWithCommas(e.m12_diff_lm)}
              />
            </DataTable>
          </div>
        );
      };

      const allowExpansion = (rowData) => {
        return rowData.orders.length > 0;
      };

      return (
        <>
          <DataTable
            value={dataTable}
            dataKey="head_name"
            header={header}
            globalFilter={globalFilter}
            emptyMessage="ไม่พบข้อมูลที่ค้นหา"
            className="p-datatable-responsive-demo"
            autoLayout
            rowHover
            // headerColumnGroup={headerGroup}
            // style={{ width: '3000px' }}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            // onRowExpand={onRowExpand}
            // onRowCollapse={onRowCollapse}
            responsiveLayout="scroll"
            rowExpansionTemplate={rowExpansionTemplate}
          >
            {/* <Column field="index" header="ลำดับ" style={{ textAlign: 'center', width: '5%' }} /> */}
            <Column expander={allowExpansion} style={{ width: "3em" }} />
            <Column
              field="head_name"
              header="ปี"
              style={{ textAlign: "left" }}
            />
          </DataTable>
        </>
      );
    } else if (activeIndex === 0) {
      return (
        <>
          <DataTable
            value={dataTable}
            dataKey="rownum"
            header={header}
            globalFilter={globalFilter}
            emptyMessage="ไม่พบข้อมูลที่ค้นหา"
            className="p-datatable-responsive-demo"
            autoLayout
            rowHover
            headerColumnGroup={headerGroupDay}
          >
            {/* <Column field="index" header="ลำดับ" style={{ textAlign: 'center', width: '5%' }} /> */}
            <Column
              sortable
              field="rownum"
              header="MVIEW_NAME"
              style={{ textAlign: "center" }}
            />
            <Column sortable field="table_name" header="MVIEW_NAME" />
            <Column
              sortable
              field="h00_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h00_records)}
            />
            <Column
              sortable
              field="h00_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h00_diff_lh)}
            />
            <Column
              sortable
              field="h01_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h01_records)}
            />
            <Column
              sortable
              field="h01_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h01_diff_lh)}
            />
            <Column
              sortable
              field="h02_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h02_records)}
            />
            <Column
              sortable
              field="h02_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h02_diff_lh)}
            />
            <Column
              sortable
              field="h03_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h03_records)}
            />
            <Column
              sortable
              field="h03_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h03_diff_lh)}
            />
            <Column
              sortable
              field="h04_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h04_records)}
            />
            <Column
              sortable
              field="h04_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h04_diff_lh)}
            />
            <Column
              sortable
              field="h05_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h05_records)}
            />
            <Column
              sortable
              field="h05_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h05_diff_lh)}
            />
            <Column
              sortable
              field="h06_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h06_records)}
            />
            <Column
              sortable
              field="h06_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h06_diff_lh)}
            />
            <Column
              sortable
              field="h07_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h07_records)}
            />
            <Column
              sortable
              field="h07_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h07_diff_lh)}
            />
            <Column
              sortable
              field="h08_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h08_records)}
            />
            <Column
              sortable
              field="h08_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h08_diff_lh)}
            />
            <Column
              sortable
              field="h09_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h09_records)}
            />
            <Column
              sortable
              field="h09_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h09_diff_lh)}
            />
            <Column
              sortable
              field="h10_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h10_records)}
            />
            <Column
              sortable
              field="h10_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h10_diff_lh)}
            />
            <Column
              sortable
              field="h11_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h11_records)}
            />
            <Column
              sortable
              field="h11_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h11_diff_lh)}
            />
            <Column
              sortable
              field="h12_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h12_records)}
            />
            <Column
              sortable
              field="h12_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h12_diff_lh)}
            />

            <Column
              sortable
              field="h13_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h13_records)}
            />
            <Column
              sortable
              field="h13_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h13_diff_lh)}
            />
            <Column
              sortable
              field="h14_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h14_records)}
            />
            <Column
              sortable
              field="h14_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h14_diff_lh)}
            />
            <Column
              sortable
              field="h15_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h15_records)}
            />
            <Column
              sortable
              field="h15_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h15_diff_lh)}
            />
            <Column
              sortable
              field="h16_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h16_records)}
            />
            <Column
              sortable
              field="h16_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h16_diff_lh)}
            />
            <Column
              sortable
              field="h17_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h17_records)}
            />
            <Column
              sortable
              field="h17_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h17_diff_lh)}
            />
            <Column
              sortable
              field="h18_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h18_records)}
            />
            <Column
              sortable
              field="h18_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h18_diff_lh)}
            />
            <Column
              sortable
              field="h19_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h19_records)}
            />
            <Column
              sortable
              field="h19_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h19_diff_lh)}
            />
            <Column
              sortable
              field="h20_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h20_records)}
            />
            <Column
              sortable
              field="h20_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h20_diff_lh)}
            />
            <Column
              sortable
              field="h21_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h21_records)}
            />
            <Column
              sortable
              field="h21_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h21_diff_lh)}
            />
            <Column
              sortable
              field="h22_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h22_records)}
            />
            <Column
              sortable
              field="h22_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h22_diff_lh)}
            />
            <Column
              sortable
              field="h23_records"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h23_records)}
            />
            <Column
              sortable
              field="h23_diff_lh"
              header=""
              style={{ textAlign: "right" }}
              body={(e) => numberWithCommas(e.h23_diff_lh)}
            />
          </DataTable>
        </>
      );
    }
  };

  return <div className="datatable-responsive-demo">{checkRenderTable()}</div>;
}
