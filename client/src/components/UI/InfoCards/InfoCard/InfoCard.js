import React from "react";

import classes from './InfoCard.module.css';
import {toCss} from "../../../../util/utility";

const infoCard = ( props ) => (
    <div className={classes.InfoCard}>
        <div className={classes.Icon}>
            {props.svgIcon}
        </div>
        <h3 style={{color: props.cardHeaderColor}} className={classes.SmallHeader}>{props.header}</h3>
        <p className={classes.Content}>{props.content}</p>
    </div>
);

export default infoCard;