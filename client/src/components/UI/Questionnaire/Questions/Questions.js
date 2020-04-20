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

const mapToComp = ( obj, ref, onGoBack, resumeHandler, value, extraSelected, valueChangedHandler, onNoAnswer, onSave, loading ) => {
    switch(obj.type){
        case TYPE_START:
            return (
                <Question
                    key={obj.name}
                    outerRef={ref}
                    onGoBack={onGoBack}
                    onResume={resumeHandler}
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
                    onResume={resumeHandler}
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
                    onResume={resumeHandler}
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
                    onResume={resumeHandler}
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
                    onResume={resumeHandler}
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
                    onResume={resumeHandler}
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
            switch(curConf.type){

                case TYPE_OPTIONS:
                    initState[curName] = {};

                    if (this.props.values && this.props.values[curName]) {
                        //if specified in props.values
                        const curVal = this.props.values[curName];
                        initState[curName].value = curVal;
                        initState[curName].extraSelected = !curConf.answers.some(answer => !answer.textInput && answer.value === curVal);

                    } else {
                        //if not specified in props.values
                        initState[curName].value = curConf.defaultVal ? curConf.defaultVal : NO_ANSWER;
                        initState[curName].extraSelected = false;
                    }
                    break;

                case TYPE_MULTI_OPTIONS:

                    initState[curName] = { value: {}};
                    if (this.props.values) {
                        //if specified in props.values
                        let contained = false;
                        for (let option of curConf.options) {
                            if (this.props.values[option.id] !== undefined && this.props.values[option.id] !== null) {
                                contained = true;
                                initState[curName].value[option.id] = this.props.values[option.id] ? true : false;
                            } else {
                                initState[curName].value[option.id] = false;
                            }
                            if (curConf.addOptions) {
                                if (this.props.values[curConf.addOptions.id]) {
                                    contained = true;
                                    initState[curName].value[curConf.addOptions.id] = this.props.values[curConf.addOptions.id];
                                    initState[curName].extraSelected = true;
                                } else {
                                    initState[curName].value[curConf.addOptions.id] = '';
                                    initState[curName].extraSelected = false;
                                }
                            }
                        }
                        if (!contained) {
                            initState[curName].value = NO_ANSWER;
                        }

                    } else {
                        //if not specified props.values
                        initState[curName].value = curConf.defaultVal ? curConf.defaultVal : NO_ANSWER;
                        initState[curName].extraSelected = false;
                    }
                    break;
                case TYPE_TEXT_INPUT:
                    initState[curName] = {
                        value: this.props.values && this.props.values[curName] 
                            ? this.props.values[curName]
                            : curConf.defaultVal ? curConf.defaultVal : NO_ANSWER
                    };
                    break;
                case TYPE_SELECT:
                    initState[curName] = {
                        value: this.props.values && this.props.values[curName] 
                        ? this.props.values[curName]
                        : curConf.defaultVal ? curConf.defaultVal : NO_ANSWER
                    };
                    break;
                default:
                    break;
            }
        }
        return {
            values: initState,
            refs: this.props.qSpecs.map(config => React.createRef())
        };
    }

    getFlattennedState = () => {
        const flatState = {};
        for (let key in this.state.values){
            if (this.state.values[key].value.constructor.name === 'Object'){
                for (let deepKey in this.state.values[key].value){
                    if (!this.state.values[key].value[deepKey] && this.props.qSpecs.find(conf => conf.name === key).addOptions && deepKey === this.props.qSpecs.find(conf => conf.name === key).addOptions.id) {
                        flatState[deepKey] = null;
                    } else {
                        flatState[deepKey] = this.state.values[key].value[deepKey];
                    }
                }
            } else if(this.state.values[key].value !== NO_ANSWER && this.state.values[key].value !== ''){
                flatState[key] = this.state.values[key].value;
            } else {
                flatState[key] = NO_ANSWER;
            }
        }

        const flatStateFull = {};
        //map NO_ANSWER to null values
        for (let key in flatState) {
            if (flatState[key] !== NO_ANSWER) {
                flatStateFull[key] = flatState[key];
            } else {
                const config = this.props.qSpecs.find(conf => conf.name === key);
                if (config && config.type === TYPE_MULTI_OPTIONS) {
                    for (let option of config.options) {
                        flatStateFull[option.id] = null;
                    }
                    if (config.addOptions) {
                        flatStateFull[config.addOptions.id] = null;
                    }
                } else {
                    flatStateFull[key] = null;
                }
            }
        }

        return flatStateFull;
    }

    valChangedHandler = (name, val, extraSelected = false) => {
        this.setState({ 
            values: {
                ...this.state.values,
                [name] : {
                    value: val,
                    extraSelected: extraSelected
                }
            } 
        });
    };

    saveHandler = () => {
        //check if all required fields are set to !NO_ANSWER
        const answerNeeded = [];
        for (let key in this.state.values) {
            const idx = this.props.qSpecs.findIndex(config => config.name === key);
            if (this.props.qSpecs[idx].required
                && this.state.values[key].value === NO_ANSWER) {
                    answerNeeded.push(idx);
            } else if ( this.props.qSpecs[idx].verify && this.state.values[key].value !== NO_ANSWER
                && !this.props.qSpecs[idx].verify.test(this.state.values[key].value)) {
                    answerNeeded.push(idx);
                }
        }
        
        if (answerNeeded.length > 0) {
            scrollTo(this.state.refs[answerNeeded[0]]);
        } else {
            this.props.onSave(this.getFlattennedState());
        }
    }

    render() {
        
        const questions = [];
        this.props.qSpecs.forEach( (pageSpec, idx) => {
            
            const hideBack = idx === 0;
            const hideResume = this.props.qSpecs.slice(-1)[0] === pageSpec ? true : false;
            questions.push(
                mapToComp(
                    pageSpec,
                    this.state.refs[idx],
                    hideBack ? null : () => scrollTo(this.state.refs[idx-1]),
                    hideResume ? null : () => scrollTo(this.state.refs[idx+1]),
                    (pageSpec.type !== TYPE_START && pageSpec.type !== TYPE_END ? this.state.values[pageSpec.name].value : null),
                    (pageSpec.type === TYPE_OPTIONS || pageSpec.type === TYPE_MULTI_OPTIONS ? this.state.values[pageSpec.name].extraSelected : null),
                    (value, extraSelected = false) => this.valChangedHandler(pageSpec.name, value, extraSelected),
                    () => this.valChangedHandler(pageSpec.name, NO_ANSWER),
                    this.saveHandler,
                    this.props.loading
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
Questions.propTypes = {
    qSpecs: propTypes.array.isRequired,
    onSave: propTypes.func,
    loading: propTypes.bool,
    values: propTypes.object
};

export default Questions;