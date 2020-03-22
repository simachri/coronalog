import React from "react";

import classes from './Button.module.css';

const button = ( props ) => {

    const cssClasses = [classes.Button];
    if (props.additionalClasses) {
        cssClasses.push(props.additionalClasses);
    }

    return (
        <button
            className={cssClasses.join(' ')}
            onClick={props.click}>
            <div>{props.children}</div>
        </button>
    );
}

export default button;