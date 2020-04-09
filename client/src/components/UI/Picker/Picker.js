import React from "react";
import propTypes from 'prop-types';

import classes from './Picker.module.css';
import { arrToCss } from "../../../util/utility";

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

    const selects = options.map(el => (
        <option
            key={el}
            value={el}
        >
            {el}
        </option>
    ));

    const pickerClasses = [classes.Picker];
    if(props.grey){
        pickerClasses.push(classes.PickerGrey);
    }

    return (
        <select className={arrToCss(pickerClasses)} name={props.name} value={props.value} onChange={props.changed}>
            {selects}
        </select>
    )
};

export const TYPE_YEAR = 'type_year';

picker.propTypes = {
    type: propTypes.oneOf([TYPE_YEAR]),
    to: propTypes.number.isRequired,
    from: propTypes.number.isRequired,
    name: propTypes.string.isRequired,
    value: propTypes.number,
    changed: propTypes.func
};

export default picker;