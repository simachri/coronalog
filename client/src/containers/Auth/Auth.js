import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { withRouter, Redirect } from 'react-router-dom';

import classes from './Auth.module.scss';
import TextInput from '../../components/UI/TextInput/TextInput';
import Button from '../../components/UI/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';

class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            isSignin: this.getIsSignin()
        }
    }

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

        if (this.props.inSignupProcess){
            return <Redirect to='user-info' />;
        }

        if(this.props.redirect) {
            this.props.resetRedirect();
            return <Redirect to={this.props.redirect} />
        }

        let error = null;
        if(this.props.errorMsg){
            error = <p>{this.props.errorMsg}</p>;
        }

        let inputArea = null;
        if(this.props.isSignedIn){
            inputArea = 'Angemeldet als ' + this.props.username;
        } else {
            inputArea = (
                <TextInput 
                    val={this.state.username}
                    inputChangedHandler={event => this.setState({username: event.target.value})}
                    name='username'
                    placeholder='Dein Nutzername'
                    verify={/^(?!\s*$).+/}
                />
            );
        }

        let submitCaption = '';
        let submitMethod = null;
        if(this.props.isSignedIn){
            submitCaption = 'Logout';
            submitMethod = () => this.props.logout();
        } else {
            if(this.state.isSignin){
                submitCaption = 'Anmelden';
                submitMethod = () => this.props.signin(this.state.username);
            } else {
                submitCaption = 'Registrieren';
                submitMethod = () => this.props.signup(this.state.username);
            }
        }
        let submitButton = (
            <Button click={submitMethod}>
                {submitCaption}
            </Button>
        );
        if(this.props.loading){
            submitButton = <Spinner />;
        }

        return (
            <div className={classes.Auth}>
                <h1>
                    Coronalog
                </h1>
                <div className={classes.Card}>
                    {error}
                    <div className={classes.UsernameInput}>
                        {inputArea}
                    </div>
                    <div className={classes.Submit}>
                        {submitButton}
                    </div>
                    {!this.props.isSignedIn 
                        ? 
                            <div className={classes.SwitchMode} onClick={this.changeMethodHandler}>
                                {this.state.isSignin ? 'Jetzt registrieren' : 'Bereits registriert?'}
                            </div>
                        : null}
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
        inSignupProcess: state.auth.currentlySignup,
        redirect: state.auth.redirectTo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signin: (username) => dispatch(actions.signin(username)),
        signup: (username) => dispatch(actions.signup(username)),
        logout: () => dispatch(actions.logout()),
        resetRedirect: () => dispatch(actions.resetRedirect())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(Auth)
);