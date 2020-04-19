import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from './../../store/actions/index';

import {SYMPTOM_ANAMNESIS_QUESTIONS} from "../../contentConf/SymptomAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";
import { sameDay } from '../../util/utility';
import { withRouter, Redirect } from 'react-router-dom';
import { POST_RECORD_SUCCESS } from './../../store/actions/actionTypes';

class SymptomAnamnesis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.getDateFromSearch(),
            successfullySaved: false
        };
    }

    getDateFromSearch = () => {
        const params = new URLSearchParams(this.props.location.search);
        const date = params.get('date');

        return date;
    }

    saveHandler = (symptoms) => {
        this.props.saveAndPostRecord(this.state.date, symptoms);
    }

    getThisDaysSymptoms = () => {
        const record = this.props.records.find(record => sameDay(record.date, this.state.date));
        if (record) {
            return record.symptoms;
        }
        return null;
    }

    render() {

        if (!this.state.date || new Date().getTime() < new Date(this.state.date).getTime()
            || this.state.successfullySaved && !this.props.loading &&!this.props.errorMsg) {
            return <Redirect to='/dashboard' />;
        }

        return (
            <Questions 
                onSave={this.saveHandler}
                loading={this.props.loading}
                qSpecs={SYMPTOM_ANAMNESIS_QUESTIONS}
                values={this.getThisDaysSymptoms()}  
            />
        );
    }

}

const mapStateToProps = state => {
    return {
        loading: state.records.loading,
        error: state.records.errorMsg,
        records: state.records.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveAndPostRecord: (date, symptoms) => {
            dispatch(actions.redirectOn('/dashboard', POST_RECORD_SUCCESS));
            dispatch(actions.setRecord(date, symptoms));
            dispatch(actions.postRecord(date, symptoms));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(SymptomAnamnesis)
);