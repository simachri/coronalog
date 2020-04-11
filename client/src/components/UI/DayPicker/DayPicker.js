import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './DayPicker.module.scss';
import DayItem from './DayItem/DayItem';
import AddDayItem from './AddDayItem/AddDayItem';
import { arrContainsDay, sameDay } from './../../../util/utility';
import { withRouter } from 'react-router-dom';

const dayInMs = 1000*60*60*24;

class DayPicker extends Component {

    addDayClickedHandler = () => {
        this.props.history.push('/daily-q');
    }

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
                days.push(<AddDayItem key={startDate.getTime()} onClick={this.addDayClickedHandler} />);
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

export default withRouter(DayPicker);