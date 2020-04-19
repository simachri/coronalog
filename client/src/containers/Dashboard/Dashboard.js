import React, {Component, Fragment} from "react";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { sameDay, mapSymptomsToFloats } from '../../util/utility';

import RadarChart from '../../components/UI/RadarChart/RadarChart';

import classes from './Dashboard.module.css';
import DayPicker from './../../components/UI/DayPicker/DayPicker';

const COL_0 = 'salmon';
const COL_1 = 'darkred';

class Dashboard extends Component {

    state = this.initState();

    initState() {
        const initState = { 
            swapCols: false,
            selectedDay1: null,
            selectedDay2: null
        };
        for (let i = this.props.records.length - 1; i >= 0; i--) {
            if (!initState.selectedDay1) {
                initState.selectedDay1 = this.props.records[i].date;
            } else if (!initState.selectedDay2) {
                initState.selectedDay2 = this.props.records[i].date;
                break;
            }
        }
        return initState;
    }

    componentDidMount() {
        if (!this.props.records) {
            this.props.fetchRecords(this.props.username);
        }
    }

    getRecord = (date) => {
        if(!date){
            return null;
        }
        return this.props.records.find(record => sameDay(date, new Date(record.date)));
    }

    daySelectedHandler = date => {
        if (
            !sameDay(this.state.selectedDay1, date) &&
            !sameDay(this.state.selectedDay2, date)
        ) {
            this.setState(prevState => ({
                selectedDay1: date,
                selectedDay2: prevState.selectedDay1,
                swapCols: !prevState.swapCols
            }));
        }
    }

    getCol = i => {
        switch(i) {
            case 0: return this.state.swapCols ? COL_0 : COL_1;
            case 1: return this.state.swapCols ? COL_1 : COL_0;
            default: return COL_0;
        }
    }

    render() {

        let data = [];
        const dataDay1 = this.getRecord(this.state.selectedDay1);
        if (dataDay1) {
            data.push({
                data: mapSymptomsToFloats(dataDay1.symptoms),
                meta: {color: this.getCol(0)}
            });
        }
        const dataDay2 = this.getRecord(this.state.selectedDay2);
        if (dataDay2) {
            data.push({
                data: mapSymptomsToFloats(dataDay2.symptoms),
                meta: {color: this.getCol(1)}
            });
        }

        return (
            <Fragment>

                <div className={classes.Logout} onClick={() => this.props.logout()}>Logout</div>

                <div className={classes.blueish + ' ' + classes.DashboardHeader}>
                    <p className={classes.dmSerifDisplay}>Hallo,</p>
                    <p>deine tägliche Auswertung <br/> wartet auf dich</p>
                </div>

                <DayPicker 
                    startAt={new Date()} 
                    amountDays={30} 
                    checkedDays={this.props.records.map(rec => new Date(rec.date))} 
                    selectDays={[
                        {date: this.state.selectedDay1, color: this.getCol(0)},
                        {date: this.state.selectedDay2, color: this.getCol(1)},
                    ]}
                    onDaySelected={this.daySelectedHandler}
                />

                <div className={classes.RadarChart}>
                    <RadarChart size={300} data={data}/>
                </div>

            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        records: state.records.data,
        username: state.auth.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout()),
        fetchRecords: (username) => dispatch(actions.fetchRecords(username)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);