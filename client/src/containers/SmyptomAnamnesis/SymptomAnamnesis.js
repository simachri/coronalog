import React, {Component} from 'react';

import {SYMPTOM_ANAMNESIS_QUESTIONS} from "../../contentConf/SymptomAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";

class SymptomAnamnesis extends Component {

    render() {
        return (
            <Questions qSpecs={SYMPTOM_ANAMNESIS_QUESTIONS}  />
        );
    }

}

export default SymptomAnamnesis;