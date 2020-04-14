import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import propTypes from 'prop-types';

import classes from './Auth.module.scss';
import TextInput from '../../components/UI/TextInput/TextInput';
import Button from '../../components/UI/Button/Button';
import Spinner from './../../components/UI/Spinner/Spinner';

class Auth extends Component {

    state = {
        username: '',
    }

    render() {

        let submitButton = (
            <Button click={() => this.props.signin(this.state.username)}>
                {this.props.isSignup ? 'Registrieren' : 'Anmelden'}
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
                    <div className={classes.UsernameInput}>
                        <TextInput 
                            val={this.state.username}
                            inputChangedHandler={event => this.setState({username: event.target.value})}
                            name='username'
                            placeholder='Dein Nutzername'
                            verify={/^(?!\s*$).+/}
                        />
                    </div>
                    <div className={classes.Submit}>
                        {submitButton}
                    </div>
                    <div className={classes.SwitchMode}>
                        {this.props.isSignup ? 'Bereits registriert?' : 'Jetzt registrieren'}
                    </div>
                </div>
            </div>
        )
    }
}
Auth.propTypes = {
    isSignup: propTypes.bool
};

const mapStateToProps = state => {
    return {
        isSignedIn: state.auth.username !== null,
        loading: state.auth.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signin: (username) => dispatch(actions.signin(username))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);