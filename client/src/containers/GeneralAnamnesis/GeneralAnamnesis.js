import React, {Component} from 'react';

import {GENERAL_ANAMNESIS_QUESTIONS} from "../../contentConf/GeneralAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";

class GeneralAnamnesis extends Component {

    render() {
        return (
            <Questions qSpecs={GENERAL_ANAMNESIS_QUESTIONS}  />
        );
    }

}

export default GeneralAnamnesis;