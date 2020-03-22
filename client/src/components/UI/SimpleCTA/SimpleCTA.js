import React from "react";
import {NavLink} from "react-router-dom";
import Button from '../Button/Button';

import classes from './SimpleCTA.module.css';

const simpleCTA = ( props ) => (
    <div>
        <h2 className={props.headerClasses}>{props.header}</h2>
        <p>{props.content}</p>
        <div className={classes.FullWidthButton}>
            <NavLink to='/user' exact>
                <Button>{props.ctaLabel}</Button>
            </NavLink>
        </div>
    </div>
);

export default simpleCTA;