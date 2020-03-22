import React from "react";

import classes from './Button.module.css';

const button = ( props ) => {

    const cssClasses = [classes.Button];
    if (!props.wrap && props.additionalClasses) {
        cssClasses.push(props.additionalClasses);
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

export default button;