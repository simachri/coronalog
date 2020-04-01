import React, {Component} from 'react';

import classes from './Questionnaire.module.css';

import Options from "../../components/UI/Questionnaire/QTypes/Options/Options";


class Questionnaire extends Component {

    state = {
        progress: 0
    };

    render() {
        return (
            <div className={classes.Questionnaire}>
                <Options
                    header='Dies ist meine Frage?'
                    subHeader='Dies ist ein Subheader'
                    answers={['Yes', 'No', 'Cancel']}
                    onNoAnswer={() => console.log('No Answer')}
                    noAnswerText='Möchte ich nicht sagen'
                />
            </div>
        );
    }
}

export default Questionnaire;