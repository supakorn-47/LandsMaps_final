import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";

//PAGE
import DBT03Search from "./DBT03Search";
import DBT03List from "./DBT03List";
import DBT03Dialog from "./DBT03Dialog";

//SERVICE
import {
  DBT03GetDataList,
  DBT03GetDetail,
  DBT03RunProcess,
} from "../../../service/ServiceDBT/ServiceDBT03";
import { masterService } from "../../../service/ServiceMaster/MasterService";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function DBT03() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataTableDetail, setDataTableDetail] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });

  // SEARCH
  const [searchData, setSearchData] = useState({
    start_date: new Date(),
    end_date: new Date(),
    source_seq: "0",
    transfer_data_group_seq: "0",
  });

  const [msSearchSource, setMsSearchSource] = useState([]);
  const [msDataTable, setMsDataTable] = useState([]);

  useEffect(() => {
    masterService("GetLandDataSource/0/1", {}, "GET").then(
      (res) => {
        setMsSearchSource(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
    masterService("GetTransfer_Data_Group/0", {}, "GET").then(
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
  }, []);

  const onDBT03GetDataList = () => {
    setLoading(true);
    DBT03GetDataList(searchData).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
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
      },
      function (err) {
        setLoading(false);
        if (err.response.data.status == 401) {
          alert(
            JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
          );
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err.response.data));
        }

        // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
      }
    );
  };

  useEffect(() => {
    onDBT03GetDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDBT03GetDetailClick = (rowData) => {
    setLoading(true);
    DBT03GetDetail(rowData).then(
      (res) => {
        setDialog({ dialogDetail: true, data: rowData });
        setLoading(false);
        if (res.status === 200) {
          let temp = [];
          let index = 1;
          res.result.forEach((element) => {
            temp.push({
              ...element,
              index: index,
            });
            index++;
          });
          setDataTableDetail(temp);
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

  const onRunProcessClick = (value) => {
    setLoading(true);
    DBT03RunProcess(value).then(
      (res) => {
        if (res.result === true) {
          showMessages("success", `สำเร็จ`, "Run การถ่ายโอนข้อมูล");
          onDBT03GetDataList();
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

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 8000,
    });
  };

  const returnStatus = (rowData, checkColumn) => {
    let data = { ...rowData };
    let datavalue = data[`${checkColumn}`];
    return (
      <>
        <span
          style={{
            background: datavalue === "สำเร็จ" ? "#c8e6c9" : "#ffcdd2",
            color: datavalue === "สำเร็จ" ? "#256029" : "#c63737",
            borderRadius: "10px",
            padding: ".25em .5rem",
            textTransform: "uppercase",
            fontWeight: "700",
            fontSize: "13px",
            letterSpacing: ".3px",
          }}
        >
          {datavalue}
        </span>
      </>
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
              title: "ตรวจสอบการถ่ายโอนข้อมูล",
            }}
          />
        }
        body={
          <DBT03Search
            searchData={searchData}
            setSearchData={setSearchData}
            onDBT03GetDataList={onDBT03GetDataList}
            msSearchSource={msSearchSource}
            msDataTable={msDataTable}
          />
        }
      />
      <CustomCard>
        <DBT03List
          dataTable={dataTable}
          setDialog={setDialog}
          onRunProcessClick={(e) => onRunProcessClick(e)}
          onDBT03GetDetailClick={(e) => onDBT03GetDetailClick(e)}
          returnStatus={returnStatus}
        />
      </CustomCard>

      <DBT03Dialog
        dialog={dialog}
        setDialog={setDialog}
        dataTableDetail={dataTableDetail}
        returnStatus={returnStatus}
      />
    </div>
  );
}
