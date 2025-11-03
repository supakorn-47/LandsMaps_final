import React, { useEffect, useState, useRef } from "react"
import { Toast } from "primereact/toast"
import { DialogDelete } from "../../../components/DialogService/DialogService"
import { FooterButtonCenter } from "../../../components/FooterButton/FooterButton"
import { Loading } from "../../../components/Loading/Loading"
import PageHeader from "../../../components/PageHeader/PageHeader"
import CustomCard from "../../../components/CustomCard/CustomCard"
import LPASM01List from "./LPASM01List"
import LPASM01Dialog from "./LPASM01Dialog"
import ServiceLPASM01 from "../../../service/ServiceADM/ServiceLPASM01"

export default function LPASM01() {
  const toast = useRef(null)
  const [loading, setLoading] = useState(false)
  const [dialog, setDialog] = useState({ dialog: false, action: "", data: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, data: null, textConfirm: "" })
  const [submitted, setSubmitted] = useState(false)
  const [dataTable, setDataTable] = useState([])

  useEffect(() => {
    onGetDataList()
  }, [])

  const onGetDataList = async () => {
    setLoading(true)
    try {
      const result = await ServiceLPASM01.getDataList()
      const formatted = (result?.result || result || []).map((item, index) => ({
        index: index + 1,
        register_type_seq: item.register_type_seq,
        register_type_name: item.register_type_name,
        register_type_ord: item.register_type_ord,
        register_type_flag: item.register_type_flag,
        remark: item.remark,
        record_status: item.record_status,
        create_user: item.create_user,
        create_dtm: item.create_dtm,
        last_upd_user: item.last_upd_user,
        last_upd_dtm: item.last_upd_dtm,
      }))
      setDataTable(formatted)
    } catch (error) {
      console.error("GET Error:", error)
      showMessages("error", "เกิดข้อผิดพลาด", error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const submitForm = async (formObject) => {
    if (!formObject.register_type_name) {
      showMessages("error", "กรุณากรอกชื่อประเภทลงทะเบียน")
      return
    }
    setLoading(true)
    try {
      let response
      if (dialog.action === "บันทึก") {
        response = await ServiceLPASM01.addData(formObject)
      } else if (dialog.action === "แก้ไข") {
        response = await ServiceLPASM01.updateData(formObject)
      }
      if (response) {
        showMessages("success", "สำเร็จ", dialog.action === "บันทึก" ? "เพิ่มข้อมูลเรียบร้อยแล้ว" : "แก้ไขข้อมูลเรียบร้อยแล้ว")
        setDialog({ dialog: false, action: "", data: null })
        onGetDataList()
      } else {
        showMessages("warn", "ไม่สามารถบันทึกข้อมูลได้")
      }
    } catch (error) {
      console.error("POST/PUT Error:", error)
      showMessages("error", "เกิดข้อผิดพลาด", error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const onUpdateOrder = async (orderList) => {
    setLoading(true)
    try {
      const response = await ServiceLPASM01.updateOrder(orderList)
      if (response) {
        showMessages("success", "สำเร็จ", "อัปเดตลำดับเรียบร้อย")
        onGetDataList()
      } else {
        showMessages("warn", "ไม่สามารถอัปเดตลำดับได้")
      }
    } catch (error) {
      console.error("UpdateOrder Error:", error)
      showMessages("error", "เกิดข้อผิดพลาด", error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const onDeleteConfirm = async () => {
    if (!deleteDialog?.data?.register_type_seq) {
      showMessages("warn", "ไม่พบข้อมูลที่จะลบ")
      return
    }
    setLoading(true)
    try {
      const seq = deleteDialog.data.register_type_seq
      const response = await ServiceLPASM01.deleteData(seq)
      if (response) {
        showMessages("success", "สำเร็จ", "ลบข้อมูลเรียบร้อยแล้ว")
        setDeleteDialog({ open: false, data: null, textConfirm: "" })
        onGetDataList()
      } else {
        showMessages("warn", "ไม่สามารถลบข้อมูลได้")
      }
    } catch (error) {
      console.error("DELETE Error:", error)
      showMessages("error", "เกิดข้อผิดพลาด", error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const showMessages = (severity = "error", summary = "", detail = "") => {
    toast.current.show({ severity, summary, detail, life: 6000 })
  }

  const footerButton = () => (
    <FooterButtonCenter
      onClickOk={onDeleteConfirm}
      onClickCancle={() => setDeleteDialog({ open: false, data: null, textConfirm: "" })}
    />
  )

  return (
    <div className="page-wrapper">
      <Loading loading={loading} />
      <Toast ref={toast} position="top-right" />
      <CustomCard
        title={<PageHeader config={{ title: "ข้อมูลประเภทลงทะเบียน" }} />}
        body={
          <LPASM01List
            dataTable={dataTable}
            setDialog={setDialog}
            setDeleteDialog={setDeleteDialog}
            onUpdateOrder={onUpdateOrder}
          />
        }
      />
      <LPASM01Dialog
        key={dialog.dialog + dialog.action}
        dialog={dialog}
        setDialog={setDialog}
        submitForm={submitForm}
        submitted={submitted}
        showMessages={showMessages}
        setLoading={setLoading}
      />
      <DialogDelete
        visible={deleteDialog.open}
        header="ยืนยันการลบข้อมูล"
        modal
        footer={footerButton()}
        onHide={() => setDeleteDialog({ open: false, data: null, textConfirm: "" })}
        textContent={deleteDialog.textConfirm}
      />
    </div>
  )
}
