import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {
  getipAddress,
  loginService,
  LoginADService,
  loginSAMLService,
} from "../../service/ServiceWebPortal/ServiceLogin";
import { SelectButton } from "primereact/selectbutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { setSession } from "../../utils/Crypto";
import "./portal.css";

const App = (props) => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [type, setType] = useState(0);
  const [typeUser, setTypeUser] = useState([
    { label: "Login", value: 0 },
    { label: "AD/LDAP", value: 1 },
  ]);

  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("saml");
    
    if (myParam != null && myParam !== "") {
      setLoading(true);
      loginSAMLService({ saml: myParam }).then(
        (res) => {
          if (res.result) {
            setSession("login", res.result[0]);
            window.location = "#/portal";
            console.log(" window :");
          } else {
            showMessages("warn", `กรุณาตรวจสอบ`, res.errors.message);
             window.location = "#/portal";
          }
          console.log("showMessages :");
          setLoading(false);
        },
        function (err) {
          setLoading(false);
          showMessages("error", `เกิดข้อผิดพลาด`, "กรุณาตรวจสอบการเชื่อมต่อ");
        }
      );
    }
  }, []);

  const onInputTextChange = (e, type) => {
    type === "username"
      ? setUsername(e.target.value)
      : setPassword(e.target.value);
  };

  const onLoginClick = () => {
    if (username === "" || password === "") {
      showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ถูกต้อง");
   ;
      
    } else {
      getLoginService();
      //  window.location = "#/portal";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (username === "" || password === "") {
        showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ถูกต้อง");
      } else {
        getLoginService();
      }
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

 

  
      // loginService({
      //   username: username,
      //   password: password,
      // }).then(
      //   (res) => {
      //     if (res.token !== null && res.token !== "" && res.result) {
      //       setSession("login", res);
      //       window.location = "#/portal";
      //     } else {
      //       showMessages("warn", `กรุณาตรวจสอบ`, res.errors.message);
      //     }
      //   },
      //   function (err) {
      //     setLoading(false);
      //     showMessages("error", `เกิดข้อผิดพลาด`, "กรุณาตรวจสอบการเชื่อมต่อ");
      //   }
      // );

const getLoginService = async () => {
  console.log("getLoginService :  username:", username);
  console.log("getLoginService :  password:", password);
  console.log("getLoginService :  type:", type);

  setLoading(true);

  if (type === 0) {
    try {
      const resp = await loginService({
        username: username,
        password: password,
      });
      
      console.log("getLoginService resp :", resp);

      if (resp?.token) {
        // ✅ จัดรูปแบบให้ตรงกับที่ service อื่น (เช่น LPASM01) ใช้อยู่
        const loginData = {
          result: {
            token: resp.token,
            user_dto: {
              username: resp.username,
              role: resp.role,
            },
          },
        };

        // ✅ บันทึก token ลง localStorage
        localStorage.setItem("login", JSON.stringify(loginData));

        // ✅ ไปหน้า portal หลังเข้าสู่ระบบสำเร็จ
        window.location = "#/portal";
      } else {
        showMessages("warn", `กรุณาตรวจสอบ`, "ไม่พบ Token จากเซิร์ฟเวอร์");
      }
    } catch (err) {
      setLoading(false);
      showMessages("error", `เกิดข้อผิดพลาด`, "กรุณาตรวจสอบการเชื่อมต่อ");
    }
  } else if (type === 1) {
    LoginADService({
      user_id: username,
      user_password: password,
      ad_flag: 1,
      ip_address: "",
    }).then(
      (res) => {
        if (res.result) {
          // ✅ บันทึกข้อมูลเข้าสู่ระบบ AD ลง localStorage เช่นกัน
          const loginData = {
            result: {
              token: res.token || "",
              user_dto: res.result?.user_dto || {
                username: username,
                role: "ADUser",
              },
            },
          };
          localStorage.setItem("login", JSON.stringify(loginData));

          window.location = "#/portal";
        } else {
          showMessages("warn", `กรุณาตรวจสอบ`, res.errors?.message || "ไม่สามารถเข้าสู่ระบบได้");
        }
        setLoading(false);
      },
      function (err) {
        setLoading(false);
        showMessages("error", `เกิดข้อผิดพลาด`, "กรุณาตรวจสอบการเชื่อมต่อ");
      }
    );
  } else {
    showMessages("warn", `แจ้งเตือน`, "กรุณาระบุข้อมูลให้ถูกต้อง");
    setLoading(false);
  }
};


  const onTypeChange = (e) => {
    setType(e.value);
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
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
      ></div>
      <div className="login-body" style={{ position: "relative", zIndex: 1 }}>
        <div className="login-card">
          <div className="login-logo-wrapper">
            <img
              src="assets/layout/images/loginLogo.png"
              alt="login_doi"
              className="login-logo"
            />
          </div>
          <div className="login-title-th">กรมที่ดิน</div>
          <div className="login-title-en">Department of Lands</div>
          <div className="login-desc">
            ระบบให้บริการค้นหาตำแหน่งรูปแปลงที่ดิน
            <br />
            ด้วยระบบภูมิสารสนเทศทางอินเทอร์เน็ต (LandsMaps) กับ Platform
            กลางทะเบียนทรัพย์สิน
          </div>
          <hr className="login-divider" />
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ProgressSpinner style={{ width: "48px", height: "48px" }} />
            </div>
          ) : (
            <>
              <div className="login-type-selector">
                <SelectButton
                  value={type}
                  options={typeUser}
                  onChange={onTypeChange}
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
              <form
                className="login-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  onLoginClick();
                }}
              >
                <div className="login-input-group">
                  <span className="login-input-icon pi pi-user" />
                  <InputText
                    className="login-input"
                    placeholder="ชื่อผู้ใช้งาน"
                    value={username}
                    onChange={(e) => onInputTextChange(e, "username")}
                  />
                </div>
                <div className="login-input-group">
                  <span className="login-input-icon pi pi-lock" />
                  <Password
                    className="login-input"
                    inputClassName="login-input"
                    value={password}
                    onChange={(e) => onInputTextChange(e, "password")}
                    feedback={false}
                    maxlength="20"
                    placeholder="รหัสผ่าน"
                    toggleMask
                  />
                </div>
                <Button
                  type="submit"
                  className="login-button"
                  label="เข้าสู่ระบบ"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  style={{ width: "100%" }}
                />
              </form>
            </>
          )}
          <div className="login-version">
            {`version ${process.env.REACT_APP_VERSION}`}
          </div>
        </div>
      </div>
    </>
  );
};

export default App ;