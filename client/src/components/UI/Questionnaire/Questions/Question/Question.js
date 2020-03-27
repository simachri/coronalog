import React from "react";

import classes from '../../Questionnaire.module.css';

const question = (props ) => {
    return (
        <div className={classes.Page}>
            {props.children}
        </div>
    );
};

export default question;