import React from "react";
import propTypes from 'prop-types';

import { arrToCss } from '../../../util/utility';

import classes from './Bubble.module.css';

const bubble = ( props ) => {

    const bubbleClasses = [classes.Bubble];
    if(props.selected){
        bubbleClasses.push(classes.Selected);
    }
    if(props.clicked){
        bubbleClasses.push(classes.Button);
    }

    return (
        <div
            style={{width: 'calc(60px + ' + props.text.length + 'ex)'}}
            className={arrToCss(bubbleClasses)}
            onClick={props.clicked}
        >
            <div className={classes.Triangle}></div>
            <p>{props.text}</p>
        </div>
    );
};

bubble.propTypes = {
    text: propTypes.string.isRequired,
    selected: propTypes.bool,
    clicked: propTypes.func
};

export default bubble;