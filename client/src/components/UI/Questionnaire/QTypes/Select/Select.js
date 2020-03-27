import React from "react";

import classes from '../../Questionnaire.module.css';
import Picker, {TYPE_YEAR} from '../../../Picker/Picker';

const mapToComp = ( obj ) => {
    switch(obj.select_type){
        case TYPE_YEAR:
            return (
                <Picker
                    name={obj.name}
                    type={TYPE_YEAR}
                    from={obj.from}
                    to={obj.to}
                />
            );
        default:
            return null;
    }
};

const select = ( props ) => {
    return(
        <div className={classes.Question}>
            <div className={classes.Header}>{props.header}</div>
            <div className={classes.SubHeader}>{props.subHeader}</div>
            <div className={classes.AnswerSelect}>
                {mapToComp(props)}
            </div>
            <div className={classes.NoAnswer} onClick={props.onNoAnswer}>
                {props.noAnswerText}
            </div>
        </div>
    );
};

export const TYPE_SELECT = 'type_select';
export default select;