import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './DayPicker.module.scss';
import DayItem from './DayItem/DayItem';
import AddDayItem from './AddDayItem/AddDayItem';
import { arrContainsDay, sameDay, getFormattedDate, resetDateToStartOfDay } from './../../../util/utility';
import { withRouter } from 'react-router-dom';

export const DAY_MS = 1000*60*60*24;

class DayPicker extends Component {

    addDayClickedHandler = () => {
        this.props.history.push('/daily-q');
    }

    getIsSelected = date => {
        if (this.props.selectDays) {
            const selectEl = this.props.selectDays.find(el => sameDay(date, el.date));
            if (selectEl) {
                return selectEl.color;
            }
        }
    }

    render() {

        const startDate = resetDateToStartOfDay(this.props.startAt);
        const days = [];

        let startIdx = 0;
        if(sameDay(startDate, new Date())){
            //whether symptoms of today were already entered
            if(this.props.checkedDays && arrContainsDay(this.props.checkedDays, startDate)){
                days.push(
                    <DayItem 
                        key={startDate.getTime()} 
                        linkTo={'/daily-q?date=' + getFormattedDate(startDate)} 
                        date={startDate} 
                        onSelect={() => this.props.onDaySelected(startDate)}
                        selected={this.getIsSelected(startDate)}
                        blueBg 
                        checked 
                    />
                );
            } else {
                days.push(
                    <AddDayItem 
                        key={startDate.getTime()} 
                        linkTo={'/daily-q?date=' + getFormattedDate(startDate)}
                    />
                );
            }
            startIdx = 1;
        }

        for(let i = startIdx; i < this.props.amountDays; i++) {
            let date = new Date(startDate.getTime() - i * DAY_MS);
            let checked = false;
            if(this.props.checkedDays){
                checked = arrContainsDay(this.props.checkedDays, date);
            }

            days.push(
                <DayItem 
                    key={date.getTime()} 
                    date={date} 
                    linkTo={'/daily-q?date=' + getFormattedDate(date)} 
                    checked={checked} 
                    selected={this.getIsSelected(date)}
                    onSelect={() => this.props.onDaySelected(date)}
                />
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
    checkedDays: propTypes.arrayOf(Date),
    selectDays: propTypes.arrayOf(propTypes.shape({
        date: propTypes.Date,
        color: propTypes.string
    })),
    onDaySelected: propTypes.func
};

export default withRouter(DayPicker);