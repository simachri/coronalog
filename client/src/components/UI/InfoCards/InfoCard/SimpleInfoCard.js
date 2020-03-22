import React from "react";

import classes from './InfoCard.module.css';

const simpleInfoCard = ( props ) => (
    <div className={classes.InfoCard}>
        <h2 className={props.headerClasses}>{props.header}</h2>
        <p className={classes.Content}>{props.content}</p>
    </div>
);

export default simpleInfoCard;