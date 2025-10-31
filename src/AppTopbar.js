import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { getSession } from "./utils/Crypto";
import "./AppTopbar.css";
import { withRouter } from "react-router-dom";
import { Profile } from "./pages/WebPortal/Profile";

class AppTopbar extends Component {
  static defaultProps = {
    onMenuButtonClick: null,
    onTopbarMenuButtonClick: null,
    onTopbarItemClick: null,
    topbarMenuActive: false,
    activeTopbarItem: null,
    profileMode: null,
    horizontal: null,

    onLoginClick: null,
    onLogOutClick: null,
  };

  static propTypes = {
    onMenuButtonClick: PropTypes.func.isRequired,
    onTopbarMenuButtonClick: PropTypes.func.isRequired,
    onTopbarItemClick: PropTypes.func.isRequired,
    topbarMenuActive: PropTypes.bool.isRequired,
    activeTopbarItem: PropTypes.string,
    profileMode: PropTypes.string,
    horizontal: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      showLoginDisplay: false,
      showProfile: false,
      displayPosition: false,
      position: "center",
      ob_login: {},
      openProfile: false,
    };
  }

  onTopbarItemClick(event, item) {
    if (this.props.onTopbarItemClick) {
      this.props.onTopbarItemClick({
        originalEvent: event,
        item: item,
      });
    }
  }
  toggleProfileDialog = () => {
    this.setState({ showProfile: !this.state.showProfile });
  };
  closeProfileDialog = () => {
    this.setState({ showProfile: false });
  };

  onLogOutClick = () => {
    this.setState({ showProfile: false });
  };

  onInputTextChange = (e, type) => {
    this.setState({
      ob_login: {
        ...this.state.ob_login,
        [`${type}`]: e.target.value,
      },
    });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const { username, password } = this.state.ob_login;
      alert(`onLoginClick  => username: ${username} password: ${password}`);
    }
  };

  onConfirmLogin = () => {
    const { username, password } = this.state.ob_login;
    alert(`onLoginClick  => username: ${username} password: ${password}`);
  };

  renderDialog() {
    const { username, password } = this.state.ob_login;
    return (
      <Dialog
        header="เข้าสู่ระบบ"
        visible={this.state.showLoginDisplay}
        position={"top"}
        modal
        style={{ width: "450px" }}
        className="p-fluid"
        onHide={() => this.onLoginClick("showLoginDisplay", false)}
        //footer={this.renderFooter()}
      >
        <div className="p-fluid">
          <div className="p-inputgroup" style={{ padding: 5 }}>
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => this.onInputTextChange(e, "username")}
              onKeyDown={this.handleKeyDown}
            />
          </div>
          <div className="p-inputgroup" style={{ padding: 5 }}>
            <span className="p-inputgroup-addon">
              <i className="pi pi-key"></i>
            </span>
            <InputText
              placeholder="รหัสผ่าน"
              type="password"
              value={password}
              onChange={(e) => this.onInputTextChange(e, "password")}
              onKeyDown={this.handleKeyDown}
            />
          </div>
          <div
            style={{
              padding: 5,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <a href="">ลงทะเบียนผู้ใช้งาน</a>
            </div>
            <div>
              <a href="">ลืมรหัสผ่าน</a>
            </div>
          </div>
          <div style={{ padding: 5 }}>
            <Button
              label="เข้าสู่ระบบ"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => this.onConfirmLogin()}
            />
          </div>
        </div>
      </Dialog>
    );
  }

  renderFooter() {
    return (
      <div>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => this.onLoginClick("showLoginDisplay", false)}
          className="p-button-text"
        />
        <Button
          label="เข้าสู่ระบบ"
          icon="pi pi-arrow-right"
          onClick={() => this.onLoginClick("showLoginDisplay", false)}
          autoFocus
        />
      </div>
    );
  }

  onLoginClick(key, value) {
    this.setState({
      [`${key}`]: value,
    });
  }

  onProfileClick = () => {
    this.setState({
      openProfile: !this.state.openProfile,
    });
  };
  componentDidMount = () => {
    this.setState({
      ob_login: {
        ...this.state.ob_login,
        ...getSession("login").result,
      },
    });
  };
  renderProfileDialog() {
    const { ob_login, showProfile } = this.state;
    return (
      <Dialog
        header={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="pi pi-user" style={{ fontSize: "1.5rem" }}></i>
            <span style={{ paddingTop: "5px" }}>โปรไฟล์ผู้ใช้งาน</span>
          </div>
        }
        visible={showProfile} // ใช้ showProfile
        modal
        style={{ width: "800px" }}
        onHide={this.closeProfileDialog}
      >
        <Profile user={ob_login} setDialog={this.closeProfileDialog} />
      </Dialog>
    );
  }

  render() {
    const { person_fullname, person_position, register_type_name } =
      this.state.ob_login;
    const userRole = person_position || register_type_name;

    return (
      <div className="layout-topbar">
        <div className="topbar-left">
          <button
            className="menu-button"
            onClick={this.props.onTopbarMenuButtonClick}
          >
            <i className="pi pi-bars"></i>
          </button>
          <div className="page-title">
            <span>{localStorage.getItem("menuTitle")}</span>
          </div>
        </div>

        <div className="topbar-right">
          <Button
            label="หน้าหลัก"
            className="nav-button user-button"
            icon="pi pi-home"
            onClick={() => (window.location = "#/portal")}
          />

          <div
            className="user-profile"
            onClick={(e) => this.onTopbarItemClick(e, "profile")}
          >
            <Button className="nav-button user-button">
              <i className="pi pi-user"></i>
              <div className="user-name">{person_fullname}</div>
              <i className="pi pi-angle-down"></i>
            </Button>

            <div className="user-menu">
              <div className="user-info">
                <span className="name">{person_fullname}</span>
                <span className="role">{userRole}</span>
              </div>
              <div className="menu-items">
                <button
                  type="button"
                  className="menu-item"
                  onClick={this.toggleProfileDialog}
                >
                  <i className="pi pi-user"></i>
                  <span>โปรไฟล์</span>
                </button>
              </div>
              <div className="menu-items">
                <button
                  className="menu-item"
                  onClick={() => (window.location.href = "#/portal")}
                >
                  <i className="pi pi-sign-out"></i>
                  <span>หน้าหลัก</span>
                </button>
              </div>
              <div className="menu-items">
                <button
                  className="menu-item"
                  onClick={() => (window.location.href = "/login")}
                >
                  <i className="pi pi-sign-out"></i>
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {this.renderDialog()}
        {this.renderProfileDialog()}
      </div>
    );
  }
}
export default withRouter(AppTopbar);
