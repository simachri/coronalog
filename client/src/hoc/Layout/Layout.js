import React, { Component, Fragment } from "react"
import { withRouter } from 'react-router-dom';

import TabNav from '../../components/navigation/TabNav/TabNav';
import Navbar from '../../components/navigation/Navbar/Navbar';
import { NAV_BAR_AT, NAV_ITEMS } from '../../contentConf/General';

class Layout extends Component {

    render() {
        return (
            <Fragment>
                <Navbar />
                <main>
                    {this.props.children}
                </main>
                {NAV_BAR_AT.includes(this.props.location.pathname)
                    ? <TabNav items={NAV_ITEMS} showTitle={false} />
                    : null}
            </Fragment>
        );
    }

}

export default withRouter(Layout);