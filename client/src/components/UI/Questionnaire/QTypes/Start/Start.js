import React from "react";

import classes from '../../Questionnaire.module.css';

import Button from '../../../Button/Button';

const start = ( props ) => (
    <div className={classes.Start}>
        <div className={classes.Header}>{props.header}</div>
        <div className={classes.SubHeader}>{props.subHeader}</div>
        <Button additionalClasses={classes.ResumeButton} click={props.onResume}>Starten</Button>
    </div>
);

export default start;
export const TYPE_START = 'type_start';