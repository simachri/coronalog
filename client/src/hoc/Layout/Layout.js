import React, { Component, Fragment } from "react"

import TabNav from '../../components/navigation/TabNav/TabNav';
import Navbar from '../../components/navigation/Navbar/Navbar';
import Bubble from '../../components/UI/Bubble/Bubble';
import { NAV_BAR_AT } from '../../contentConf/General';

import {ReactComponent as AnalysisIcon} from "../../assets/nav_analysis_icon.svg";
import {ReactComponent as InfoIcon} from "../../assets/nav_info_icon.svg";
import {ReactComponent as UserIcon} from "../../assets/nav_user_icon.svg";
import {ReactComponent as DashboardIcon} from "../../assets/nav_dashboard_icon.svg";

class Layout extends Component {

    navItems = [
        {
            title: 'Dashboard',
            link: '/dashboard',
            exact: true,
            svgIcon: <DashboardIcon />,
        },
        {
            title: 'Analysis',
            link: '/',
            exact: true,
            svgIcon: <AnalysisIcon />
        },
        {
            title: 'About Us',
            link: '/about-us',
            exact: true,
            svgIcon: <InfoIcon />,
        },
        {
            title: 'User',
            link: '/questionnaire',
            exact: true,
            svgIcon: <UserIcon />,
        }
    ];

    render() {
        return (
            <Fragment>
                <Navbar />
                <main>
                    {this.props.children}
                </main>
                {NAV_BAR_AT.includes(this.props.currentLocation.pathname)
                    ? <TabNav items={this.navItems} showTitle={false} />
                    : null}
            </Fragment>
        );
    }

}

export default Layout;