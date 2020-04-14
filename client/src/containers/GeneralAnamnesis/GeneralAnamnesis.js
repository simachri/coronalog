import React, {Component} from 'react';
import { connect } from 'react-redux';

import {GENERAL_ANAMNESIS_QUESTIONS} from "../../contentConf/GeneralAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";
import * as actions from './../../store/actions/index';
import { Redirect } from 'react-router-dom';

class GeneralAnamnesis extends Component {

    saveHandler = (anamnesisData) => {
        if (this.props.currentlySignup){
            this.props.endSignupProcess(
                this.props.currentlySignup.username,
                anamnesisData
            );
        }
    }

    render() {

        if(this.props.redirect){
            this.props.resetRedirect();
            return <Redirect to={this.props.redirect} />;
        }

        return (
            <Questions 
                onSave={this.saveHandler}
                loading={this.props.loading}
                qSpecs={GENERAL_ANAMNESIS_QUESTIONS}  
            />
        );
    }

}

const mapStateToProps = state => {
    return {
        currentlySignup: state.auth.currentlySignup,
        loading: state.auth.loading,
        redirect: state.auth.redirectTo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        endSignupProcess: (username, data) => dispatch(actions.endSignupProcess(username, data)),
        resetRedirect: () => dispatch(actions.resetRedirect())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralAnamnesis);