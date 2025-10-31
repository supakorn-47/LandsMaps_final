import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { setSession, getSession } from "./utils/Crypto";

class AppSubmenu extends Component {
  static defaultProps = {
    className: null,
    items: null,
    onMenuItemClick: null,
    onRootItemClick: null,
    root: false,
    layoutMode: null,
    menuActive: false,
  };

  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array,
    onMenuItemClick: PropTypes.func,
    onRootItemClick: PropTypes.func,
    root: PropTypes.bool,
    layoutMode: PropTypes.string,
    menuActive: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onMenuItemClick(event, item, index) {
    let token = getSession("login").result.token;
    console.log(item);

    if (item.label === "Argo") {
      window.open(
        `${process.env.REACT_APP_URL_ARGO}?token=${token}&redirect_uri=https://pipr-uat-argo.dol.go.th/auth/login?return_url=https%3A%2F%2Fpipr-uat-argo.dol.go.th%2Fapplications`,
        "_blank"
      );
    } else if (item.label === "Kaili") {
      window.open(
        `${process.env.REACT_APP_URL_KAILI}?token=${token}&redirect_uri=http://pipr-kaili.dol.go.th/kiali/api/auth/openid_redirect`,
        "_blank"
      );
    } else if (item.label === "Grafana") {
      window.open(
        `${process.env.REACT_APP_URL_GRAFANA}?token=${token}&redirect_uri=https://pipr-grafana.dol.go.th/login/generic_oauth`,
        "_blank"
      );
    } else if (item.label === "WSO2") {
      window.open(
        `${process.env.REACT_APP_URL_WSO2}?token=${token}&redirect_uri=https://pipr-mgt.dol.go.th/`,
        "_blank"
      );
    } else if (item.label === "Gitlab") {
      window.open(
        `${process.env.REACT_APP_URL_GITLAB}?token=${token}&redirect_uri=https://pipr-uat-gitlab.dol.go.th/`,
        "_blank"
      );
    } else if (item.label === "Nexus Repos") {
      window.open(
        `${process.env.REACT_APP_URL_NEXUSREPOS}/#browse/browse`,
        "_blank"
      );
    } else if(item.label ==="ระบบ MyLands : ที่ดินของฉัน"){
      window.open(`https://mylands.dol.go.th/mylandsbypass?${getSession("login").result.mylands_token}`, "_blank");
    } else if (item.label === "PDPA") {
      window.open(`${process.env.REACT_APP_URL_PDPA}`, "_blank");
    } else if (item.label === "ตรวจสอบเครื่องแม่ข่าย") {
      let a = document.createElement("a");
      a.href = "https://172.16.42.129:8060/";
      a.target = "_blank";
      a.click();
    } else {
      if (!item.group) {
        localStorage.setItem(
          "nameMenu",
          item.to.replace("/", "") + " " + item.label
        );
      }
      //avoid processing disabled items
      if (item.disabled) {
        event.preventDefault();
        return true;
      }

      if (this.props.root && this.props.onRootItemClick) {
        this.props.onRootItemClick({
          originalEvent: event,
          item: item,
        });
      }

      //execute command
      if (item.command) {
        item.command({ originalEvent: event, item: item });
      }

      if (index === this.state.activeIndex)
        this.setState({ activeIndex: null });
      else this.setState({ activeIndex: index });

      if (this.props.onMenuItemClick) {
        this.props.onMenuItemClick({
          originalEvent: event,
          item: item,
        });
      }
    }
  }

  onKeyDown(event, item, index) {
    if (event.key === "Enter") {
      this.onMenuItemClick(event, item, index);
    }
  }

  onMenuItemMouseEnter(index) {
    if (this.props.root && this.props.menuActive && this.isHorizontalOrSlim()) {
      this.setState({ activeIndex: index });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.isHorizontalOrSlim() &&
      prevProps.menuActive &&
      !this.props.menuActive
    ) {
      this.setState({ activeIndex: null });
    }
  }

  isHorizontalOrSlim() {
    return (
      this.props.layoutMode === "horizontal" || this.props.layoutMode === "slim"
    );
  }

  renderLinkContent(item) {
    let submenuIcon = item.items && (
      <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
    );
    let badge = item.badge && (
      <span className="menuitem-badge">{item.badge}</span>
    );

    return (
      <React.Fragment>
        <i className={classNames("layout-menuitem-icon", item.icon)}></i>
        <span className="layout-menuitem-text">{item.label}</span>
        {/* {submenuIcon} */}
        {badge}
      </React.Fragment>
    );
  }

  onMenuItemMixClick(event, item) {
    //avoid processing disabled items
    localStorage.setItem(
      "nameMenu",
      item.to.replace("/", "") + " " + item.label
    );

    if (this.props.onMenuItemClick) {
      this.props.onMenuItemClick({
        originalEvent: event,
        item: item,
      });
    }
  }

  renderLink(item, i) {
    if (!item.label && item.items) return;

    let content = this.renderLinkContent(item);
    if (item.to) {
      if (item.to.indexOf("ADM") !== -1 || item.to.indexOf("DBT") !== -1) {
        return (
          <NavLink
            activeClassName="active-route"
            to={item.to}
            onClick={(e) => this.onMenuItemClick(e, item, i)}
            exact
            role="menuitem"
            target={item.target}
            onMouseEnter={(e) => this.onMenuItemMouseEnter(i)}
            className={item.styleClass}
          >
            {content}
          </NavLink>
        );
      } else {
        return (
          <NavLink
            activeClassName="active-route"
            to={item.to}
            onClick={(e) => this.onMenuItemMixClick(e, item)}
            exact
            role="menuitem"
            target={item.target}
            onMouseEnter={(e) => this.onMenuItemMouseEnter(i)}
            className={item.styleClass}
          >
            {content}
          </NavLink>
        );
      }
    } else if (item.open) {
      return (
        <a
          href={item.url}
          tabIndex={item.url ? "" : 0}
          role="menuitem"
          onClick={(e) => this.onMenuItemClick(e, item, i)}
          target={item.target}
          onMouseEnter={(e) => this.onMenuItemMouseEnter(i)}
          onKeyDown={(e) => this.onKeyDown(e, item, i)}
          className={item.styleClass}
        >
          {content}
        </a>
      );
    } else {
      return (
        <a
          href={item.url}
          tabIndex={item.url ? "" : 0}
          role="menuitem"
          onClick={(e) => this.onMenuItemClick(e, item, i)}
          target={item.target}
          onMouseEnter={(e) => this.onMenuItemMouseEnter(i)}
          onKeyDown={(e) => this.onKeyDown(e, item, i)}
          className={item.styleClass}
          style={{
            backgroundColor: "#",
            padding: "10px",
            borderLeft: "1px solid #E0E0E0",
            borderTop: "1px solid #E0E0E0",
          }}
        >
          {content}
        </a>
      );
    }
  }

  render() {
    const items =
      this.props.items &&
      this.props.items.map((item, i) => {
        let active = this.state.activeIndex === i;
        let styleClass = classNames(
          item.badgeStyleClass,
          { "layout-root-menuitem": this.props.root },
          { "active-menuitem": active }
        );
        let tooltip = this.props.root && (
          <div className="layout-menu-tooltip">
            <div className="layout-menu-tooltip-arrow"></div>
            <div className="layout-menu-tooltip-text">{item.label}</div>
          </div>
        );

        return (
          <li className={styleClass} key={i} role="none">
            {item.items && this.props.root === true && (
              <div className="arrow"></div>
            )}
            {this.props.root && (
              <div className="layout-main-menu">
                {this.renderLink(item, i)}
                {/* <span className="layout-menuitem-text">{item.label}</span> */}
              </div>
            )}
            {this.renderLink(item, i)}
            {tooltip}
            {item.to ? (
              ""
            ) : (
              <CSSTransition
                classNames="layout-submenu"
                timeout={{ enter: 400, exit: 400 }}
                in={active}
              >
                <AppSubmenu
                  items={item.items}
                  onMenuItemClick={this.props.onMenuItemClick}
                  layoutMode={this.props.layoutMode}
                  menuActive={this.props.menuActive}
                />
              </CSSTransition>
            )}
          </li>
        );
      });

    return items ? (
      <ul
        role="menu"
        className={this.props.className}
        style={{ fontSize: "14px", fontWeight: 400 }}
      >
        {items}
      </ul>
    ) : null;
  }
}

export class AppMenu extends Component {
  static defaultProps = {
    model: null,
    onMenuItemClick: null,
    onRootMenuItemClick: null,
    layoutMode: null,
    active: false,
  };

  static propTypes = {
    model: PropTypes.array,
    layoutMode: PropTypes.string,
    onMenuItemClick: PropTypes.func,
    onRootMenuItemClick: PropTypes.func,
    active: PropTypes.bool,
  };

  render() {
    return (
      <AppSubmenu
        items={this.props.model}
        className="layout-menu"
        menuActive={this.props.active}
        onRootItemClick={this.props.onRootMenuItemClick}
        onMenuItemClick={this.props.onMenuItemClick}
        root={true}
        layoutMode={this.props.layoutMode}
      />
    );
  }
}
