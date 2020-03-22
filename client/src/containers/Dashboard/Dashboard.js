import React, {Component, Fragment } from "react";

import HorizontalDayPicker from "../../components/UI/HorizontalDayPicker/HorizontalDayPicker";
import RadarChart from '../../components/UI/RadarChart/RadarChart';

import classes from './Dashboard.module.css';

const axios = require('axios').default;

class Dashboard extends Component {

    componentDidMount() {
        axios.get('/records?user=Kurt')
            .then(function (response) {
                console.log(response);
                if (response.data.length === 0) {
                   return
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

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