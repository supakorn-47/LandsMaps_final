import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
// import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import "./profile.css";
import { useLocation } from "react-router-dom";
export function Profile({ user, setDialog }) {
  const toast = useRef(null);
  const location = useLocation();
  //   const user = location.state?.user || {};
  const [profileImage, setProfileImage] = useState(user.person_Image);
  const [profileData, setProfileData] = useState(user);

  const thaiTitles = ["นาย", "นาง", "นางสาว"];
  const fileInputRef = useRef(null);
  const showToast = (severity, summary, detail) => {
    if (toast?.current) {
      toast.current.show({ severity, summary, detail, life: 4000 });
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeProfile = () => {
    setDialog(); // เรียกฟังก์ชันจาก parent เพื่อปิด dialog
  };
  const handleProfileUpdate = () => {
    if (!profileData.firstName || !profileData.lastName) {
      showToast(
        "error",
        "ข้อมูลไม่ถูกต้อง",
        "กรุณากรอกชื่อและนามสกุลให้ครบถ้วน"
      );
      return;
    }
    if (!profileData?.email.includes("@")) {
      showToast("error", "ข้อมูลไม่ถูกต้อง", "กรุณากรอกอีเมลที่ถูกต้อง");
      return;
    }
    if (profileData?.nationalId?.length !== 13) {
      showToast(
        "error",
        "ข้อมูลไม่ถูกต้อง",
        "กรุณากรอกเลขประจำตัวประชาชน 13 หลัก"
      );
      return;
    }
    showToast(
      "success",
      "อัปเดตข้อมูลสำเร็จ",
      "ข้อมูลส่วนตัวได้รับการอัปเดตเรียบร้อยแล้ว"
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result);
      reader.readAsDataURL(file);
      showToast(
        "success",
        "อัปโหลดรูปภาพสำเร็จ",
        "รูปภาพโปรไฟล์ได้รับการอัปเดตเรียบร้อยแล้ว"
      );
    }
  };

  //   const statusSeverity = (status) => {
  //     switch (status) {
  //       case "ปฏิบัติงาน":
  //         return "success";
  //       case "ลาป่วย":
  //         return "danger";
  //       case "ลาพักผ่อน":
  //         return "warning";
  //       default:
  //         return "info";
  //     }
  //   };

  return (
    <div
      //   className="p-6"
      style={{
        justifySelf: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <Toast ref={toast} />

      {/* Profile Header */}
      <div
        // className="card flex flex-col items-center mb-6"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          //   className="badge-container"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifySelf: "center",
            alignItems: "center",
            width: "475px",
          }}
        >
          <div className="profile-container">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <img
                  src="/assets/layout/images/person.jpg"
                  alt="Profile"
                  className="profile-image"
                />
              </div>
            )}
            {/* <div className="badge-absolute">
            <Badge
              value={profileData.status}
              severity={statusSeverity(profileData.status)}
            />
          </div> */}

            <button
              type="button"
              className="camera-button"
              onClick={handleCameraClick}
            >
              <i className="pi pi-camera" style={{ fontSize: "1.6rem" }}></i>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="profile-container-text">
          <h2 style={{ textAlign: "center", margin: 0 }}>
            {profileData.person_fullname}
          </h2>
          <h3 style={{ textAlign: "center", margin: 0, color: "#2196F3" }}>
            {profileData.person_position}
          </h3>
          <p style={{ textAlign: "center", margin: 0 }}>
            {profileData.landoffice_name}
          </p>
          <p style={{ textAlign: "center", margin: 0 }}>
            รหัสพนักงาน: {profileData.person_id}
          </p>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          width: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="mb-3">
          <label>คำนำหน้า</label>
          <Dropdown
            value={profileData.title}
            options={thaiTitles}
            onChange={(e) => setProfileData({ ...profileData, title: e.value })}
            placeholder="เลือกคำนำหน้า"
            className="w-full"
          />
        </div>
        <div className="grid-row">
          <div>
            <label>ชื่อ-นามสกุล *</label>
            <div className="p-inputgroup p-inputgroup-addon-custom">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>

              <InputText
                value={profileData?.person_fullname}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
                className="w-full"
                placeholder="กรุณากรอกข้อมูล"
              />
            </div>
          </div>
          <div>
            <label>ชื่อ-นามสกุล (อังกฤษ)</label>
            <div className="p-inputgroup p-inputgroup-addon-custom">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                value={profileData.fullNameEnglish}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    fullNameEnglish: e.target.value,
                  })
                }
                className="w-full"
                placeholder="กรุณากรอกข้อมูล"
              />
            </div>
          </div>
        </div>
        {/* <div className="mb-3">
          <label>เลขประจำตัวประชาชน *</label>
          <InputText
            value={profileData.nationalId}
            maxLength={13}
            onChange={(e) =>
              setProfileData({ ...profileData, nationalId: e.target.value })
            }
            className="w-full"
          />
        </div> */}
        <div className="grid-row">
          <div>
            <label>วันเดือนปีเกิด</label>
            <div className="p-inputgroup p-inputgroup-addon-custom">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar"></i>
              </span>
              <Calendar
                value={profileData.dateOfBirth}
                onChange={(e) =>
                  setProfileData({ ...profileData, dateOfBirth: e.value })
                }
                className="w-full"
                dateFormat="yy-mm-dd"
                placeholder="กรุณากรอกข้อมูล"
              />
            </div>
          </div>

          <div className="mb-3">
            <label>อีเมล *</label>
            <div className="p-inputgroup p-inputgroup-addon-custom">
              <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
              </span>
              <InputText
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full"
                placeholder="กรุณากรอกข้อมูล"
              />
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div>
            <label>โทรศัพท์สำนักงาน</label>
            <div className="p-inputgroup p-inputgroup-addon-custom">
              <span className="p-inputgroup-addon">
                <i className="pi pi-phone"></i>
              </span>
              <InputText
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="w-full"
                placeholder="กรุณากรอกข้อมูล"
              />
            </div>
          </div>
          <div>
            <label>โทรศัพท์ส่วนตัว</label>
            <div className="p-inputgroup p-inputgroup-addon-custom">
              <span className="p-inputgroup-addon">
                <i className="pi pi-mobile"></i>
              </span>
              <InputText
                value={profileData.personalPhone}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    personalPhone: e.target.value,
                  })
                }
                className="w-full"
                placeholder="กรุณากรอกข้อมูล"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="button-row">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={closeProfile}
          className="p-button-secondary p-button-rounded custom-full-width"
        />
        <Button
          label="บันทึก"
          // label={props.dialog.action}
          icon="pi pi-check"
          onClick={handleProfileUpdate}
          autoFocus
          className="p-button-rounded p-button-info custom-full-width"
        />
      </div>
    </div>
  );
}
