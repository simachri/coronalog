import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { withRouter } from 'react-router-dom';

import classes from './Auth.module.scss';
import Spinner from './../../components/UI/Spinner/Spinner';
import Signin from '../../components/auth/Signin/Signin';
import Signup from '../../components/auth/Signup/Signup';
import Button from '../../components/UI/Button/Button';
import axios from '../../axios-main';

class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {
            isSignin: this.getIsSignin(),
            vendors: null,
            error: null
        }
    }

    getVendors = () => {
        axios.get('/auth/vendors')
            .then(res => this.setState({vendors: res.data}))
            .catch(err => this.setState({error: 'An unexpected error has occurred'}));
    }

    componentDidMount(){
        if (!this.state.isSignin) {
            this.getVendors();
        }
    }

    componentDidUpdate() {
        if (!this.state.vendors && !this.state.error && !this.state.isSignin) {
            this.getVendors()
        }
    }

    // extract from url whether signin or signup
    getIsSignin = () => {
        const params = new URLSearchParams(this.props.location.search);
        switch(params.get('method')){
            case 'signin':
                return true;
            case 'signup':
                return false;
            default:
                return true;
        }
    }

    changeMethodHandler = () => {
        this.setState(prevState => {
            const newMethod = prevState.isSignin ? 'signup' : 'signin';
            this.props.history.replace({
                search: '?method=' + newMethod
            });
            return {isSignin: !prevState.isSignin};
        })
    }

    render() {

        //loading vendors or loading failed
        if (!this.state.isSignin && !this.state.vendors) {
            if (!this.state.error) {
                return <Spinner />
            } else {
                return <p>{this.state.error}</p>
            }
        }

        let error = null;
        if(this.props.errorMsg){
            error = <p>{this.props.errorMsg}</p>;
        }

        let inputArea = null;
        if(this.props.isSignedIn){
            inputArea = 'Angemeldet als ' + this.props.username;
        } else if (this.state.isSignin) {
            inputArea = <Signin 
                onSubmit={(username, password) => this.props.signin(username, password)} 
                loading={this.props.loading}
            />
        } else {
            inputArea = <Signup
                onSubmit={(username, pw1, pw2, vendor) => this.props.signup(username, pw1, pw2, vendor)}
                loading={this.props.loading}
                vendors={this.state.vendors}
            />
        }

        return (
            <div className={classes.Auth}>
                <h1>
                    Coronalog
                </h1>
                <div className={classes.Card}>
                    {error}
                    {inputArea}
                    {!this.props.isSignedIn 
                        ? 
                            <div className={classes.SwitchMode} onClick={this.changeMethodHandler}>
                                {this.state.isSignin ? 'Jetzt registrieren' : 'Bereits registriert?'}
                            </div>
                        :   <Button click={this.props.logout}>Logout</Button>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isSignedIn: state.auth.username !== null,
        username: state.auth.username,
        loading: state.auth.loading,
        errorMsg: state.auth.errorMsg,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signin: (username, password) => dispatch(actions.signin(username, password)),
        signup: (username, password1, password2, vendor) => dispatch(actions.signup(username, password1, password2, vendor)),
        logout: () => dispatch(actions.logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(Auth)
);