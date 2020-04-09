import React from 'react';
import propTypes from 'prop-types';

import classes from './TextInput.module.css';

const TextInput = ( props ) => {

    return (
        <div className={
            classes.InputWrapper + 
            ' ' +
            (!props.val || props.verify.test(props.val) ? classes.Valid : classes.Invalid)
        }>
           {props.label ? <label>{props.label}</label> : null}
            <input
                type='text'
                name={props.name}
                placeholder={props.placeholder}
                value={props.val}
                onChange={props.inputChangedHandler}
            />
        </div>
    )
};

TextInput.propTypes = {
    val: propTypes.oneOfType([
        propTypes.string,
        propTypes.number
    ]),
    inputChangedHandler: propTypes.func,
    label: propTypes.string,
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
};

export default TextInput;