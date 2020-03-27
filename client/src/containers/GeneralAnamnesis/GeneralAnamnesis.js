import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Options from "../../components/UI/Questionnaire/QTypes/Options/Options";

import classes from './GeneralAnamnesis.module.css';
import Start from "../../components/UI/Questionnaire/QTypes/Start/Start";
import { scrollTo } from "../../util/utility";
import {GENERAL_ANAMNESIS_QUESTIONS} from "../../contentConf/GeneralAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";

class GeneralAnamnesis extends Component {

    render() {
        return (
            <Questions qSpecs={GENERAL_ANAMNESIS_QUESTIONS} />
        );
    }

}

GeneralAnamnesis.propTypes = {};

export default GeneralAnamnesis;