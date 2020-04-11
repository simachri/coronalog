import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './DayPicker.module.scss';
import DayItem from './DayItem/DayItem';
import AddDayItem from './AddDayItem/AddDayItem';

const dayInMs = 1000*60*60*24;

const sameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
}

const arrContainsDay = (arr, day) => {
    return arr.some(el => sameDay(day, el));
}

class DayPicker extends Component {
    render() {

        const startDate = this.props.startAt;
        const days = [];

        let startIdx = 0;
        if(sameDay(startDate, new Date())){
            //whether symptoms of today were already entered
            if(this.props.checkedDays && arrContainsDay(this.props.checkedDays, startDate)){
                days.push(
                    <DayItem key={startDate.getTime()} date={startDate} blueBg checked />
                );
            } else {
                days.push(<AddDayItem key={startDate.getTime()} />);
            }
            startIdx = 1;
        }

        for(let i = startIdx; i < this.props.amountDays; i++) {
            let date = new Date(startDate.getTime() - i * dayInMs);
            let checked = false;
            if(this.props.checkedDays){
                checked = arrContainsDay(this.props.checkedDays, date);
            }
            
            days.push(
                <DayItem key={date.getTime()} date={date} checked={checked}/>
            );
        }

        return (
            <div className={classes.Picker}>
                {days}
            </div>
        );
    }
}
DayPicker.propTypes = {
    startAt: propTypes.objectOf(Date).isRequired,
    amountDays: propTypes.number.isRequired,
    checkedDays: propTypes.arrayOf(Date)
};

export default DayPicker;