// src/pages/ADM/LPADM02/LPADM02.js
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Toast } from "primereact/toast";
import { Loading } from "../../../components/Loading/Loading";
import Iframe from "react-iframe";
import { Dialog } from "primereact/dialog";
import { formatDateAPI } from "../../../utils/DateUtil";
import LPADM02Search from "./LPADM02Search";
import LPADM02List from "./LPADM02List";
import LPADM02Dialog from "./LPADM02Dialog";
import LPADM02Services from "../../../service/ServiceADM/ServiceLPADM02";
import CustomCard from "../../../components/CustomCard/CustomCard";
import PageHeader from "../../../components/PageHeader/PageHeader";

export default function LPADM02() {
  const toast = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);

  const [msUserGroups, setMsUserGroups] = useState([]);
  const [msAgencies, setMsAgencies] = useState([]);
  const [msProvinces, setMsProvinces] = useState([]);
  const [registerDepartment, setRegisterDepartment] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const opts = await LPADM02Services.getDepartmentOptions();
        setRegisterDepartment(opts || []);
      } catch {}
      onGetDataList();
    })();
  }, []);

  const deptMap = useMemo(
    () =>
      Object.fromEntries(
        (registerDepartment || []).map((d) => [String(d.value), d.label])
      ),
    [registerDepartment]
  );

  const resolveDeptName = (row, map) => {
    const ids = [
      row?.department_seq,
      row?.landoffice_seq,
      row?.office_seq,
      row?.departmentCode,
      row?.landoffice_id,
      row?.department_id,
    ]
      .map((v) => (v === 0 || v === -1 || v == null ? "" : String(v)))
      .filter(Boolean);

    for (const id of ids) if (map[id]) return map[id];

    const names = [
      row?.department_name_th,
      row?.department_name,
      row?.register_department_name,
      row?.dept_name,
      row?.department_th,
      row?.departmentName,
      row?.landoffice_name_th,
      row?.landoffice_name,
      row?.office_name_th,
      row?.office_name,
      row?.agency_name,
    ].filter((v) => typeof v === "string" && v.trim() !== "");

    return names[0] || "-";
  };

  const tableRows = useMemo(() => dataTable, [dataTable]);

  const [dialog, setDialog] = useState({
    dialog: false,
    action: "",
    data: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [dialogPDF, setDialogPDF] = useState({ open: false, pdfURL: null });

  const [searchData, setSearchData] = useState({
    person_fullname: "",
    register_type_seq: -1,
    department_seq: "",
    create_dtm_from: new Date(),
    create_dtm_to: new Date(),
    province_seq: -1,
    totalRecords: 0,
    pageofnum: 0,
    rowofpage: 10000,
    source_seq: -1,
  });

  const openDialog = (payload) => {
    const data = payload?.data || {};
    setDialog({
      ...payload,
      data: {
        ...data,
        __deptOptions: registerDepartment || [],
        __skipLoadDept: true,
      },
    });
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const deptOpts = await LPADM02Services.getDepartmentOptions();
        setRegisterDepartment(deptOpts || []);
      } catch {}

      onGetDataList();

      LPADM02Services.MasterGetRegisterType(0, "")
        .then((data) => {
          const raw = data?.result || data?.data?.result || [];
          const mapped = raw.map((it) => ({
            label:
              it.register_type_name ||
              it.label ||
              String(it.register_type_seq || it.value || ""),
            value: String(it.register_type_seq || it.value || ""),
          }));
          setMsUserGroups(mapped);
          const onlyAgencies = mapped.filter(
            (x) => x.value === "1" || x.value === "2"
          );
          setMsAgencies(onlyAgencies);
        })
        .catch(() => {});

      LPADM02Services.MasterGetProvince()
        .then((res) => {
          const list = res?.result || res?.data?.result || [];
          const opts = list.map((p) => ({
            label:
              p.label ??
              p.province_name_th ??
              p.province_name ??
              p.name ??
              String(p.province_code ?? p.code ?? ""),
            value: String(
              p.value ?? p.province_seq ?? p.province_code ?? p.code ?? "-1"
            ),
          }));
          setMsProvinces(opts);
        })
        .catch(() => {});
    };
    bootstrap();
  }, []);

  const buildPayload = (form) => ({
    register_seq: form.register_seq ?? 0,
    person_id: form.person_id ?? 0,
    person_firstnameth: form.person_firstnameth || "",
    person_middlenameth: form.person_middlenameth || "",
    person_lastnameth: form.person_lastnameth || "",
    person_birthdate: form.person_birthdate
      ? new Date(form.person_birthdate)
      : null,

    person_phone: form.person_phone || "",
    person_email: form.person_email || "",
    person_position: form.person_position || "",
    province_seq: Number(form.province_seq) || 0,
    amphur_seq: Number(form.amphur_seq) || 0,
    landoffice_id: form.landoffice_id || "",
    department_seq: Number(form.department_seq) || 0,
    opt_seq: Number(form.opt_seq) || 0,
    department_phone: form.department_phone || "",
    user_id: form.user_id || "",
    user_password: form.user_password || "",
    register_type_seq: Number(form.register_type_seq) || 0,
    approve_flag: form.approve_flag ?? 1,
    register_ad_flag: form.register_ad_flag || "0",
    register_openid_token: form.register_openid_token || "",
    register_objective: form.register_objective || "",
    remark: form.remark || "",
    record_status: form.record_status || "N",
    operating_system_list:
      form.operating_system_list?.length > 0
        ? form.operating_system_list
        : [
            {
              operating_system_seq: 0,
              operating_system_other: "",
              record_status: "N",
            },
          ],
  });

  const handleSubmitForm = async (form) => {
    try {
      const payload = buildPayload(form);
      if (dialog.action === "แก้ไข") {
        await LPADM02Services.updateData(payload);
      } else {
        await LPADM02Services.addData(payload);
      }
      setDialog({ dialog: false, action: "", data: null });
      onGetDataList();
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const onGetDataList = () => {
    setLoading(true);
    LPADM02Services.getDataList({
      ...searchData,
      create_dtm_from: formatDateAPI(searchData.create_dtm_from),
      create_dtm_to: formatDateAPI(searchData.create_dtm_to),
      source_seq: parseInt(searchData.source_seq ?? -1),
    }).then(
      (res) => {
        setLoading(false);
        if (res?.status === 200) {
          const rows = (res?.result || []).map((r) => {
            const ids = [
              r?.department_seq,
              r?.landoffice_seq,
              r?.office_seq,
              r?.departmentCode,
              r?.landoffice_id,
              r?.department_id,
            ]
              .map((v) => (v === 0 || v === -1 || v == null ? "" : String(v)))
              .filter(Boolean);

            let nameFromIds = "";
            for (const id of ids) {
              if (deptMap[id]) {
                nameFromIds = deptMap[id];
                break;
              }
            }

            const nameFromRow =
              r?.department_name_th ||
              r?.department_name ||
              r?.register_department_name ||
              r?.dept_name ||
              r?.department_th ||
              r?.departmentName ||
              r?.landoffice_name_th ||
              r?.landoffice_name ||
              r?.office_name_th ||
              r?.office_name ||
              r?.agency_name ||
              "";

            return {
              ...r,
              department: (nameFromIds || nameFromRow || "-").trim() || "-",
            };
          });

          setDataTable(rows);
        }
      },
      (err) => {
        setLoading(false);
        if (err?.response?.data?.status === 401) {
          alert("Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่");
          window.location.href = "/login";
        } else {
          alert(JSON.stringify(err?.response?.data || err));
        }
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
              title: "จัดการสิทธิผู้ใช้งาน",
            }}
          />
        }
        body={
          <LPADM02Search
            searchData={searchData}
            setSearchData={setSearchData}
            onGetDataList={onGetDataList}
            msProvinces={msProvinces}
            msUserGroups={msUserGroups}
            msAgencies={msAgencies}
            registerDepartment={registerDepartment}
          />
        }
      />

      <CustomCard>
        <LPADM02List
          dataTable={tableRows}
          setDialog={openDialog}
          onReload={onGetDataList}
        />
      </CustomCard>

      {dialog.dialog && (
        <LPADM02Dialog
          dialog={dialog}
          setDialog={setDialog}
          submitted={submitted}
          setSubmitted={setSubmitted}
          submitForm={handleSubmitForm}
          msUserGroups={msUserGroups}
        />
      )}

      {dialogPDF.open && (
        <Dialog
          header="PDF"
          visible={dialogPDF.open}
          blockScroll
          maximized
          onHide={() => setDialogPDF({ open: false, pdfURL: null })}
        >
          <div className="confirmation-content" style={{ paddingTop: "0em" }}>
            <Iframe
              url={dialogPDF.pdfURL}
              width="100%"
              height={window.innerHeight - 110}
              display="initial"
              position="relative"
            />
          </div>
        </Dialog>
      )}
    </div>
  );
}
