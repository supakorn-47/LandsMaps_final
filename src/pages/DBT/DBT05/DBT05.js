import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";

//PAGE
import DBT05Search from "./DBT05Search";
import DBT05List from "./DBT05List";
import DBT05Dialog from "./DBT05Dialog";

//SERVICE
import {
  DBT05GetDataList,
  DBT05CreateData,
  DBT05UpdateData,
  DBT05RunProcess,
} from "../../../service/ServiceDBT/ServiceDBT05";
import { masterService } from "../../../service/ServiceMaster/MasterService";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function DBT05() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [searchData, setSearchData] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [submitted, setSubmitted] = useState(false);
  // MS
  const [msDataSource, setMsDataSource] = useState([]);
  const [msSchema, setMsSchema] = useState([
    { label: "DOL_PIPR_TRANSACTION", value: "0" },
  ]);
  const [msDataTable, setMsDataTable] = useState([]);
  const [msDataScale, setMsDataScale] = useState([]);
  const [msDataScalePage, setMsDataScalePage] = useState([]);
  const [optionProvince, setOptionProvince] = useState([]);
  const [optionDistrict, setOptionDistrict] = useState([]);
  const [idProvince, setIdProvince] = useState();
  // console.log(idProvince);

  const onDBT05GetDataList = () => {
    setLoading(true);
    DBT05GetDataList(searchData)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              source_schema: "DOL_PIPR_TRANSACTION",
              index: index,
            });
            index++;
          });
          setDataTable(temp);
        } else {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${res.status}`,
            res.message
          );
        }
      })
      .catch((err) => {
        setLoading(false);

        if (err?.response?.data?.status === 401) {
          alert("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่");
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err?.response?.data || err));
        }

        // หรือใช้ showMessages ถ้าต้องการให้ user-friendly
        // showMessages("error", "เกิดข้อผิดพลาด", err.message);
      });
  };

  useEffect(() => {
    onDBT05GetDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    masterService("GetLandDataTable/1/1", {}, "GET").then(
      (res) => {
        setMsDataTable(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );

    masterService("GetLandDataSource/1/1", {}, "GET").then(
      (res) => {
        setMsDataSource(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );

    masterService("GetLandUTMScale", {}, "GET").then(
      (res) => {
        setMsDataScale(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
    //เพิ่มการgetData จังหวัดและ อำเภแ
    masterService("GetLandProvince", {}, "GET").then(
      (res) => {
        setOptionProvince(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
    if (idProvince) {
      const queryString = `${idProvince}`;
      masterService(`GetLandAmphoe/${queryString}`, {}, "GET").then(
        (res) => {
          setOptionDistrict(res.result);
        },
        function (err) {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );}else{
         masterService(
        `GetLandAmphoe/0`,
        {  },
        "GET"
      ).then(
        (res) => {
          setOptionDistrict(res.result);
        },
        function (err) {
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    }
  }, [idProvince]);

  const validation = (object) => {
    let showerror = false;
    for (const property in object) {
      if (
        property === "source_seq" ||
        property === "source_schema" ||
        property === "source_table"
      ) {
        if (
          object[property] === 0 ||
          object[property] === "กรุณาเลือก Schema"
        ) {
          showerror = true;
        }
      }
    }
    if (showerror) {
      setSubmitted(true);
      return false;
    } else {
      setSubmitted(false);
      return true;
    }
  };

  const submitForm = (submitForm) => {    
    if (dialog.action === "SAVE" && validation(submitForm)) {
      setLoading(true);
      DBT05CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              "บันทึกเงื่อนไขการดึงข้อมูลแปลงที่ดิน"
            );
            // setDataTable(res.result);
            onDBT05GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.message}`
            );
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    } else if (dialog.action === "UPDATE" && validation(submitForm)) {
      setLoading(true);
      DBT05UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages(
              "success",
              `สำเร็จ`,
              "แก้ไขเงื่อนไขการดึงข้อมูลแปลงที่ดิน"
            );
            // setDataTable(res.result);
            onDBT05GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.message}`
            );
          }
        },
        function (err) {
          setLoading(false);
          showMessages(
            "error",
            `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
            ""
          );
        }
      );
    }
  };

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const onScalePage = (scale_name) => {
    masterService("GetLandScalePage/" + scale_name, {}, "GET").then(
      (res) => {
        setMsDataScalePage(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  const onRunProcessCkick = (data) => {
    setLoading(true);
    DBT05RunProcess(data).then(
      (res) => {
        setLoading(false);
        if (res.status === 200 && res.error === false) {
          showMessages("success", `สำเร็จ`, "Run Process ข้อมูลแปลงที่ดิน");
          onDBT05GetDataList();
        }
      },
      function (err) {
        setLoading(false);
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
  };

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />

      <Toast ref={toast} position="top-right" />

      <CustomCard
        title={
          <PageHeader
            config={{
              title: "การดึงข้อมูลแปลงที่ดิน",
            }}
          />
        }
        body={
          <DBT05Search
            searchData={searchData}
            setSearchData={setSearchData}
            onDBT05GetDataList={onDBT05GetDataList}
          />
        }
      />

      <CustomCard>
        {" "}
        <DBT05List
          dataTable={dataTable}
          setDialog={setDialog}
          setDeleteDialog={setDeleteDialog}
          onRunProcessCkick={(e) => onRunProcessCkick(e)}
        />
      </CustomCard>

      {dialog && (
        <DBT05Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={(e) => submitForm(e)}
          msDataTable={msDataTable}
          msDataSource={msDataSource}
          msSchema={msSchema}
          msDataScale={msDataScale}
          msDataScalePage={msDataScalePage}
          onScalePage={onScalePage}
          optionProvince={optionProvince}
          optionDistrict={optionDistrict}
          setIdProvince={setIdProvince}
          submitted={submitted}
        />
      )}
    </div>
  );
}
