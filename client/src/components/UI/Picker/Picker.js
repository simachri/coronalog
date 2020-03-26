import React from "react";

import classes from './Picker.module.css';

export const TYPE_YEAR = 'type_year';

const picker = ( props ) => {
    let options = [];
    switch(props.type){
        case TYPE_YEAR:
            options = Array(props.to - props.from + 1).fill(0)
                .map( (el, idx) => {
                    console.log('HEY',el, idx)
                    return props.from + idx;
                });
            break;
        default:
            break;
    }
    console.log(Array(20))

    return (
        <select className={classes.Picker}>
            {options.map(el => <option key={el} value={el}>{el}</option>)}
        </select>
    )
};

export default picker;