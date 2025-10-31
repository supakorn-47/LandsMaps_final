import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DialogDelete } from "../../../components/DialogService/DialogService";
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton";
import { Loading } from "../../../components/Loading/Loading";
import { getTextMenu } from "../../../utils/MenuUtil";

//PAGE
import DMS02Search from "./DMS02Search";
import DMS02List from "./DMS02List";
import DMS02Dialog from "./DMS02Dialog";

//SERVICE
import {
  DMS02GetDataList,
  DMS02CreateData,
  DMS02UpdateData,
  DMS02CancelData,
  DMS02UpdateStatus,
  DMS02GetJobFileDataList,
} from "../../../service/ServiceDMS/ServiceDMS02";
import { masterService } from "../../../service/ServiceMaster/MasterService";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function DMS02() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dialog, setDialog] = useState({ dialog: false, action: "" });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [jobFileDataList, setJobFileDataList] = useState([]);
  const [searchData, setSearchData] = useState({
    source_seq: 15,
    transfer_data_group_seq: 0,
    source_schema: -1,
  });

  const [selectedTF, setSelectedTF] = useState([]);
  const [msDataSource, setMsDataSource] = useState([]);
  const [msDataTransferGroup, setMsDataTransferGroup] = useState([]);
  const [msDataSourceProcess, setMsDataSourceProcess] = useState([]);
  const [msDataTransferProcess, setMsDataTransferProcess] = useState([]);

  useEffect(() => {
    onDMS02GetDataList();
    onGetMaster();

    //แหล่งข้อมูลต้นทาง
    masterService("GetDataSource?mode=1&source_process=1", {}, "GET").then(
      (res) => {
        setMsDataSourceProcess(res.result);
      },
      function (err) {
        showMessages(
          "error",
          `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
          ""
        );
      }
    );
    //แหล่งข้อมูลปลายทาง
    masterService("GetDataSource?mode=1&source_process=3", {}, "GET").then(
      (res) => {
        setMsDataTransferProcess(res.result);
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

  useEffect(() => {
    if (dialog === false) {
      onGetMaster();
    }
  }, [dialog]);

  const onGetMaster = (_MODE = 0) => {
    //แหล่งข้อมูล
    masterService(
      `GetDataSource?mode=${_MODE}&source_process=1`,
      {},
      "GET"
    ).then(
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
    //แหล่งข้อมูลต้นทาง
    // masterService(`GetTransferDataGroup?mode=${_MODE}`, {}, "GET")
    //     .then(res => {
    //         let temp = res.result;
    //         temp.splice(0, 1);
    //         setMsDataTransferGroup(temp);
    //     }, function (err) {
    //         showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
    //     });
    onGetTransferDataGroup();
  };

  const onGetTransferDataGroup = (source_schema = "") => {
    masterService(
      `GetTransferDataGroup?mode=1&source_schema=${source_schema}`,
      {},
      "GET"
    ).then((res) => {
      let temp = res.result;
      temp.splice(0, 1);
      setMsDataTransferGroup(temp);
      // setMsDataTransferGroup(res.result);
    });
  };

  const onDMS02GetDataList = () => {
    let transfer_data_group_seq = "0";
    let index = 1;
    if (selectedTF !== null && selectedTF !== "" && selectedTF !== undefined) {
      transfer_data_group_seq = "";
      selectedTF.forEach((element) => {
        if (selectedTF.length === index || selectedTF.length === 1) {
          transfer_data_group_seq += element + "";
        } else {
          transfer_data_group_seq += element + ",";
        }
        index++;
      });
    }

    setLoading(true);
    DMS02GetDataList({
      ...searchData,
      transfer_data_group_seq: transfer_data_group_seq,
    }).then(
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

  const validation = (object) => {
    let showerror = false;
    for (const property in object) {
      if (
        property === "source_seq" ||
        property === "transfer_data_group_seq" ||
        property === "source_process_seq" ||
        property === "source_schema" ||
        property === "source_table" ||
        property === "target_process_seq" ||
        property === "target_schema" ||
        property === "target_table"
      ) {
        if (
          object[property] === null ||
          object[property] === undefined ||
          object[property] === "" ||
          object[property] === 0
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
    if (dialog.action === "บันทึก" && validation(submitForm)) {
      console.log("submit create");
      setLoading(true);
      DMS02CreateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            console.log("success");
            showMessages("success", `สำเร็จ`, "บันทึกตารางข้อมูลการถ่ายโอน");
            // setDataTable(res.result);
            onDMS02GetDataList();
            setDialog(false);
          } else {
            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.errors.message}`
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
    } else if (dialog.action === "แก้ไข" && validation(submitForm)) {
      console.log("submit edit");

      setLoading(true);
      DMS02UpdateData(submitForm).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            console.log("success");

            showMessages("success", `สำเร็จ`, "แก้ไขตารางข้อมูลการถ่ายโอน");
            // setDataTable(res.result);
            onDMS02GetDataList();
            setDialog(false);
          } else {
            console.log("no success");

            showMessages(
              "error",
              `เกิดข้อผิดพลาด Status Code: ${res.status}`,
              `${res.errors.message}`
            );
          }
        },
        function (err) {
          console.log("error");

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

  const footerButton = () => {
    const onDMS02DeleteData = () => {
      DMS02CancelData(deleteDialog.data).then(
        (res) => {
          setLoading(false);
          if (res.status === 200) {
            showMessages("success", `สำเร็จ`, "ยกเลิกข้อมูลสำเร็จ");
            onDMS02GetDataList();
            setDeleteDialog(false);
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
      <FooterButtonCenter
        onClickOk={() => onDMS02DeleteData()}
        onClickCancle={() => setDeleteDialog(false)}
      />
    );
  };

  const onTransferStatusChange = (rowData, isChecked) => {
    setLoading(true);
    DMS02UpdateStatus({
      transfer_data_seq: rowData.transfer_data_seq,
      transfer_status: isChecked === true ? 1 : 0,
    }).then(
      (res) => {
        if (res.status === 200) {
          showMessages(
            "success",
            `สำเร็จ`,
            isChecked === true ? "เปิด ถ่ายโอน" : "ปิด ถ่ายโอน"
          );
          onDMS02GetDataList();
          setDeleteDialog(false);
        }
        setLoading(false);
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

  const onGetJobFileDataList = (rowData) => {
    setLoading(true);
    DMS02GetJobFileDataList({
      transfer_data_seq: rowData.transfer_data_seq,
    }).then(
      (res) => {
        setJobFileDataList(res.result);
        setLoading(false);
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
              title: "กำหนดตารางข้อมูลการถ่ายโอน",
            }}
          />
        }
        body={
          <DMS02Search
            searchData={searchData}
            setSearchData={setSearchData}
            onDMS02GetDataList={onDMS02GetDataList}
            //MASTER
            msDataSource={msDataSource}
            msDataTransferGroup={msDataTransferGroup}
            selectedTF={selectedTF}
            setSelectedTF={setSelectedTF}
            onGetTransferDataGroup={onGetTransferDataGroup}
          />
        }
      />

      <CustomCard>
        <DMS02List
          dataTable={dataTable}
          setDialog={setDialog}
          setDeleteDialog={setDeleteDialog}
          onTransferStatusChange={onTransferStatusChange}
          onGetJobFileDataList={onGetJobFileDataList}
          onGetMaster={(e) => onGetMaster(e)}
        />
      </CustomCard>

      {dialog && (
        <DMS02Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitForm={(e) => submitForm(e)}
          setSubmitted={setSubmitted}
          submitted={submitted}
          onGetJobFileDataList={onGetJobFileDataList}
          jobFileDataList={jobFileDataList}
          //Master
          msDataSource={msDataSource}
          msDataTransferGroup={msDataTransferGroup}
          msDataSourceProcess={msDataSourceProcess}
          msDataTransferProcess={msDataTransferProcess}
        />
      )}

      <DialogDelete
        visible={deleteDialog.open}
        header="การยืนยัน"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog(false)}
        className="modern-dialog"
      >
        <p>คุณต้องการยกเลิกข้อมูลนี้หรือไม่?</p>
      </DialogDelete>
    </div>
  );
}
