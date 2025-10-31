import React, { Component } from "react";
import classNames from "classnames";
import AppTopbar from "./AppTopbar";
import { AppMenu } from "./AppMenu";
import { AppInlineProfile } from "./AppInlineProfile";
import { Route } from "react-router-dom";

// ===================== MENU ===================== //
// import { menuGrouped, menuGroupedType6, menuGroupedCheckMenu } from './json/menuADM';
import menuLPSMS from "./json/01menuLPSMS";
import menuLPASM from "./json/02menuLPASM";
import menuLPADM from "./json/03menuLPADM";
import menuLPSPS from "./json/04menuLPSPS";
import menuLPSTS from "./json/05menuLPSTS";

// ===================== DMS ===================== //
import DMS01 from "./pages/DMS/DMS01/DMS01";
import DMS02 from "./pages/DMS/DMS02/DMS02";
import DMS03 from "./pages/DMS/DMS03/DMS03";
import DMS04 from "./pages/DMS/DMS04/DMS04";
import DMS05 from "./pages/DMS/DMS05/DMS05";
import DMS06 from "./pages/DMS/DMS06/DMS06";
import DMS07 from "./pages/DMS/DMS07/DMS07";

// ===================== DEA ===================== //
import DEA01 from "./pages/DEA/DEA01/DEA01";
import DEA02 from "./pages/DEA/DEA02/DEA02";
import DEAMOCK02 from "./pages/DEA/DEAMOCK02/DEAMOCK02";
// ===================== DGR ===================== //
import DGR01 from "./pages/DGR/DGR01/DGR01";
import DGR02 from "./pages/DGR/DGR02/DGR02";
import DGR03 from "./pages/DGR/DGR03/DGR03";
import DGR04 from "./pages/DGR/DGR04/DGR04";
import DGR05 from "./pages/DGR/DGR05/DGR05";
import DGR05Chart from "./pages/DGR/DGR05/DGR05Chart";
// ===================== ADM ===================== //
import ADM01 from "./pages/ADM/ADM01/ADM01";
import ADM02 from "./pages/ADM/ADM02/ADM02";
import ADM03 from "./pages/ADM/ADM03/ADM03";
import ADM04 from "./pages/ADM/ADM04/ADM04";
import ADM05 from "./pages/ADM/ADM05/ADM05";
// import ADM10 from "./pages/ADM/ADM10/ADM10";
import ADM12 from "./pages/ADM/ADM12/ADM12";
import ADM13 from "./pages/ADM/ADM13/ADM13";
import ADM14 from "./pages/ADM/ADM14/ADM14";
import ADM15 from "./pages/ADM/ADM14/ADM14";
import ADM11 from "./pages/ADM/ADM11/ADM11";
import ADM16 from "./pages/ADM/ADM16/ADM16";

// ===================== MSM ===================== //
import MSM01 from "./pages/MSM/MSM01/MSM01";
import MSM02 from "./pages/MSM/MSM02/MSM02";
import MSM03 from "./pages/MSM/MSM03/MSM03";
import MSM04 from "./pages/MSM/MSM01/MSM01";
import MSM34 from "./pages/MSM/MSM34/MSM34";
import MSM35 from "./pages/MSM/MSM35/MSM35";
import MSM36 from "./pages/MSM/MSM36/MSM36";
// import SCS15 from './pages/SCS/SCS15/SCS15';
// import SCS16 from './pages/SCS/SCS16/SCS16';

// ===================== NEW PAGE ===================== //

import LPADM01 from "./pages/ADM/LPADM01/LPADM01";
import LPADM02 from "./pages/ADM/LPADM02/LPADM02";
import LPADM03 from "./pages/ADM/LPADM03/LPADM03";
import LPADM04 from "./pages/ADM/LPADM04/LPADM04";
import LPADM05 from "./pages/ADM/LPADM05/LPADM05";
import LPADM06 from "./pages/ADM/LPADM06/LPADM06";

import LPSMS01 from "./pages/MSM/LPSMS01/LPSMS01";
import LPSMS02 from "./pages/MSM/LPSMS02/LPSMS02";
import LPSMS03 from "./pages/MSM/LPSMS03/LPSMS03";

import LPASM01 from "./pages/LPASM/LPASM01/LPASM01";
import LPASM02 from "./pages/LPASM/LPASM02/LPASM02";
import LPASM03 from "./pages/LPASM/LPASM03/LPASM03";
import LPASM04 from "./pages/LPASM/LPASM04/LPASM04";
import LPASM05 from "./pages/LPASM/LPASM05/LPASM05";

import DBT07 from "./pages/DBT/DBT07/DBT07";
import DBT03 from "./pages/DBT/DBT03/DBT03";
import DBT05 from "./pages/DBT/DBT05/DBT05";
import DBT06 from "./pages/DBT/DBT06/DBT06";
import DBT08 from "./pages/DBT/DBT08/DBT08";
import { Profile } from "./pages/WebPortal/Profile";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import "./components/style.css";

import { setSession, getSession } from "./utils/Crypto";

class App extends Component {
  constructor() {
    super();
    this.state = {
      layoutMode: "horizontal",
      overlayMenuActive: false,
      staticMenuDesktopInactive: false,
      staticMenuMobileActive: false,
      topbarMenuActive: false,
      activeTopbarItem: null,
      darkMenu: false,
      menuActive: false,
      profileMode: "inline",
      themeColor: "cyan-light",
      grouped: true,
      inlineProfileActive: false,
      configDialogActive: false,
    };

    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
    this.onTopbarMenuButtonClick = this.onTopbarMenuButtonClick.bind(this);
    this.onTopbarItemClick = this.onTopbarItemClick.bind(this);
    this.onInlineProfileClick = this.onInlineProfileClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.onRootMenuItemClick = this.onRootMenuItemClick.bind(this);
    this.changeMenuMode = this.changeMenuMode.bind(this);
    this.changeMenuType = this.changeMenuType.bind(this);
    this.changeMenuColor = this.changeMenuColor.bind(this);
    this.changeProfileMode = this.changeProfileMode.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.onConfigButtonClick = this.onConfigButtonClick.bind(this);
    this.onConfigCloseClick = this.onConfigCloseClick.bind(this);
    this.onConfigClick = this.onConfigClick.bind(this);
  }

  onMenuClick(event) {
    this.menuClick = true;

    if (
      this.state.inlineProfileActive &&
      !this.inlineProfileClick &&
      this.isSlim()
    ) {
      this.setState({ inlineProfileActive: false });
    }
    this.inlineProfileClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.setState({
      topbarMenuActive: false,
    });

    if (this.state.layoutMode === "overlay") {
      if (this.isDesktop())
        this.setState({ overlayMenuActive: !this.state.overlayMenuActive });
      else
        this.setState({
          staticMenuMobileActive: !this.state.staticMenuMobileActive,
        });
    } else {
      if (this.isDesktop())
        this.setState({
          staticMenuDesktopInactive: !this.state.staticMenuDesktopInactive,
        });
      else
        this.setState({
          staticMenuMobileActive: !this.state.staticMenuMobileActive,
        });
    }

    event.preventDefault();
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.setState({
      staticMenuDesktopInactive: !this.state.staticMenuDesktopInactive,
    });
    this.hideOverlayMenu();
    event.preventDefault();
  }

  onTopbarItemClick(event) {
    this.topbarItemClick = true;

    if (this.state.activeTopbarItem === event.item)
      this.setState({ activeTopbarItem: null });
    else this.setState({ activeTopbarItem: event.item });

    event.originalEvent.preventDefault();
  }

  onInlineProfileClick(event) {
    this.inlineProfileClick = true;
    this.setState({ inlineProfileActive: !this.state.inlineProfileActive });

    if (this.isSlim() && !this.isMobile()) {
      if (!this.menuClick) {
        this.setState({ menuActive: false });

        this.hideOverlayMenu();
      }
      this.menuClick = false;
    }
  }

  onMenuItemClick(event) {
    if (!event.item.items) {
      this.hideOverlayMenu();
    }

    if (!event.item.items && (this.isHorizontal() || this.isSlim())) {
      this.setState({
        menuActive: false,
      });
    }
  }

  onRootMenuItemClick(event) {
    this.setState({
      menuActive: !this.state.menuActive,
    });

    event.originalEvent.preventDefault();
  }

  onConfigButtonClick(event) {
    this.configClick = true;
    this.setState({ configDialogActive: !this.state.configDialogActive });
  }

  onConfigCloseClick() {
    this.setState({ configDialogActive: false });
  }

  onConfigClick() {
    this.configClick = true;
  }

  onDocumentClick(event) {
    if (!this.topbarItemClick) {
      this.setState({
        activeTopbarItem: null,
        topbarMenuActive: false,
      });
    }

    if (!this.menuClick) {
      if (this.isHorizontal() || this.isSlim()) {
        this.setState({
          menuActive: false,
        });
      }

      this.hideOverlayMenu();
    }

    if (
      this.state.inlineProfileActive &&
      !this.inlineProfileClick &&
      this.isSlim()
    ) {
      this.setState({ inlineProfileActive: false });
    }

    if (!this.configClick) {
      this.setState({ configDialogActive: false });
    }

    this.topbarItemClick = false;
    this.menuClick = false;
    this.configClick = false;
    this.inlineProfileClick = false;
  }

  hideOverlayMenu() {
    this.setState({
      overlayMenuActive: false,
      staticMenuMobileActive: false,
    });
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  isOverlay() {
    return this.state.layoutMode === "overlay";
  }

  isHorizontal() {
    return this.state.layoutMode === "horizontal";
  }

  isSlim() {
    return this.state.layoutMode === "slim";
  }

  changeMenuMode(event) {
    this.setState({ layoutMode: event.menuMode });
    if (event.menuMode === "horizontal") {
      this.setState({ profileMode: "popup" });
    }
  }

  changeMenuType(event) {
    this.setState({ grouped: event.grouped });
  }

  changeMenuColor(event) {
    this.setState({ darkMenu: event.darkMenu });
  }

  changeProfileMode(event) {
    this.setState({ profileMode: event.profileMode });
  }

  changeTheme(theme, scheme) {
    this.setState({ themeColor: theme + "-" + scheme });
    this.changeStyleSheetUrl("layout-css", theme, "layout", scheme);
    this.changeStyleSheetUrl("theme-css", theme, "theme", scheme);
  }

  changeStyleSheetUrl(id, value, prefix, scheme) {
    let element = document.getElementById(id);
    let urlTokens = element.getAttribute("href").split("/");

    if (id.localeCompare("layout-css") === 0) {
      urlTokens[urlTokens.length - 1] = prefix + "-" + value + ".css";
    } else {
      urlTokens[urlTokens.length - 2] = value;
      urlTokens[urlTokens.length - 1] = "theme-" + scheme + ".css";
    }
    let newURL = urlTokens.join("/");

    this.replaceLink(element, newURL);

    if (scheme === "dark") {
      this.setState({ darkMenu: true });
    } else if (scheme === "light") {
      this.setState({ darkMenu: false });
    }

    // let topbarLogo = document.getElementById('layout-topbar-logo');
    // let menuLogo = document.getElementById('layout-menu-logo');
    // if (value.localeCompare('yellow') === 0 || value.localeCompare('lime') === 0) {
    // 	topbarLogo.src = 'assets/layout/images/logo-black.png';
    // 	menuLogo.src = 'assets/layout/images/logo-black.png';
    // } else {
    // 	topbarLogo.src = 'assets/layout/images/logo-white.png';
    // 	menuLogo.src = 'assets/layout/images/logo-white.png';
    // }
  }

  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  replaceLink(linkElement, href) {
    if (this.isIE()) {
      linkElement.setAttribute("href", href);
    } else {
      const id = linkElement.getAttribute("id");
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute("href", href);
      cloneLinkElement.setAttribute("id", id + "-clone");

      linkElement.parentNode.insertBefore(
        cloneLinkElement,
        linkElement.nextSibling
      );

      cloneLinkElement.addEventListener("load", () => {
        linkElement.remove();
        cloneLinkElement.setAttribute("id", id);
      });
    }
  }

  createMenu() {
    this.menuUngrouped = [
      {
        label: "Main Menu",
        icon: "pi pi-fw pi-home",
        items: this.menuGrouped,
      },
    ];
  }

  checkLogin() {
    if (getSession("login") === undefined) {
      window.location.href = "/login/";
    }
  }

  componentDidMount() {
    this.checkLogin();
    if (localStorage.getItem("CHECK_MENU") === "จัดการสิทธิผู้ใช้งาน") {
      // this.menuGrouped = menuGroupedCheckMenu;
    } else if (window.location.hash.indexOf("LPADM") !== -1) {
      this.menuGrouped = menuLPADM;
    } else if (window.location.hash.indexOf("ADM") !== -1) {
      //Todo
      // let register_type_seq = getSession('login').result.register_type_seq;
      // if (register_type_seq !== 6) {
      // 	this.menuGrouped = menuGrouped;
      // } else if (register_type_seq === 6) {
      // 	this.menuGrouped = menuGroupedType6;
      // }
    }
    if (window.location.hash.indexOf("LPSMS") !== -1) {
      this.menuGrouped = menuLPSMS;
    }
    if (window.location.hash.indexOf("DMS") !== -1) {
      this.menuGrouped = menuLPSMS;
    }
    if (window.location.hash.indexOf("DBT") !== -1) {
      this.menuGrouped = menuLPSMS;
    }
    if (window.location.hash.indexOf("SMS") !== -1) {
      this.menuGrouped = menuLPSMS;
    }
    if (window.location.hash.indexOf("MSM") !== -1) {
      this.menuGrouped = menuLPSMS;
    }
    if (window.location.hash.indexOf("LPASM") !== -1) {
      this.menuGrouped = menuLPASM;
    }
    if (window.location.hash.indexOf("LPSPS") !== -1) {
      this.menuGrouped = menuLPSPS;
    }
    if (window.location.hash.indexOf("LPSTS") !== -1) {
      this.menuGrouped = menuLPSTS;
    }

    this.changeTheme("cyan", "light");
    this.createMenu();
  }

  render() {
    let layoutMode = "static";
    const layoutClassName = classNames("layout-wrapper", {
      "layout-horizontal": layoutMode === "horizontal",
      "layout-overlay": layoutMode === "overlay",
      "layout-static": layoutMode === "static",
      "layout-slim": layoutMode === "slim",
      "layout-static-inactive": this.state.staticMenuDesktopInactive,
      "layout-mobile-active": false,
      "layout-overlay-active": false,
      "layout-menu-dark": false,
      "layout-menu-light": true,
    });
    // const AppBreadCrumbWithRouter = withRouter(AppBreadcrumb);

    return (
      <div className={layoutClassName} onClick={this.onDocumentClick}>
        <AppTopbar
          topbarMenuActive={this.state.topbarMenuActive}
          activeTopbarItem={this.state.activeTopbarItem}
          onMenuButtonClick={this.onMenuButtonClick}
          onTopbarMenuButtonClick={this.onTopbarMenuButtonClick}
          onTopbarItemClick={this.onTopbarItemClick}
          profileMode={this.state.profileMode}
          horizontal={this.isHorizontal()}
        />

        <div className="layout-menu-container" onClick={this.onMenuClick}>
          <div
            className=""
            style={{
              backgroundColor: "#FFFFFF",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className="p-link"
              onClick={() => (window.location.href = "#/portal")}
            >
              {/* <img id="layout-menu-logo" src="assets/layout/images/logo-white.png" alt="babylon-layout" /> */}
              <img
                id="layout-menu-logo"
                src="/images/logo.png"
                alt="babylon-layout"
                style={{ width: "100px", height: "100px" }}
              />
            </button>
          </div>
          <div
            className="layout-menu-wrapper"
            style={{
              flex: 1, // ให้ content ขยายเต็ม container
              overflowY: "auto", // เปิด scroll แนวตั้ง
              paddingBottom: "60px",
            }}
          >
            <div className="menu-scroll-content">
              {this.state.profileMode === "inline" &&
                this.state.layoutMode !== "horizontal" && (
                  <AppInlineProfile
                    inlineProfileActive={this.state.inlineProfileActive}
                    onInlineProfileClick={this.onInlineProfileClick}
                  />
                )}
              <AppMenu
                model={
                  this.state.grouped ? this.menuGrouped : this.menuUngrouped
                }
                onMenuItemClick={this.onMenuItemClick}
                onRootMenuItemClick={this.onRootMenuItemClick}
                layoutMode={this.state.layoutMode}
                active={this.state.menuActive}
              />
            </div>
          </div>
        </div>

        <div className="layout-main">
          <div className="layout-content">
            {/* ======================== ADM ======================== */}
            {getSession("login")?.result?.register_type_seq === 6 ? (
              <>
                <Route path="/LPADM01" component={LPADM01} />
                <Route path="/ADM13" component={ADM13} />
              </>
            ) : (
              <>
                <Route path="/LPADM01" component={LPADM01} />
                <Route path="/LPADM02" component={LPADM02} />
                <Route path="/LPADM03" component={LPADM03} />
                <Route path="/LPADM04" component={LPADM04} />
                <Route path="/LPADM05" component={LPADM05} />
                <Route path="/LPADM06" component={LPADM06} />

                <Route path="/LPSMS01" component={LPSMS01} />
                <Route path="/LPSMS02" component={LPSMS02} />
                <Route path="/LPSMS03" component={LPSMS03} />

                <Route path="/LPASM01" component={LPASM01} />
                <Route path="/LPASM02" component={LPASM02} />
                <Route path="/LPASM03" component={LPASM03} />
                <Route path="/LPASM04" component={LPASM04} />
                <Route path="/LPASM05" component={LPASM05} />

                <Route path="/ADM01" component={ADM01} />
                <Route path="/ADM02" component={ADM02} />
                <Route path="/ADM03" component={ADM03} />
                <Route path="/ADM04" component={ADM04} />
                <Route path="/ADM05" component={ADM05} />
                {/* <Route path="/ADM10" component={ADM10} /> */}
                <Route path="/ADM12" component={ADM12} />
                <Route path="/ADM13" component={ADM13} />
                <Route path="/ADM14" component={ADM14} />
                <Route path="/ADM16" component={ADM16} />
                <Route path="/LPSPS01" component={ADM11} />

                {/* ======================== DMS ======================== */}
                <Route path="/DMS01" component={DMS01} />
                <Route path="/DMS02" component={DMS02} />
                <Route path="/DMS03" component={DMS03} />
                <Route path="/DMS04" component={DMS04} />
                <Route path="/DMS05" component={DMS05} />
                <Route path="/DMS06" component={DMS06} />
                <Route path="/DMS07" component={DMS07} />
                <Route path="/DMS09" component={LPSMS03} />

                {/* ======================== DEA ======================== */}
                <Route path="/DEA01" component={DEA01} />
                <Route path="/LPSPS02" component={DEAMOCK02} />

                {/* ======================== DGR ======================== */}
                {/* <Route path="/LPSTS01" component={DGR01} />
                  <Route path="/LPSTS02" component={DGR02} />
                  <Route path="/LPSTS03" component={DGR03} />
                  <Route path="/LPSTS04" component={DGR04} /> */}
                {/* ======================== MSM ======================== */}
                <Route path="/MSM01" component={MSM01} />
                <Route path="/MSM02" component={MSM02} />
                <Route path="/MSM03" component={MSM03} />
                <Route path="/MSM04" component={MSM04} />
                <Route path="/MSM34" component={MSM34} />
                <Route path="/MSM35" component={MSM35} />
                <Route path="/MSM36" component={MSM36} />
                {/* <Route path="/SCS15" component={SCS15} />
                  <Route path="/SCS16" component={SCS16} /> */}

                {/* ======================== DBT ======================== */}
                <Route path="/DBT03" component={DBT03} />
                <Route path="/DBT05" component={DBT05} />
                <Route path="/DBT06" component={DBT06} />
                <Route path="/DBT07" component={DBT07} />
                <Route path="/DBT08" component={DBT08} />
                <Route path="/profile" component={<Profile />} />
              </>
            )}
          </div>
        </div>

        {this.state.staticMenuMobileActive && (
          <div className="layout-mask"></div>
        )}
      </div>
    );
  }
}

export default App;
