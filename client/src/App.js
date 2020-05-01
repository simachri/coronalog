import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions';

import AboutUs from './containers/AboutUs/AboutUs';
import Home from './containers/Home/Home';
import Dashboard from './containers/Dashboard/Dashboard';
import Layout from "./hoc/Layout/Layout";
import GeneralAnamnesis from "./containers/GeneralAnamnesis/GeneralAnamnesis";
import SymptomAnamnesis from './containers/SymptomAnamnesis/SymptomAnamnesis';
import Auth from './containers/Auth/Auth';
import ProtectedRoute from './hoc/ProtectedRoute/ProtectedRoute';

class App extends Component {

    constructor(props) {
        super(props);
        props.tryAutoSignin();
    }


    render() {

        if(this.props.redirect) {
            this.props.resetRedirect();
            return <Redirect to={this.props.redirect} />
        }

        let routes = (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about-us" component={AboutUs} />
                <ProtectedRoute exact path='/dashboard' component={Dashboard} orElse='/auth' />
                <ProtectedRoute exact path='/user-info' component={GeneralAnamnesis} orElse='/auth' />
                <ProtectedRoute exact path='/daily-q' component={SymptomAnamnesis} orElse='/auth' />
                <Route exact path='/info' render={() => <h1>Info Page</h1>} />
                <Route exact path='/auth' component={Auth} />
                <Redirect to="/" />
            </Switch>
        );

        return (
            <div>
                <Layout>
                    {routes}
                </Layout>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        redirect: state.general.redirectTo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetRedirect: () => dispatch(actions.resetRedirect()),
        tryAutoSignin: () => dispatch(actions.checkAuthState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));