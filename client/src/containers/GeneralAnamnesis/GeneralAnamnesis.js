import React, {Component} from 'react';
import { connect } from 'react-redux';

import {GENERAL_ANAMNESIS_QUESTIONS} from "../../contentConf/GeneralAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";
import * as actions from './../../store/actions/index';

class GeneralAnamnesis extends Component {

    saveHandler = (anamnesisData) => {
        if (this.props.currentlySignup){
            this.props.endSignupProcess(
                this.props.currentlySignup.username,
                anamnesisData
            );
        } else {
            this.props.saveAndPostAnamnesis(this.props.username, anamnesisData);
        }
    }

    render() {
        return (
            <Questions 
                onSave={this.saveHandler}
                loading={this.props.loading}
                qSpecs={GENERAL_ANAMNESIS_QUESTIONS}
                values={this.props.userAnamnesis}
            />
        );
    }

}

const mapStateToProps = state => {
    return {
        currentlySignup: state.auth.currentlySignup,
        loading: state.auth.loading || state.anamnesis.loading,
        userAnamnesis: state.anamnesis.data,
        username: state.auth.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        endSignupProcess: (username, data) => dispatch(actions.endSignupProcess(username, data)),
        saveAndPostAnamnesis: (username, data) => {
            dispatch(actions.setAnamnesisData(data));
            dispatch(actions.postAnamnesisData(username));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralAnamnesis);