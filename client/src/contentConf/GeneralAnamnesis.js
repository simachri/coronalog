import React, {Fragment} from "react";
import {TYPE_START} from "../components/UI/Questionnaire/QTypes/Options/Options";
import {TYPE_OPTIONS} from "../components/UI/Questionnaire/QTypes/Start/Start";
import { ReactComponent as InfoCircle} from '../assets/info_circle.svg';

export const GENERAL_ANAMNESIS_QUESTIONS = [
    {
        type: TYPE_START,
        header: 'Hallo, wir müssen dich näher kennenlernen, um dich besser unterstützen zu können',
        subHeader: <Fragment>Wozu werden diese Daten benötigt? <InfoCircle /></Fragment>,
        onResume: () => console.log('resume')
    },
    {
        type: TYPE_OPTIONS,
        header: 'Welches Geschlecht hast du?',
        answers: ['Weiblich', 'Männlich', 'Divers'],
        infoHref: 'https://rki.de',
        noAnswerText: 'Möchte ich nicht sagen',
        onNoAnswer: (event) => console.log('noAnwer')
    }
];