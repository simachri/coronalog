import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

class ProtectedRoute extends Component {
    render() {
        if(this.props.isAuth){
            return <Route {...this.props} />;
        } else {
            return <Redirect exact to={this.props.orElse} />;
        }
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.username !== null
    };
};

export default connect(mapStateToProps)(ProtectedRoute);