import React from "react";
import { scrollTo } from "../../../../util/utility";

import classes from '../Questionnaire.module.css';
import StartPage, {TYPE_OPTIONS} from "../QTypes/Start/Start";
import OptionsPage, {TYPE_START} from "../QTypes/Options/Options";
import SelectPage, {TYPE_SELECT} from '../QTypes/Select/Select';
import InputPage, {TYPE_TEXT_INPUT} from "../QTypes/TextInput/TextInput";
import Question from "./Question/Question";

const mapToComp = ( obj, name, ref, resumeHandler ) => {
    switch(obj.type){
        case TYPE_START: return <Question key={name} outerRef={ref} onResume={resumeHandler}><StartPage {...obj} /></Question>;
        case TYPE_OPTIONS: return <Question key={name} outerRef={ref} onResume={resumeHandler}><OptionsPage {...obj} /></Question>;
        case TYPE_SELECT: return <Question key={name} outerRef={ref} onResume={resumeHandler}><SelectPage {...obj} /></Question>;
        case TYPE_TEXT_INPUT: return <Question key={name} outerRef={ref} hideResume><InputPage {...obj} /></Question>
        default: return null;
    }
};

const questions = ( props ) => {

    const resumeHandler = ( elementRef, allRefs ) => {
        return () => {
            const idx = allRefs.findIndex( ref => ref === elementRef);
            if(idx < 0 || idx >= allRefs.length) return null;
            scrollTo(allRefs[idx + 1]);
        }
    };

    const questions = [];
    const refs = [];
    props.qSpecs.forEach( (pageSpec) => {
        refs.push(React.createRef());
        questions.push(mapToComp(pageSpec, pageSpec.name, refs.slice(-1)[0], resumeHandler(refs.slice(-1)[0], refs)));
    });

    return (
        <div className={classes.Anamnesis}>
            {questions}
        </div>
    );
};

export default questions;