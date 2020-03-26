import React, { Fragment } from 'react';

import classes from './TextInput.module.css';

const textInput = ( props ) => (
    <div className={classes.InputWrapper}>
        <label>{props.label}</label>
        <input
            type='text'
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />
    </div>
);

export default textInput;