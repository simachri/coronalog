import React, {Component} from "react";
import propTypes from 'prop-types';
import { scrollTo } from "../../../../util/utility";

import classes from '../Questionnaire.module.css';
import StartPage, {TYPE_START} from "../QTypes/Start/Start";
import OptionsPage, {TYPE_OPTIONS} from "../QTypes/Options/Options";
import SelectPage, {TYPE_SELECT} from '../QTypes/Select/Select';
import InputPage, {TYPE_TEXT_INPUT} from "../QTypes/TextInput/TextInput";
import Question, { NO_ANSWER } from "./Question/Question";
import EndPage, { TYPE_END } from './../QTypes/End/End';
import MultiOptionsPage, { TYPE_MULTI_OPTIONS } from './../QTypes/MultiOptions/MultiOptions';

const mapToComp = ( obj, ref, hideBack, onGoBack, hideResume, resumeHandler, value, extraSelected, valueChangedHandler, onNoAnswer, onSave, loading ) => {
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
                        extraSelected={extraSelected}
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
                        onSave={onSave}
                        showLoading={loading}
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

            const curName = curConf.name;
            initState[curName] = {};
            switch(curConf.type){

                case TYPE_OPTIONS:

                    if (this.props.values && this.props.values[curName]) {
                        //if specified in props.values
                        const curVal = this.props.values[curName];
                        initState[curName].value = curVal;
                        initState[curName].extraSelected = !curConf.answers.some(answer => !answer.textInput && answer.value === curVal);

                    } else {
                        //if not specified in props.values
                        const selectedId = curConf.val;
                        const selectedAnswer = curConf.answers.find(answer => answer.id === selectedId);
                        if(selectedAnswer) {
                            initState[curName].value = selectedAnswer.value;
                            initState[curName].extraSelected = selectedAnswer.textInput === true;
                        }
                        else {
                            initState[curName].value = '';
                            initState[curName].extraSelected = false;
                        }
                    }
                    break;

                case TYPE_MULTI_OPTIONS:

                    initState[curName] = { value: {}};
                    if (this.props.values) {
                        //if specified in props.values
                        for (let option of curConf.options) {
                            if (this.props.values[option.id] !== undefined) {
                                initState[curName].value[option.id] = this.props.values[option.id] ? true : false;
                            } else {
                                initState[curName].value[option.id] = curConf.val[option.id] ? true : false;
                            }
                            if (curConf.addOptions) {
                                if (this.props.values[curConf.addOptions.id]) {
                                    initState[curName].value[curConf.addOptions.id] = this.props.values[curConf.addOptions.id];
                                    initState[curName].extraSelected = true;
                                } else {
                                    initState[curName].value[curConf.addOptions.id] = '';
                                    initState[curName].extraSelected = false;
                                }
                            }
                        }

                    } else {
                        //if not specified in props.values
                        for (let option of curConf.options) {
                            initState[curName].value[option.id] = curConf.val[option.id] ? true : false;
                        }
                        if (curConf.addOptions) {
                            initState[curName].value[curConf.addOptions.id] = curConf.val[curConf.addOptions.id] || null;
                            initState[curName].extraSelected = curConf.val[curConf.addOptions.id] ? true : false;
                        } else {
                            initState[curName].extraSelected = false;
                        }
                    }
                    break;
                case TYPE_TEXT_INPUT:
                    initState[curName] = {
                        value: this.props.values && this.props.values[curName] 
                            ? this.props.values[curName]
                            : curConf.val ? curConf.val : ''
                    };
                    break;
                case TYPE_SELECT:
                    initState[curName] = {
                        value: this.props.values && this.props.values[curName] 
                        ? this.props.values[curName]
                        : curConf.val ? curConf.val : ''
                    };
                    break;
                default:
                    break;
            }
        }
        return initState;
    }

    getFlattennedState = () => {
        const flatState = {};
        for (let key in this.state){
            if (this.state[key].value.constructor.name === 'Object'){
                for (let deepKey in this.state[key].value){
                    if(this.state[key].value !== NO_ANSWER && this.state[key].value[deepKey] !== ''){ 
                        flatState[deepKey] = this.state[key].value[deepKey];
                    }
                }
            } else {
                if(this.state[key].value !== NO_ANSWER&& this.state[key].value !== ''){
                    flatState[key] = this.state[key].value;
                }
            }
        }
        return flatState;
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
                    (pageSpec.type === TYPE_OPTIONS || pageSpec.type === TYPE_MULTI_OPTIONS ? this.state[pageSpec.name].extraSelected : null),
                    (value, extraSelected = false) => this.valChangedHandler(pageSpec.name, value, extraSelected),
                    () => this.valChangedHandler(pageSpec.name, NO_ANSWER),
                    () => this.props.onSave(this.getFlattennedState()),
                    this.props.loading
                )
            );
        });
        
        console.log(this.state)
        return (
            <div className={classes.Anamnesis}>
                {questions}
            </div>
        );
    }
};
Questions.propTypes = {
    qSpecs: propTypes.array.isRequired,
    onSave: propTypes.func,
    loading: propTypes.bool,
    values: propTypes.object
};

export default Questions;