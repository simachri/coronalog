import React, { Component, Fragment } from "react";

class Layout extends Component {

    render() {
        return (
            <Fragment>
                <div>Layout</div>
                {this.props.children}
            </Fragment>
        );
    }

}

export default Layout;