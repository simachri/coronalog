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
        }
    }

    render() {
        return (
            <Questions 
                onSave={this.saveHandler}
                qSpecs={GENERAL_ANAMNESIS_QUESTIONS}  
            />
        );
    }

}

const mapStateToProps = state => {
    return {
        currentlySignup: state.auth.currentlySignup
    };
};

const mapDispatchToProps = dispatch => {
    return {
        endSignupProcess: (username, data) => dispatch(actions.endSignupProcess(username, data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralAnamnesis);