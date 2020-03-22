import React from "react";
import RadarChart from 'react-svg-radar-chart';

import 'react-svg-radar-chart/build/css/index.css';
import classes from './RadarChart.module.css';

//example data
const data_ex = [
      {
        data: {
          battery: 0.7,
          design: .8,
          useful: 0.9,
          speed: 0.67,
          weight: 0.8
        },
        meta: { color: 'blue' }
      },
      {
        data: {
          battery: 0.6,
          design: .85,
          useful: 0.5,
          speed: 0.6,
          weight: 0.7
        },
        meta: { color: 'red' }
      }
    ];

const captions_ex = {
      // columns
      battery: 'Battery Capacity',
      design: 'Design',
      useful: 'Usefulness',
      speed: 'Speed',
      weight: 'Weight'
    };

const radarChart = ( props ) => {

    return (
        <RadarChart
            captions={captions_ex}
            data={data_ex}
            size={props.size}
        />
    );

};

export default radarChart;