import React, {Component} from "react";
import { scrollTo } from "../../../../util/utility";

import classes from '../Questionnaire.module.css';
import StartPage, {TYPE_START} from "../QTypes/Start/Start";
import OptionsPage, {TYPE_OPTIONS} from "../QTypes/Options/Options";
import SelectPage, {TYPE_SELECT} from '../QTypes/Select/Select';
import InputPage, {TYPE_TEXT_INPUT} from "../QTypes/TextInput/TextInput";
import Question, { NO_ANSWER } from "./Question/Question";
import EndPage, { TYPE_END } from './../QTypes/End/End';
import MultiOptionsPage, { TYPE_MULTI_OPTIONS } from './../QTypes/MultiOptions/MultiOptions';

const mapToComp = ( obj, ref, hideBack, onGoBack, hideResume, resumeHandler, value, extraSelected, valueChangedHandler, onNoAnswer ) => {
    switch(obj.type){
        case TYPE_START:
            return (
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    hideBack={hideBack}
                    onResume={resumeHandler}
                    hideResume={hideResume}
                >
                    <StartPage
                        {...obj}
                        onResume={resumeHandler}
                    />
                </Question>
            );
        case TYPE_OPTIONS:
            return (
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    hideBack={hideBack}
                    onResume={resumeHandler}
                    hideResume={hideResume}
                >
                    <OptionsPage
                        {...obj}
                        value={value}
                        extraTextSelected={extraSelected}
                        valueChanged={valueChangedHandler}
                        onNoAnswer={onNoAnswer}
                    />
                </Question>
            );
        case TYPE_MULTI_OPTIONS:
            return(
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    hideBack={hideBack}
                    onResume={resumeHandler}
                    hideResume={hideResume}
                >
                    <MultiOptionsPage
                        {...obj}
                        value={value}
                        valueChanged={valueChangedHandler}
                        onNoAnswer={onNoAnswer}
                    />
                </Question>
            );
        case TYPE_SELECT:
            return (
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    hideBack={hideBack}
                    onResume={resumeHandler}
                    hideResume={hideResume}
                >
                    <SelectPage
                        {...obj}
                        value={value}
                        valueChanged={valueChangedHandler}
                        onNoAnswer={onNoAnswer}
                    />
                </Question>
            );
        case TYPE_TEXT_INPUT:
            return (
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    hideBack={hideBack}
                    onResume={resumeHandler}
                    hideResume={hideResume}
                >
                    <InputPage
                        {...obj}
                        value={value}
                        valueChanged={valueChangedHandler}
                        onNoAnswer={onNoAnswer}
                    />
                </Question>
            );
        case TYPE_END:
            return (
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    hideBack={hideBack}
                    onResume={resumeHandler}
                    hideResume={hideResume}
                >
                    <EndPage
                        {...obj}
                    />
                </Question>
            );
        default: return null;
    }
};

class Questions extends Component {

    state = this.initState();

    initState() {
        const initState = {};
        for (let curConf of this.props.qSpecs){
            switch(curConf.type){
                case TYPE_OPTIONS:
                    const selectedId = curConf.val;
                    const selectedAnswer = curConf.answers.find(answer => answer.id === selectedId);
                    initState[curConf.name] = {};
                    if(selectedAnswer) {
                        initState[curConf.name].value = selectedAnswer.value;
                        initState[curConf.name].extraSelected = selectedAnswer.textInput === true;
                    }
                    else {
                        initState[curConf.name].value = '';
                        initState[curConf.name].extraSelected = false;
                    }
                    break;
                case TYPE_MULTI_OPTIONS:
                    initState[curConf.name] = {
                        value: curConf.val ? curConf.val : []
                    };
                    break;
                case TYPE_TEXT_INPUT:
                    initState[curConf.name] = {
                        value: curConf.val ? curConf.val : ''
                    };
                    break;
                case TYPE_SELECT:
                    initState[curConf.name] = {
                        value: curConf.val ? curConf.val : ''
                    };
                    break;
                default:
                    break;
            }
        }
        return initState;
    }

    valChangedHandler = (name, val, extraSelected = false) => {
        const newState = {
            [name] : {
                value: val,
                extraSelected: extraSelected
            },
        };
        this.setState(newState);
    };

    getResumeHandler = ( elementRef, allRefs ) => {
        const idx = allRefs.findIndex( ref => ref === elementRef);
        if(idx < 0 || idx >= allRefs.length) return null;
        return () => scrollTo(allRefs[idx + 1]);
    };

    getGoBackHandler = ( elementRef, allRefs ) => {
        const idx = allRefs.findIndex( ref => ref === elementRef);
        if(idx < 0 || idx >= allRefs.length) return null;
        return () => scrollTo(allRefs[idx - 1]);
    };

    render() {
        console.log(this.state)
        const questions = [];
        const refs = [];
        this.props.qSpecs.forEach( (pageSpec, idx) => {
            refs.push(React.createRef());
            const hideBack = idx === 0;
            const hideResume = this.props.qSpecs.slice(-1)[0] === pageSpec ? true : false;
            questions.push(
                mapToComp(
                    pageSpec,
                    refs.slice(-1)[0],
                    hideBack,
                    (!hideBack ? this.getGoBackHandler(refs.slice(-1)[0], refs) : null),
                    hideResume,
                    (!hideResume ? this.getResumeHandler(refs.slice(-1)[0], refs) : null),
                    (pageSpec.type !== TYPE_START && pageSpec.type !== TYPE_END ? this.state[pageSpec.name].value : null),
                    (pageSpec.type === TYPE_OPTIONS ? this.state[pageSpec.name].extraSelected : null),
                    (value, extraSelected = false) => this.valChangedHandler(pageSpec.name, value, extraSelected),
                    () => this.valChangedHandler(pageSpec.name, NO_ANSWER)
                )
            );
        });

        return (
            <div className={classes.Anamnesis}>
                {questions}
            </div>
        );
    }
};

export default Questions;