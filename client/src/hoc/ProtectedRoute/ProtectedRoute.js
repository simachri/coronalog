import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

class ProtectedRoute extends Component {
    render() {
        if(this.props.orIf || this.props.isAuth){
            return <Route {...this.props} />;
        } else {
            return <Redirect exact to={this.props.orElse} />;
        }
    }
}
ProtectedRoute.propTypes = {
    orElse: propTypes.string.isRequired,
    orIf: propTypes.bool,
    // and all propTypes from Route
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.username !== null
    };
};

export default connect(mapStateToProps)(ProtectedRoute);