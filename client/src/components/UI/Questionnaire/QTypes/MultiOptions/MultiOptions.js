import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './MultiOptions.module.css';
import qClasses from '../../Questionnaire.module.css';
import { arrToCss } from './../../../../../util/utility';
import { NO_ANSWER } from './../../Questions/Question/Question';
import TextInput from './../../../TextInput/TextInput';

class MultiOptions extends Component {

    state = {
        textInput: ''
    };

    optionSelected = (optionId, extraOption) => {
        let newVal = {};

        //init options when NO_ANSWER was previously selected
        if(this.props.value === NO_ANSWER){
            for (let option of this.props.options){
                newVal[option.id] = false;
            }
            if (this.props.addOptions){
                newVal[this.props.addOptions.id] = null;
            }
        } else {
            newVal = {...this.props.value};
        }
        
        if(optionId === NONE_ANSWER) {
            for (let optionId in newVal) {
                newVal[optionId] = false;
            }
            this.props.valueChanged(newVal, false);
        } else if(!extraOption){
            newVal[optionId] = !this.props.value[optionId];
            this.props.valueChanged(newVal, this.props.extraSelected);
        } else {
            if(this.props.extraSelected){
                newVal[optionId] =  null;
                this.props.valueChanged(newVal, false);
            } else {
                newVal[optionId] =  this.state.textInput;
                this.props.valueChanged(newVal, true);
            }
        }
    }

    textTyped = (event) => {
        this.setState({textInput: event.target.value});
        const newVal = {...this.props.value};
        newVal[this.props.addOptions.id] = event.target.value;
        this.props.valueChanged(newVal, true);
    }

    render() {

        let options = this.props.options.map(option => (
            <div 
                key={option.id} 
                onClick={() => this.optionSelected(option.id)}
                className={classes.Option + ' ' + (this.props.value[option.id] ? classes.Selected : '')}
            >
                {option.label}
            </div>
        ));

        if(this.props.addOptions){
            options.push(
                <div
                    key={this.props.addOptions.id}
                    onClick={() => this.optionSelected(this.props.addOptions.id, true)}
                    className={classes.Option + ' ' + (this.props.extraSelected ? classes.Selected : '')}
                >
                    {this.props.addOptions.label}
                </div>
            )
        }

        let noneSelected = this.props.value !== NO_ANSWER;
        for (let optionId in this.props.value) {
            noneSelected = noneSelected && !this.props.value[optionId];
        }
        const noneClasses = [classes.Option];
        if (noneSelected) noneClasses.push(classes.Selected);

        const noAnswerClasses = [qClasses.NoAnswer];
        if(this.props.value === NO_ANSWER){
            noAnswerClasses.push(qClasses.NoAnswerSelected);
        }

        const inputClass = this.props.extraSelected ? qClasses.Show : qClasses.Hide;

        const textInput = (
            this.props.addOptions ?
                <div className={inputClass}>
                    <TextInput
                        name={this.props.addOptions.id}
                        val={this.state.textInput}
                        inputChangedHandler={(event) => this.textTyped(event)}
                />
                </div>
                : null
        );

        return (
            <div className={qClasses.Question}>
                <div className={qClasses.Header}>{this.props.header}</div>
                <div className={qClasses.SubHeader}>{this.props.subHeader}</div>

                <div className={classes.Options}>
                    <div 
                        className={arrToCss(noneClasses)}
                        onClick={() => this.optionSelected(NONE_ANSWER)}
                    >
                        {this.props.allFalseLabel}
                    </div> 
                    <br />
                    {options}
                </div>

                {textInput}

                <div 
                    className={arrToCss(noAnswerClasses)}
                    onClick={this.props.onNoAnswer}
                >
                    {this.props.noAnswerText}
                </div>
            </div>
        );
    }
}

MultiOptions.propTypes = {
    header: propTypes.string.isRequired,
    subHeader: propTypes.oneOfType([
        propTypes.string,
        propTypes.element
    ]),
    options: propTypes.arrayOf(propTypes.shape({
        id: propTypes.string,
        label: propTypes.string,
    })).isRequired,
    addOptions: propTypes.shape({
        id: propTypes.string,
        label: propTypes.string,
    }),
    extraSelected: propTypes.bool,
    val: propTypes.shape({
        id: propTypes.string,
        val: propTypes.oneOfType([propTypes.bool, propTypes.string])
    }).isRequired,
    noAnswerText: propTypes.string,
    onNoAnswer: propTypes.func,
    valueChanged: propTypes.func.isRequired,
    allFalseLabel: propTypes.string.isRequired
};

export const NONE_ANSWER = 'NONE_ANSWER_H6fg!?/h&f';
export const TYPE_MULTI_OPTIONS = 'type_multi_options';
export default MultiOptions;