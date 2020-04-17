import React from 'react';
import propTypes from 'prop-types';

import classes from './DayItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { arrToCss } from './../../../../util/utility';

const getDay = {
    0: 'So',
    1: 'Mo',
    2: 'Di',
    3: 'Mi',
    4: 'Do',
    5: 'Fr',
    6: 'Sa'
};

const DayItem = (props) => {

    const checkClasses = [classes.Checkmark];
    if(!props.checked){
        checkClasses.push(classes.hidden);
    }

    const itemClasses = [classes.DayItem];
    if(props.blueBg){
        itemClasses.push(classes.BlueBg);
    }

    const borderStyle = {};
    if (props.border) {
        borderStyle.border = '2px solid ' + props.border;
    }

    return (
        <div 
            className={arrToCss(itemClasses)}
            style={borderStyle}
        >
            <div className={arrToCss(checkClasses)}>
                <FontAwesomeIcon icon={faCheck} />
            </div>
            <div className={classes.WeekdayLabel}>{getDay[props.date.getDay()]}</div>
            <div className={classes.DayLabel}>{props.date.getDate()}</div>
        </div>
    );

};
DayItem.propTypes = {
    checked: propTypes.bool,
    date: propTypes.objectOf(Date).isRequired,
    blueBg: propTypes.bool,
    border: propTypes.string
};

export default DayItem;