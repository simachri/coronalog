import React from "react";

import classes from './AddDayItem.module.css';

const addDayItem = ( props ) => (
    <div className={classes.AddDayItem}>
        <div className={classes.AddSymbol}>+</div>
        <div className={classes.AddDescr}>Heute</div>
    </div>
);

export default addDayItem;