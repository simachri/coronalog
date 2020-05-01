import React from "react";
import propTypes from 'prop-types';

import classes from '../../Questionnaire.module.css';
import Input from "../../../Input/Input";
import {NO_ANSWER} from '../../Questions/Question/Question';
import {arrToCss} from '../../../../../util/utility';

const textInput = ( props ) => {

    const noAnswerClasses = [classes.NoAnswer];
    if(props.value === NO_ANSWER){
        noAnswerClasses.push(classes.NoAnswerSelected);
    }

    return(
        <div className={classes.Question}>
            <div className={classes.Header}>{props.header + (props.required ? ' *' : '')}</div>
            <div className={classes.SubHeader}>{props.subHeader}</div>
            <div className={classes.AnswerTextInput}>
                <Input
                    elementType='input'
                    elementConfig={{
                        type: 'text',
                        name: props.name,
                        placeholder: props.placeholder
                    }}
                    verify={props.verify}
                    val={props.value !== NO_ANSWER ? props.value : ''}
                    inputChangedHandler={event => props.valueChanged(event.target.value)}
                />
            </div>
            
            {!props.required ? (
                <div 
                    className={arrToCss(noAnswerClasses)}
                    onClick={this.props.onNoAnswer}
                >
                {props.noAnswerText}
                </div>
            ) : null}
        </div>
    );
};

textInput.propTypes = {
    header: propTypes.string.isRequired,
    subHeader: propTypes.string,
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
    verify: propTypes.objectOf(RegExp),
    onNoAnswer: propTypes.func,
    noAnswerText: propTypes.string,
    value: propTypes.oneOfType([
        propTypes.string,
        propTypes.number
    ]).isRequired,
    valueChanged: propTypes.func.isRequired,
    required: propTypes.bool
};

export const TYPE_TEXT_INPUT = 'type_text_input';
export default textInput;