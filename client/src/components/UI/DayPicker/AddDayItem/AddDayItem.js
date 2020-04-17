import React from "react";

import classes from './AddDayItem.module.scss';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AddDayItem = ( props ) => (
    <Link to={props.linkTo} className={classes.AddDayItem}>
        <div className={classes.AddSymbol}>+</div>
        <div className={classes.AddDescr}>Heute</div>
    </Link>
);
AddDayItem.propTypes = {
    linkTo: propTypes.string
}

export default AddDayItem;