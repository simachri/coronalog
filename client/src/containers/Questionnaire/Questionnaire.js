import React, {Component, Fragment} from 'react';

import classes from './Questionnaire.module.css';

import StartPage from '../../components/UI/Questionnaire/Start/Start';

const pages = [
    {
        type: 'start',
        header: <Fragment><span className={classes.Large}>Hallo,</span><br/> willkommen in meiner virtuellen Sprechstunde.</Fragment>,
        pageClass: 'StartPage',
        onResume: null
    }
];

const mapToComp = ( obj ) => {
    switch(obj.type){
        case 'start': return <StartPage header={obj.header} />;
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
                {mapToComp(pages[0])}
            </div>
        );
    }
}

export default Questionnaire;