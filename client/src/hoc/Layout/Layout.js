import React, { Component, Fragment } from "react"

import TabNav from '../../components/navigation/TabNav/TabNav';
import Navbar from '../../components/navigation/Navbar/Navbar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faInfoCircle, faUser, faColumns } from "@fortawesome/free-solid-svg-icons";

class Layout extends Component {

    navItems = [
        {
            title: 'Home',
            link: '/',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faHome} />
        },
        {
            title: 'Dashboard',
            link: '/dashboard',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faColumns} />
        },
        {
            title: 'About Us',
            link: '/about-us',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faInfoCircle} />
        },
        {
            title: 'User',
            link: '/user',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faUser} />
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