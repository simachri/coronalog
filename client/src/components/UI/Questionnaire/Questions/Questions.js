import React from "react";

import classes from '../Questionnaire.module.css';
import StartPage, {TYPE_OPTIONS} from "../QTypes/Start/Start";
import OptionsPage, {TYPE_START} from "../QTypes/Options/Options";
import SelectPage, {TYPE_SELECT} from '../QTypes/Select/Select';
import InputPage, {TYPE_TEXT_INPUT} from "../QTypes/TextInput/TextInput";
import Question from "./Question/Question";

const mapToComp = ( obj ) => {
    switch(obj.type){
        case TYPE_START: return <Question><StartPage {...obj} /></Question>;
        case TYPE_OPTIONS: return <Question><OptionsPage {...obj} /></Question>;
        case TYPE_SELECT: return <Question><SelectPage {...obj} /></Question>;
        case TYPE_TEXT_INPUT: return <Question><InputPage {...obj} /></Question>
        default: return null;
    }
};

const questions = ( props ) => {

    const questions = [];
    props.qSpecs.forEach(
        pageSpec => questions.push(mapToComp(pageSpec))
    );

    return (
        <div className={classes.Anamnesis}>
            {questions}
        </div>
    );
};

export default questions;