import React, { useState, useMemo } from "react";
import ServiceChart from "./ServiceChart";
import { DepartmentFilter } from "./DepartmentFilter";
import { SummaryCard } from "../../DEA/DEAMOCK02/SummaryCard";
import "../../DEA/DEAMOCK02/SummaryOverview.css";
export default function DGR04Chart({
  averageCostPerService,
  totalCost,
  totalServices,
  totalUsage,
  allServices,
  selectedDepartment,
}) {
  const getSelectedDepartmentName = () =>
    selectedDepartment === "all" ? "ทุกหน่วยงาน" : selectedDepartment;

  return (
    <div className="flex-box">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 
        <DepartmentFilter
          departments={departments}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
        /> */}

        <div className="p-nogutter summary-grid" style={{ margin: "16px 0px" }}>
          <SummaryCard
            title="จำนวน Service"
            value={totalServices}
            description={`จาก ${getSelectedDepartmentName()}`}
          />
          <SummaryCard
            title="การใช้งานรวม"
            value={totalUsage}
            description="ครั้งทั้งหมด"
          />
          <SummaryCard
            title="ค่าใช้จ่ายรวม"
            value={`฿${totalCost.toLocaleString()}`}
            description="บาทไทย"
          />
          <SummaryCard
            title="ค่าใช้จ่ายเฉลี่ย"
            value={`฿${Math.round(averageCostPerService).toLocaleString()}`}
            description="ต่อ service"
          />
        </div>

        <div className="w-full">
          <ServiceChart
            data={allServices}
            title={`Services - ${getSelectedDepartmentName()}`}
          />
        </div>

        {allServices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>ไม่พบข้อมูล service สำหรับหน่วยงานที่เลือก</p>
          </div>
        )}
      </div>
    </div>
  );
}
