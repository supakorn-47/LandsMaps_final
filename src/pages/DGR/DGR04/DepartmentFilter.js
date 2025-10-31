import React from "react";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
export function DepartmentFilter({
  departments,
  selectedDepartment,
  onDepartmentChange,
}) {
  const departmentOptions = [
    { label: "ทั้งหมด", value: "all" },
    ...departments.map((dept) => ({
      label: dept.department_name_th,
      value: dept.department_name_th,
    })),
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <h4 className="text-sm font-medium">เลือกหน่วยงาน:</h4>
        <div className="w-full sm:w-80">
          <Dropdown
            value={selectedDepartment}
            options={departmentOptions}
            onChange={(e) => onDepartmentChange(e.value)}
            placeholder="เลือกหน่วยงาน"
            className="w-full"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedDepartment === "all"
            ? `แสดงข้อมูลจาก ${departments.length} หน่วยงาน`
            : "แสดงข้อมูลหน่วยงานที่เลือก"}
        </div>
      </div>
    </Card>
  );
}
