import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class AppInlineProfile extends Component {

    static defaultProps = {
        inlineProfileActive: false,
        onInlineProfileClick: null
    }

    static propTypes = {
        inlineProfileActive: PropTypes.bool.isRequired,
        onInlineProfileClick: PropTypes.func.isRequired
    }

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return  (
            <div className={classNames('layout-profile', {'layout-profile-active': this.props.inlineProfileActive})}>
                <button className="layout-profile-button p-link" onClick={this.props.onInlineProfileClick}>
                    <img src="assets/layout/images/avatar.png" alt="babylon-layout"/>
                    <div className="layout-profile-userinfo">
                        <span className="layout-profile-name">Arlene Welch</span>
                        <span className="layout-profile-role">Design Ops</span>
                    </div>
                    <i className="layout-profile-icon pi pi-angle-down"/>
                </button>

                <ul className="layout-profile-menu">
                    <li role="menuitem">
                        <button className="p-link" tabIndex={this.props.inlineProfileActive ? null : '-1'}>
							<i className="pi pi-user"/>
							<span>Profile</span>
                        </button>
                    </li>
                    <li role="menuitem">
                        <button className="p-link" tabIndex={this.props.inlineProfileActive ? null : '-1'}>
							<i className="pi pi-cog"/>
							<span>Settings</span>
                        </button>
                    </li>
                    <li role="menuitem">
                        <button className="p-link" tabIndex={this.props.inlineProfileActive ? null : '-1'}>
							<i className="pi pi-envelope"/>
							<span>Messages</span>
                        </button>
                    </li>
                    <li role="menuitem">
                        <button className="p-link" tabIndex={this.props.inlineProfileActive ? null : '-1'}>
							<i className="pi pi-bell"/>
							<span>Notifications</span>
                        </button>
                    </li>
                </ul>
            </div>
        )
    }
}
