import React, { useState } from "react";
import { Button } from "primereact/button";
import { Calendars } from "../../../../components/Calendar/Calendar";

export default function ADM10Search({
  setSearchData,
  searchData,
  sourceList,
  tableList,
}) {
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-fluid p-formgrid p-grid search-wrapper">
      {/* วันที่เริ่มต้น */}
      <div className="p-field p-col-12 p-md-6 p-xl-6">
        <label>วันที่</label>
        <Calendars
          maxDate={searchData.end_date}
          value={searchData.start_date}
          dateFormat={"dd/mm/yy"}
          onChange={(e) =>
            setSearchData({ ...searchData, start_date: e.target.value })
          }
          showIcon
        />
      </div>

      {/* วันที่สิ้นสุด */}
      <div className="p-field p-col-12 p-md-6 p-xl-6">
        <label>ถึงวันที่</label>
        <Calendars
          maxDate={new Date()}
          minDate={searchData.start_date}
          value={searchData.end_date}
          dateFormat={"dd/mm/yy"}
          onChange={(e) =>
            setSearchData({ ...searchData, end_date: e.target.value })
          }
          showIcon
        />
      </div>

      {/* ปุ่มค้นหา แยกเป็นอีกแถว */}
      <div className="p-field p-col-12">
        <Button
          label="ค้นหา"
          icon="pi pi-search"
          loading={loading}
          onClick={load}
          className="p-button-info"
          style={{ width: "150px" }}
        />
      </div>
    </div>
  );
}
