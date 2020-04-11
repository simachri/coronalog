import React from "react";

import classes from './AddDayItem.module.scss';
import propTypes from 'prop-types';

const AddDayItem = ( props ) => (
    <div onClick={props.onClick} className={classes.AddDayItem}>
        <div className={classes.AddSymbol}>+</div>
        <div className={classes.AddDescr}>Heute</div>
    </div>
);
AddDayItem.propTypes = {
    onClick: propTypes.func,
}

export default AddDayItem;