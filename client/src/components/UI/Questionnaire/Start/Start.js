import React from "react";

import classes from '../../../../containers/Questionnaire/Questionnaire.module.css';

import Button from '../../Button/Button';

const start = ( props ) => (
    <div className={props.pageClasses}>
        <div className={classes.Header}>{props.header}</div>
        <Button additionalClasses={classes.QButton} click={props.onResume}>Starten</Button>
    </div>
);

export default start;