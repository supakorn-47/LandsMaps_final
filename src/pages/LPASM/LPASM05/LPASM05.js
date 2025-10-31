import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";

//PAGE
// import ADM02Search from './ADM02Search';
import LPASM05List from "./LPASM05List";
import LPASM05Dialog from "./LPASM05Dialog";

//SERVICE
// import LPASM05Services from "../../../service/ServiceADM/ServiceADM02";
import LPASM05Services from "../../../service/ServiceLPASM/ServiceLPASM05";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

var dateFormat = require("dateformat");

export default function LPASM05() {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(false);

  useEffect(() => {
    getDataList();
  }, []);

  const getDataList = async () => {
    setLoading(true);
    try {
      const res = await LPASM05Services.getList();
      if (res.status == 200 && res.result != null) {
        setDataTable(res.result);
      } else throw new Error(res.error);
    } catch (error) {
      setLoading(false);
      if (error?.status === 401 || error?.response?.data?.status === 401) {
        alert(
          JSON.stringify("เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่")
        );
        window.location.href = "/login";
      } else {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (updatedServiceRates) => {
    // console.log("updatedServiceRates:", updatedServiceRates);

    const reqBody = { ...editData, service_rates: updatedServiceRates };

    // console.log("reqBody:", reqBody);

    try {
      const res = await LPASM05Services.createOrUpdate(reqBody);

      if (res.status === 200) {
        showMessages(
          "success",
          `สำเร็จ`,
          "บันทึกอัตราค่าตั้งต้นของการใช้บริการ"
        );

        await getDataList();
      } else throw new Error(res);
    } catch (error) {
      showMessages(
        "error",
        `เกิดข้อผิดพลาด Status Code: ${
          error.response.data.status || error.status
        } ${error.response.data.message || error.error.message}`,
        ""
      );
    } finally {
      setOpenDialog(false);
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

  // const onRowReorder = (e) => {
  //   LPASM05Services.UpdateUpOrDownData(e.value).then(
  //     (res) => {
  //       setLoading(false);
  //       showMessages("success", `สำเร็จ`, "บันทึกจัดเรียง");
  //       getDataList();
  //     },
  //     function (err) {
  //       setLoading(false);
  //       showMessages(
  //         "error",
  //         `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`,
  //         ""
  //       );
  //     }
  //   );
  // };

  const handleEdit = async (id) => {
    // console.log("onEdit - id:", id);

    try {
      const res = await LPASM05Services.getById(id);
      // console.log("res:", res);
      if (res.status === 200) {
        // console.log("res.result[0]:", res.result[0]);

        setEditData(res.result[0]);
        setOpenDialog(true);
      } else throw new Error(res.message);
    } catch (error) {
      showMessages(
        "error",
        `เกิดข้อผิดพลาด Status Code: ${
          error.response.data.status || error.status
        } ${error.response.data.message || error.error.message}`,
        ""
      );
    }

    // console.log("editData:", editData);
  };

  return (
    <div className="page-wrapper">
      <Toast ref={toast} />
      <Loading visible={loading} />
      <CustomCard
        title={
          <PageHeader
            config={{
              title: "กำหนดอัตราค่าตั้งต้นของการใช้บริการ",
            }}
          />
        }
        body={
          <LPASM05List
            dataTable={dataTable}
            setOpenDialog={setOpenDialog}
            // setDeleteDialog={setDeleteDialog}
            // onRowReorder={(e) => onRowReorder(e)}
            onEdit={handleEdit}
          />
        }
      />

      <LPASM05Dialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onSubmit={handleSubmit}
        setLoading={setLoading}
        serviceRatesData={editData.service_rates || []}
      />
    </div>
  );
}
