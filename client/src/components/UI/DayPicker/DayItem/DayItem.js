import React from 'react';
import propTypes from 'prop-types';

import classes from './DayItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { arrToCss } from './../../../../util/utility';
import { Link } from 'react-router-dom';

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
    if(props.checked) {
        itemClasses.push(classes.Checked);
    }
    if(props.selected) {
        itemClasses.push(classes.Selected);
    }

    const borderStyle = {};
    if (props.selected) {
        borderStyle.border = '3px solid ' + props.selected;
    }

    return (
        <div
            onClick={props.onSelect}
            className={arrToCss(itemClasses)}
            style={borderStyle}
        >
            <div className={arrToCss(checkClasses)}>
                <FontAwesomeIcon icon={faCheck} />
            </div>
            <div className={classes.WeekdayLabel}>{getDay[props.date.getDay()]}</div>
            <div className={classes.DayLabel}>{props.date.getDate()}</div>

            <Link to={props.linkTo} className={classes.LinkToQ}>
                <FontAwesomeIcon icon={props.checked ? faPen : faPlus} />
            </Link>
        </div>
    );

};
DayItem.propTypes = {
    checked: propTypes.bool,
    date: propTypes.objectOf(Date).isRequired,
    blueBg: propTypes.bool,
    selected: propTypes.string,
    linkTo: propTypes.string,
    onSelect: propTypes.func
};

export default DayItem;