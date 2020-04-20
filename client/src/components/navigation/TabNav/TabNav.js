import React from "react";
import propTypes from 'prop-types';
import  { NavLink } from 'react-router-dom';

import classes from './TabNav.module.scss';

const tabNav = ( props ) => {

    const containerClasses = [classes.MobileOnly, classes.TabNav];

    const navItems = props.items.map( (item, idx) =>  (
        <NavLink
            className={classes.TabNavItem}
            activeClassName={classes.ActiveItem}
            key={idx}
            to={item.link}
            exact={item.exact}>
            <div>
                {item.svgIcon ? item.svgIcon
                    : (item.faIcon ? item.faIcon : null)}
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
tabNav.propTypes = {
    items: propTypes.arrayOf(propTypes.exact({
        title: propTypes.string,
        link: propTypes.string,
        exact: propTypes.bool,
        svgIcon: propTypes.element,
    })).isRequired,
    showTitle: propTypes.bool,
}

export default tabNav;