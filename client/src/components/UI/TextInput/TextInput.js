import React, {useState} from 'react';

import classes from './TextInput.module.css';

const TextInput = ( props ) => {

    const [val, setVal] = useState('');

    const inputChangedHandler = ( event ) => {
        if(props.verify.test(event.target.value)){
            setVal(event.target.value);
        }
    };

    return (
        <div className={classes.InputWrapper}>
            <label>{props.label}</label>
            <input
                type='text'
                name={props.name}
                placeholder={props.placeholder}
                value={val}
                onChange={inputChangedHandler}
            />
        </div>
    )
};

export default TextInput;