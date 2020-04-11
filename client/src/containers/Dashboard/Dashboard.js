import React, {Component, Fragment} from "react";

import RadarChart from '../../components/UI/RadarChart/RadarChart';

import classes from './Dashboard.module.css';
import axios from 'axios';
import DayPicker from './../../components/UI/DayPicker/DayPicker';
// const axios = require('axios').default;

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDayData: {
                breathlessness: 0,
                diarrhoea: 0,
                cough_intensity: 0,
                limb_pain: 0,
                fatigued: 0,
                sore_throat: 0,
                fewer: 0,
                sniffles: 0,
            }
        };
    }

    componentDidMount() {
        this.fetchDashboardData();
    }

    setStateFromApiRes(symptoms) {
        const maxFactor = 0.8;
        const minFactor = 0.1;
        // noinspection JSUnresolvedVariable
        this.setState(prevState => ({
            selectedDayData: {
                ...prevState.selectedDayData,
                breathlessness: symptoms.hasOwnProperty('breathlessness') && symptoms.breathlessness === true ? maxFactor : minFactor,
                diarrhoea: symptoms.hasOwnProperty('diarrhoea') && symptoms.diarrhoea === true ? maxFactor : minFactor,
                cough_intensity: symptoms.hasOwnProperty('cough_intensity') ? symptoms.cough_intensity / 100 * maxFactor : minFactor,
                limb_pain: symptoms.hasOwnProperty('limb_pain') ? symptoms.limb_pain / 100 * maxFactor : minFactor,
                fatigued: symptoms.hasOwnProperty('fatigued') && symptoms.fatigued === true ? maxFactor : minFactor,
                sore_throat: symptoms.hasOwnProperty('sore_throat') ? symptoms.sore_throat / 100 * maxFactor : minFactor,
                fewer: symptoms.hasOwnProperty('fewer') && symptoms.fever === true ? maxFactor : minFactor,
                sniffles: symptoms.hasOwnProperty('sniffles') && symptoms.sniffles === true ? maxFactor : minFactor,
            }
        }));
    }

    mapStateToDashboard() {
        return [
            {
                data: this.state.selectedDayData,
                meta: {color: 'blue'}
            }
        ];
    }

    render() {
        return (
            <Fragment>
                <div className={classes.blueish + ' ' + classes.DashboardHeader}>
                    <p className={classes.dmSerifDisplay}>Hallo,</p>
                    <p>deine tägliche Auswertung <br/> wartet auf dich</p>
                </div>
                <DayPicker startAt={new Date()} amountDays={30} checkedDays={[]}/>
                <div className={classes.RadarChart}>
                    <RadarChart size={300} dashboardData={this.mapStateToDashboard()}/>
                </div>
            </Fragment>
        );
    }

    fetchDashboardData() {
        const me = this;
        axios.get('/api/records?username=Kurt')
            .then(function (response) {
                console.log(response);
                if (response.data.length === 0) {
                    return;
                }
                // noinspection JSUnresolvedVariable
                me.setStateFromApiRes(response.data[0].symptoms);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
}

export default Dashboard;