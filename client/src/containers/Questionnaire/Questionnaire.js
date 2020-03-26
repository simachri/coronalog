import React, {Component, Fragment} from 'react';

import classes from './Questionnaire.module.css';

import StartPage from '../../components/UI/Questionnaire/Start/Start';
import Options from "../../components/UI/Questionnaire/Options/Options";

const pages = [
    {
        type: 'start',
        header: <Fragment><span className={classes.Large}>Hallo,</span><br/> willkommen in meiner virtuellen Sprechstunde.</Fragment>,
        pageClasses: 'QPage StartPage',
        onResume: null
    },
    {
        type: 'yesNo',
        header: 'Leidest du an Halsschmerzen?',
        pageClasses: 'QPage YesNoPage',
        infoHref: 'https://rki.de',
        onYes: () => alert('onYes'),
        onNo: () => alert('onNo'),
        onNoAnswer: (event) => alert('noAnwer')
    }
];

const mapToComp = ( obj ) => {
    switch(obj.type){
        case 'start': return <StartPage {...obj} />;
        default: return null;
    }
};


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