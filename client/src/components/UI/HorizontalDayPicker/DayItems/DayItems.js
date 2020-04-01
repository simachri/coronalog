import React from "react";

import DayItem from './DayItem/DayItem';
import AddDayItem from './AddDayItem/AddDayItem';

// import classes from './DayItems.module.css';

const dayInMs = 1000*60*60*24;

const dayItems = ( props ) => {

    const days = [];
    const startDate = props.startToday ? new Date() : props.startDate;

    for(let i = 0; i < props.amountDays; i++) {
        let date = new Date(startDate.getTime() - i * dayInMs);
        days.unshift(
            <DayItem key={date.getTime()} date={date}/>
        );
    }

    if(props.startToday){
        days.push(
            <AddDayItem/>
        );
    }

    return days;

};

export default dayItems;