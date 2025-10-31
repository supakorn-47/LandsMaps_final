import React, { useEffect, useState } from "react";
import useDeviceType from "./useDeviceType";

const useResponsivePaginator = (options = {}) => {
  const {
    rowsConfig = {
      mobile: 5,
      tablet: 10,
      desktop: 25,
    },
    rowsPerPageOptions = {
      mobile: [5, 10],
      tablet: [5, 10, 25],
      desktop: [5, 10, 25, 50, 100],
    },
    paginatorTemplate = {
      mobile:
        "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",
      tablet:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport",
      desktop:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
    },
    currentPageReportTemplate = {
      mobile: "{first}-{last} จาก {totalRecords}",
      tablet: "{first} ถึง {last} จาก {totalRecords} รายการ",
      desktop: "กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ",
    },
    pageLinkSize = {
      mobile: 2,
      tablet: 3,
      desktop: 5,
    },
  } = options;

  const [result, setResult] = useState({
    rows: 25,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    paginatorTemplate:
      "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
    currentPageReportTemplate:
      "กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ",
    pageLinkSize: 5,
  });

  const { isMobile, isTablet, isDesktop, deviceType } = useDeviceType();

  const getCurrentConfig = () => {
    if (!deviceType) return;

    setResult({
      rows: rowsConfig[deviceType] || 25,
      rowsPerPageOptions: rowsPerPageOptions[deviceType] || [
        5, 10, 25, 50, 100,
      ],
      paginatorTemplate:
        paginatorTemplate[deviceType] ||
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
      currentPageReportTemplate:
        currentPageReportTemplate[deviceType] ||
        "กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ",
      pageLinkSize: pageLinkSize[deviceType] || 5,
    });
  };

  useEffect(() => {
    getCurrentConfig();
  }, [deviceType]);

  // console.log("result = ", result);

  return {
    ...result,
  };
};

export default useResponsivePaginator;
