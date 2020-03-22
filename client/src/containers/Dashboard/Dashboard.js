import React, {Component, Fragment } from "react";

import HorizontalDayPicker from "../../components/UI/HorizontalDayPicker/HorizontalDayPicker";
import RadarChart from '../../components/UI/RadarChart/RadarChart';

import classes from './Dashboard.module.css';

class Dashboard extends Component {

    render() {
        return (
            <Fragment>
                <div className={classes.blueish + ' ' + classes.DashboardHeader}>
                    <p className={classes.dmSerifDisplay}>Hallo,</p>
                    <p>deine tägliche Auswertung <br /> wartet auf dich</p>
                </div>
                <HorizontalDayPicker/>
                <div className={classes.RadarChart}>
                    <RadarChart size={300}/>
                </div>
            </Fragment>
        );
    }

}

export default Dashboard;