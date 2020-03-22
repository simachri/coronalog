import React from "react";

import classes from './DayItem.module.css';

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

    return (
        <div className={classes.DayItem}>
            <div className={classes.Weekday}>{getDay[props.date.getDay()]}</div>
            <div className={classes.DayOfMonth}>{props.date.getDate()}</div>
        </div>
    );
};

export default dayItem;