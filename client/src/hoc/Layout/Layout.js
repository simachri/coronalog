import React, { Component, Fragment } from "react"

import TabNav from '../../components/navigation/TabNav/TabNav';
import Navbar from '../../components/navigation/Navbar/Navbar';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

class Layout extends Component {

    navItems = [
        {
            title: 'Home',
            link: '/',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faCoffee} />
        },
        {
            title: 'Dashboard',
            link: '/dashboard',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faCoffee} />
        },
        {
            title: 'About Us',
            link: '/about-us',
            exact: true,
            faIcon: <FontAwesomeIcon icon={faCoffee} />
        }
    ];

    render() {

        return (
            <Fragment>
                <Navbar />
                <main>
                    {this.props.children}
                </main>
                <TabNav items={this.navItems} />
            </Fragment>
        );
    }

}

export default Layout;