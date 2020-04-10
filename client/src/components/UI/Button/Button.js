import React from "react";
import propTypes from 'prop-types';

import classes from './Button.module.css';

const button = ( props ) => {

    let cssClasses = [classes.Button];
    if (props.additionalClasses) {
        cssClasses = [...props.additionalClasses, classes.Button];
    }

    if(!props.wrap)
        return (
            <button
                className={cssClasses.join(' ')}
                onClick={props.click}>
                <div>{props.children}</div>
            </button>
        );
    else
        return (
            <div className={cssClasses.join(' ')}>
                <button
                    onClick={props.click}>
                    <div>{props.children}</div>
                </button>
            </div>
        );
}

button.propTypes = {
    wrap: propTypes.bool,
    additionalClasses: propTypes.arrayOf(propTypes.string),
    click: propTypes.func,
}

export default button;