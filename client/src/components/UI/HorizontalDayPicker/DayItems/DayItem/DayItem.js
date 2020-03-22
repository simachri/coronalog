import React from "react";

import classes from './DayItem.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const getDay = {
    0: 'So',
    1: 'Mo',
    2: 'Di',
    3: 'Mi',
    4: 'Do',
    5: 'Fr',
    6: 'Sa'
};

const dayItem = ( props ) => {
    const checkClasses = [classes.checked];
    if(props.checked){
        checkClasses.push(classes.hidden);
    }
    return (
        <div className={classes.DayItem}>
            <div className={checkClasses}>
                <FontAwesomeIcon icon={faCheck} />
            </div>
            <div className={classes.Weekday}>{getDay[props.date.getDay()]}</div>
            <div className={classes.DayOfMonth}>{props.date.getDate()}</div>
        </div>
    );
};

export default dayItem;