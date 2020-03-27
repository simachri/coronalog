import React from "react";

import classes from '../../Questionnaire.module.css';
import Bubble from "../../../Bubble/Bubble";

const options = ( props ) => (
    <div className={classes.Question}>
        <div className={classes.Header}>{props.header}</div>
        <div className={classes.SubHeader}>{props.subHeader}</div>
        <div className={classes.Answers}>
            {props.answers.map((val, idx) => (
                <div className={classes.Answer}>
                    <Bubble key={val + idx} text={val} />
                </div>
            ))}
            <div className={classes.NoAnswer} onClick={props.onNoAnswer}>
                {props.noAnswerText}
            </div>
        </div>
    </div>
);

export default options;
export const TYPE_START = 'type_start';