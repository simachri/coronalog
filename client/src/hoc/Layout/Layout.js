import React, { Component, Fragment } from "react"

import TabNav from '../../components/navigation/TabNav/TabNav';
import Navbar from '../../components/navigation/Navbar/Navbar';

import {ReactComponent as HomeIcon} from "../../assets/nav_home_icon.svg";
import {ReactComponent as InfoIcon} from "../../assets/nav_info_icon.svg";
import {ReactComponent as UserIcon} from "../../assets/nav_user_icon.svg";
import {ReactComponent as DashboardIcon} from "../../assets/nav_dashboard_icon.svg";

class Layout extends Component {

    navItems = [
        {
            title: 'Home',
            link: '/',
            exact: true,
            svgIcon: <HomeIcon />,
        },
        {
            title: 'Dashboard',
            link: '/dashboard',
            exact: true,
            svgIcon: <DashboardIcon />,
        },
        {
            title: 'About Us',
            link: '/about-us',
            exact: true,
            svgIcon: <InfoIcon />,
        },
        {
            title: 'User',
            link: '/user',
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
                <TabNav items={this.navItems} showTitle={false} />
            </Fragment>
        );
    }

}

export default Layout;