import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from './../../store/actions/index';

import {SYMPTOM_ANAMNESIS_QUESTIONS} from "../../contentConf/SymptomAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";
import { sameDay } from '../../util/utility';
import { withRouter, Redirect } from 'react-router-dom';

class SymptomAnamnesis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.getDateFromSearch()
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

        if (!this.state.date) {
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
        records: state.records.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveAndPostRecord: (date, symptoms) => {
            dispatch(actions.setRecord(date, symptoms));
            dispatch(actions.postRecord(date, symptoms));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(SymptomAnamnesis)
);