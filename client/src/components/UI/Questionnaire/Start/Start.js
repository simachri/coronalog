import React from "react";

import classes from '../../../../containers/Questionnaire/Questionnaire.module.css';

const start = ( props ) => (
    <div className={classes.Header}>{props.header}</div>
);

export default start;