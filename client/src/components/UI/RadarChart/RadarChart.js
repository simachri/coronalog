import React from "react";
import RadarChart from 'react-svg-radar-chart';
import propTypes from 'prop-types';

import 'react-svg-radar-chart/build/css/index.css';
// import classes from './RadarChart.module.css';

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

const CAPTIONS = {
      // columns
      cough_intensity: 'Husten',
      breathlessness: 'Atemnot',
      fatigued: 'Müdigkeit',
      limb_pain: 'Glieder- & Kopfschmerzen',
      sniffles: 'Schnupfen',
      sore_throat: 'Halsschmerzen',
      fever: 'Fieber',
      diarrhoea: 'Durchfall',
};

const radarChart = ( props ) => {

    return (
        <RadarChart
            captions={CAPTIONS}
            data={props.data}
            size={props.size}
        />
    );

};
radarChart.propTypes = {
    data: propTypes.arrayOf(propTypes.shape({
        data: propTypes.object,
        meta: propTypes.object
    })).isRequired,
    size: propTypes.number.isRequired
};

export default radarChart;