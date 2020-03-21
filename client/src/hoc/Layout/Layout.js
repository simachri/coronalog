import React, { Component, Fragment } from "react";

import Navbar from '../../components/navigation/Navbar/Navbar';

class Layout extends Component {

    render() {
        return (
            <Fragment>
                <Navbar />
                <main>
                    {this.props.children}
                </main>
            </Fragment>
        );
    }

}

export default Layout;