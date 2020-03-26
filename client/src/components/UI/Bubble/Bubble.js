import React from "react";

import classes from './Bubble.module.css';

const bubble = ( props ) => (
    <div className={classes.Bubble}>
        <div className={classes.Triangle}></div>
        <p>{props.text}</p>
    </div>
);

export default bubble;