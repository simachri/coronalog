import React from "react";
import  { NavLink } from 'react-router-dom';

import classes from './TabNav.module.css';

const tabNav = ( props ) => {

    const containerClasses = [classes.MobileOnly, classes.TabNav];

    const navItems = props.items.map( (item, idx) =>  (
        <div className={classes.TabNavItem} key={idx}>
            <NavLink
                to={item.link}
                exact={item.exact}>
                {item.faIcon}
                <div>{item.title}</div>
            </NavLink>
        </div>
    ));

    return (
        <div className={containerClasses.join(' ')}>
            {navItems}
        </div>
    );

};

export default tabNav;