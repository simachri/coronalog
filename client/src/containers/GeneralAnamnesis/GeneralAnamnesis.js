import React, {Component} from 'react';
import { connect } from 'react-redux';

import {GENERAL_ANAMNESIS_QUESTIONS} from "../../contentConf/GeneralAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";
import * as actions from './../../store/actions/index';
import { POST_ANAMENSIS_DATA_SUCCESS, POST_ANAMNESIS_DATA_FAIL } from '../../store/actions/actionTypes';

class GeneralAnamnesis extends Component {

    saveHandler = (anamnesisData) => {
        this.props.saveAndPostAnamnesis(anamnesisData);
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
        loading: state.auth.loading || state.anamnesis.loading,
        userAnamnesis: state.anamnesis.data,
        username: state.auth.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveAndPostAnamnesis: (data) => {
            dispatch(actions.redirectOn('/dashboard', POST_ANAMENSIS_DATA_SUCCESS, POST_ANAMNESIS_DATA_FAIL));
            dispatch(actions.setAnamnesisData(data));
            dispatch(actions.postAnamnesisData());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralAnamnesis);