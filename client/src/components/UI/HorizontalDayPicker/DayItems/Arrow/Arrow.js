import React from "react";

import classes from './Arrow.module.css';

const arrow = ( props ) => {
  let className = props.type === 'arrow-prev' ? classes.arrowPrev : classes.arrowSucc;
  className += props.desktopOnly ? ' '+classes.DesktopOnly : '';

  return (
    <div
        className={className}>
        {props.text}
    </div>
  );
};

export default arrow;