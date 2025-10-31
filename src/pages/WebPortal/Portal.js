import React, { useEffect, useState } from "react";
import { setSession, getSession } from "../../utils/Crypto";
import { Button } from "primereact/button";
import MenuCard from "../../components/MenuCard/MenuCard";
import "./portal.css";

export default function Portal() {
  const [userinfo, setUserinfo] = useState({});

  useEffect(() => {
    localStorage.setItem("CHECK_MENU", "");
    let userinfos = getSession("login")?.result;
    setUserinfo(userinfos);
    console.log(" userinfos :", userinfos);
  }, []);

  const handleMenuClick = (menuTitle, nameMenu, checkMenu = "") => {
    localStorage.setItem("menuTitle", menuTitle);
    localStorage.setItem("nameMenu", nameMenu);
    console.log(" nameMenu :", nameMenu);
    console.log(" menuTitle :", menuTitle);
    
    if (checkMenu) {
      localStorage.setItem("CHECK_MENU", checkMenu);
    }
  }

  return (
    <>
      <div
        className="login-bg-shape"
        aria-hidden="true"
        style={{
          backgroundImage: `url("/assets/layout/images/background.webp.svg")`,
          backgroundSize: "cover", // ปรับขนาดให้ครอบคลุม
          backgroundPosition: "center", // จัดกึ่งกลาง
          backgroundRepeat: "no-repeat", // ไม่วนซ้ำ
          height: "100vh", // ความสูงเต็มหน้าจอ
          width: "100%",
        }}
      >
        {/* <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        >
          <circle cx="200" cy="200" r="180" fill="#1976d2" fillOpacity="0.08" />
          <circle
            cx="1300"
            cy="700"
            r="220"
            fill="#2196f3"
            fillOpacity="0.07"
          />
          <path
            d="M0,600 Q720,900 1440,600"
            stroke="#1976d2"
            strokeWidth="60"
            fill="none"
            opacity="0.04"
          />
        </svg> */}
      </div>
      <div
        className="portal-container"
        style={{ position: "relative", zIndex: 1 }}
      >
        <header className="portal-header">
          <Button
            icon="pi pi-sign-out"
            label="ออกจากระบบ"
            className="p-button-raised logout-button"
            onClick={() => (window.location.href = "/login")}
          />
        </header>

        <main className="portal-main">
          <div className="portal-split-layout">
            <div className="portal-left-section">
              <div className="portal-branding">
                <div className="logo-container">
                  <img
                    src="assets/layout/images/loginLogo.png"
                    alt="Platform Logo"
                    className="portal-logo"
                  />
                </div>
                <div className="login-title-th">กรมที่ดิน</div>
                <div className="login-title-en">Department of Lands</div>
                <div className="login-desc">
                  โครงการเชื่อมโยงระบบให้บริการค้นหาตำแหน่งรูปแปลงที่ดินด้วย
                  ระบบภูมิสารสนเทศทางอินเทอร์เน็ต (LandsMaps) กับ Platform
                  กลางทะเบียนทรัพย์สิน
                </div>
              </div>
            </div>

            <div className="portal-right-section">
              <div className="portal-menu-list">
                {userinfo?.register_type_seq !== 6 ? (
                  
                  <>
                    <MenuCard
                      icon="pi-lockpi pi-share-alt"
                      title="ระบบการเชื่อมโยงและแลกเปลี่ยนข้อมูลด้วยระบบ API Service ระหว่าง ระบบให้บริการค้นหาตำแหน่งรูปแปลงที่ดินด้วยระบบภูมิสารสนเทศทางอินเทอร์เน็ต (LandsMaps) กับ Platform กลางทะเบียนทรัพย์สิน"
                      subtitle="ข้อมูล API Service, Logs"
                      bgColor="bg-DB"
                      link="#/LPSMS03"
                      onClick={() =>
                        handleMenuClick(
                          "ระบบการเชื่อมโยงและแลกเปลี่ยนข้อมูลด้วยระบบ API Service ระหว่าง (LandsMaps) กับ Platform กลางทะเบียนทรัพย์สิน",
                          ""
                        )
                      }
                    />

                    <MenuCard
                      icon="pi-cog"
                      title="ระบบบริหารจัดการการเชื่อมโยง/แลกเปลี่ยนข้อมูลระหว่างหน่วยงาน และบริหารจัดการ API Service (API Management)"
                      subtitle="กำหนดตั้งค่าข้อมูล Service"
                      bgColor="bg-ADM"
                      link="#/LPASM02"
                      onClick={() =>
                        handleMenuClick(
                          "ระบบบริหารจัดการการเชื่อมโยง/แลกเปลี่ยนข้อมูลระหว่างหน่วยงาน และบริหารจัดการ API Service (API Management)",
                          ""
                        )
                      }
                    />

                    <MenuCard
                      icon="pi-user-edit"
                      title="ระบบบริหารจัดการสิทธิผู้ใช้งาน"
                      subtitle="ตั้งการใช้งาน Api Service, จัดการข้อมูล, Logs การเช้าใช้งานระบบ"
                      bgColor="bg-ADM2"
                      link="#/LPADM02"
                      onClick={() =>
                        handleMenuClick("ระบบบริหารจัดการสิทธิผู้ใช้งาน", "")
                      }
                    />

                    <MenuCard
                      icon="pi-database"
                      title="ระบบบริการประชาชน เพื่อชำระภาษีที่ดินและสิ่งปลูกสร้างจากกรมส่งเสริมการปกครองท้องถิ่น (สถ.) หรือหน่วยงานอื่น"
                      bgColor="bg-ID"
                      link="#/LPSPS01"
                      onClick={() =>
                        handleMenuClick(
                          "ระบบบริการประชาชน เพื่อชำระภาษีที่ดินและสิ่งปลูกสร้างจากกรมส่งเสริมการปกครองท้องถิ่น (สถ.) หรือหน่วยงานอื่น",
                          ""
                        )
                      }
                    />

                    <MenuCard
                      icon="pi-book"
                      title="ระบบรายงาน"
                      bgColor="bg-ER"
                      link="#/LPSTS01"
                      onClick={() => handleMenuClick("ระบบรายงาน", "")}
                    />
                  </>
                ) : (
                  <MenuCard
                    icon="pi-database"
                    title="ระบบบริการประชาชน เพื่อชำระภาษีที่ดินและสิ่งปลูกสร้างจากกรมส่งเสริมการปกครองท้องถิ่น (สถ.) หรือหน่วยงานอื่น"
                    bgColor="bg-ID"
                    link="#/LPSPS01"
                    onClick={() =>
                      handleMenuClick(
                        "ระบบบริการประชาชน เพื่อชำระภาษีที่ดินและสิ่งปลูกสร้างจากกรมส่งเสริมการปกครองท้องถิ่น (สถ.) หรือหน่วยงานอื่น",
                        ""
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
