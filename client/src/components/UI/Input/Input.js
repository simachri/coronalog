import React from 'react';
import propTypes from 'prop-types';

import classes from './Input.module.css';

const Input = ( props ) => {

    let inputElement = null;
    switch(props.elementType) {
        case 'input':
            inputElement = (
                <div className={
                    classes.InputWrapper + 
                    ' ' +
                    (!props.val || !props.verify || props.verify.test(props.val) ? classes.Valid : classes.Invalid)
                }>
                   {props.label ? <label>{props.label}</label> : null}
                    <input
                        {...props.elementConfig}
                        value={props.val}
                        onChange={props.inputChangedHandler}
                    />
                </div>
            )
            break;

        case 'select':
            inputElement = (
                <div className={classes.InputWrapper}>
                    <select
                        {...props.elementConfig}
                        value={props.val}
                        onChange={props.inputChangedHandler}
                    >
                        {props.elementConfig.options.map(option => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label ? option.label : option.value}
                            </option>
                        ))}
                    </select>
                </div>
            )
            break;

        default:
            inputElement = null;
    }

    return inputElement;
};

Input.propTypes = {
    val: propTypes.oneOfType([
        propTypes.string,
        propTypes.number
    ]),
    inputChangedHandler: propTypes.func,
    label: propTypes.string,
    verify: propTypes.objectOf(RegExp),
    elementType: propTypes.string,
    elementConfig: propTypes.object
};

export default Input;