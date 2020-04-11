import React from "react";

import classes from './AddDayItem.module.scss';

const AddDayItem = ( props ) => (
    <div className={classes.AddDayItem}>
        <div className={classes.AddSymbol}>+</div>
        <div className={classes.AddDescr}>Heute</div>
    </div>
);

export default AddDayItem;