import React from "react";

import classes from './Picker.module.css';

const picker = ( props ) => {
    let options = [];
    switch(props.type){
        case TYPE_YEAR:
            options = Array(props.to - props.from + 1).fill(0)
                .map( (el, idx) => {
                    return props.from + idx;
                });
            break;
        default:
            break;
    }

    return (
        <select className={classes.Picker} name={props.name}>
            {options.map(el => <option key={el} value={el}>{el}</option>)}
        </select>
    )
};

export const TYPE_YEAR = 'type_year';
export default picker;