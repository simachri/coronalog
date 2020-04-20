import React from "react";
import propTypes from 'prop-types';

import classes from '../../Questionnaire.module.css';
import Picker, {TYPE_YEAR} from '../../../Picker/Picker';
import {NO_ANSWER} from '../../Questions/Question/Question';
import {arrToCss} from '../../../../../util/utility';

const mapToComp = ( spec ) => {
    switch(spec.type){
        case TYPE_YEAR:
            return (
                <Picker
                    name={spec.name}
                    type={TYPE_YEAR}
                    from={spec.from}
                    to={spec.to}
                    value={spec.value}
                    grey={spec.value === NO_ANSWER}
                    changed={(event) => spec.changeHander(parseInt(event.target.value))}
                />
            );
        default:
            return null;
    }
};

const select = ( props ) => {

    const noAnswerClasses = [classes.NoAnswer];
    if(props.value === NO_ANSWER){
        noAnswerClasses.push(classes.NoAnswerSelected);
    }

    return(
        <div className={classes.Question}>
            <div className={classes.Header}>{props.header + (props.required ? ' *' : '')}</div>
            <div className={classes.SubHeader}>{props.subHeader}</div>
            <div className={classes.AnswerSelect}>
                {mapToComp({...props.selectSpec,
                     name: props.name,
                     changeHander: props.valueChanged,
                     value: props.value
                     })}
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

select.propTypes = {
    header: propTypes.string.isRequired,
    subHeader: propTypes.string,
    selectSpec: propTypes.shape({
        type: propTypes.oneOf([TYPE_YEAR]),
        from: propTypes.number,
        to: propTypes.number,
        selected: propTypes.number
    }).isRequired,
    name: propTypes.string.isRequired,
    valueChanged: propTypes.func.isRequired,
    onNoAnswer: propTypes.func,
    noAnswerText: propTypes.string,
    required: propTypes.bool
};

export const TYPE_SELECT = 'type_select';
export default select;