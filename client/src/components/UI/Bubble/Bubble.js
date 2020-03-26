import React from "react";
import propTypes from 'prop-types';

import classes from './Bubble.module.css';

const bubble = ( props ) => (
    <div style={{width: 'calc(' + (props.text.length * 2) + 'rem + 10px)'}} className={classes.Bubble}>
        <div className={classes.Triangle}></div>
        <p>{props.text}</p>
    </div>
);

bubble.propTypes = {
    text: propTypes.string
};

export default bubble;