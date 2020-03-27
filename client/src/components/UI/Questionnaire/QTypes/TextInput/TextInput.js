import React from "react";

import classes from '../../Questionnaire.module.css';
import TextInput from "../../../TextInput/TextInput";

const textInput = ( props ) => {
    return(
        <div className={classes.Question}>
            <div className={classes.Header}>{props.header}</div>
            <div className={classes.SubHeader}>{props.subHeader}</div>
            <div className={classes.AnswerTextInput}>
                <TextInput
                    name={props.name}
                    placeholder={props.placeholder}
                    verify={props.verify}
                />
            </div>
            <div className={classes.NoAnswer} onClick={props.onNoAnswer}>
                {props.noAnswerText}
            </div>
        </div>
    );
};

export const TYPE_TEXT_INPUT = 'type_text_input';
export default textInput;