import React, {Component, Fragment} from "react";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { DAY_MS } from '../../components/UI/DayPicker/DayPicker';
import { sameDay, mapSymptomsToFloats } from '../../util/utility';

import RadarChart from '../../components/UI/RadarChart/RadarChart';

import classes from './Dashboard.module.css';
import DayPicker from './../../components/UI/DayPicker/DayPicker';

const COL_1 = 'blue';
const COL_2 = 'red';

class Dashboard extends Component {

    state = {
        selectedDay1: new Date( new Date().getTime() - DAY_MS),     //yesterday
        selectedDay2: new Date( new Date().getTime() - 2 * DAY_MS)  //day before yesterday
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

    render() {

        let data = [];
        let dataDay1 = this.getRecord(this.state.selectedDay1);
        if (dataDay1) {
            data.push({
                data: mapSymptomsToFloats(dataDay1.symptoms),
                meta: {color: COL_1}
            });
        }
        const dataDay2 = this.getRecord(this.state.selectedDay2);
        if (dataDay2) {
            data.push({
                data: mapSymptomsToFloats(dataDay2.symptoms),
                meta: {color: COL_2}
            });
        }
        console.log(data)

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
                    checkedDays={[]} 
                    selectDays={[
                        {date: this.state.selectedDay1, color: COL_1},
                        {date: this.state.selectedDay2, color: COL_2},
                    ]}
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