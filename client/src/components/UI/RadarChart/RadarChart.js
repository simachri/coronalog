import React from "react";
import RadarChart from 'react-svg-radar-chart';

import 'react-svg-radar-chart/build/css/index.css';
// import classes from './RadarChart.module.css';

// function setData(json) {
//
// }

//example data
// const data_ex = [
//       {
//         data: {
//           battery: 0.7,
//           design: .8,
//           useful: 0.9,
//           speed: 0.67,
//           weight: 0.8
//         },
//         meta: { color: 'blue' }
//       },
//       {
//         data: {
//           battery: 0.6,
//           design: .85,
//           useful: 0.5,
//           speed: 0.6,
//           weight: 0.7
//         },
//         meta: { color: 'red' }
//       }
//     ];

const captions_ex = {
      // columns
      breathlessness: 'Atemnot',
      diarrhoea: 'Durchfall',
      cough_intensity: 'Husten',
      limb_pain: 'Glieder- & Kopfschmerzen',
      fatigued: 'Müdigkeit',
      sore_throat: 'Halsschmerzen',
      fewer: 'Fieber',
      sniffles: 'Schnupfen',
};

const radarChart = ( props ) => {

    return (
        <RadarChart
            captions={captions_ex}
            data={props.dashboardData}
            size={props.size}
        />
    );

};

export default radarChart;