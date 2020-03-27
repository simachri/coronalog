import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Options from "../../components/UI/Questionnaire/QTypes/Options/Options";

import classes from './GeneralAnamnesis.module.css';
import Start from "../../components/UI/Questionnaire/QTypes/Start/Start";
import { scrollTo } from "../../util/utility";
import {GENERAL_ANAMNESIS_QUESTIONS} from "../../contentConf/GeneralAnamnesis";
import Questions from "../../components/UI/Questionnaire/Questions/Questions";

class GeneralAnamnesis extends Component {

    render() {
        return (
            <Questions qSpecs={GENERAL_ANAMNESIS_QUESTIONS} />
        );
    }

    // firstPageRef = React.createRef();
    //
    // render() {
    //     return (
    //         <div>
    //             <div className={classes.Page}>
    //                 <Start
    //                     header={<Fragment><span className={classes.Large}>Hallo,</span><br/> willkommen in meiner virtuellen Sprechstunde.</Fragment>}
    //                     onResume={() => scrollTo(this.firstPageRef)}
    //                 />
    //             </div>
    //             <div ref={this.firstPageRef} id='myId' className={classes.Page}>
    //                 <Options
    //                     header='Dies ist meine Frage?'
    //                     subHeader='Dies ist ein Subheader'
    //                     answers={['Yes', 'No', 'Cancel']}
    //                     onNoAnswer={() => console.log('No Answer')}
    //                     noAnswerText='Möchte ich nicht sagen'
    //                 />
    //             </div>
    //         </div>
    //     );
    // }
}

GeneralAnamnesis.propTypes = {};

export default GeneralAnamnesis;