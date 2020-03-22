import React from "react";
import  { NavLink } from 'react-router-dom';

import classes from './TabNav.module.css';

const tabNav = ( props ) => {

    const containerClasses = [classes.MobileOnly, classes.TabNav];

    const navItems = props.items.map( (item, idx) =>  (
        <NavLink
            className={classes.TabNavItem}
            key={idx}
            to={item.link}
            exact={item.exact}>
            <div>
                {item.faIcon}
                {props.showTitle ? <div>{item.title}</div> : null}
            </div>
        </NavLink>
    ));

    return (
        <div className={containerClasses.join(' ')}>
            {navItems}
        </div>
    );

};

export default tabNav;