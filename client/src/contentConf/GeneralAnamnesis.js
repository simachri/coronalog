import React, {Fragment} from "react";
import {TYPE_START} from "../components/UI/Questionnaire/QTypes/Options/Options";
import {TYPE_OPTIONS} from "../components/UI/Questionnaire/QTypes/Start/Start";
import { ReactComponent as InfoCircle} from '../assets/info_circle.svg';
import {TYPE_SELECT} from "../components/UI/Questionnaire/QTypes/Select/Select";
import {TYPE_YEAR} from "../components/UI/Picker/Picker";
import {TYPE_TEXT_INPUT} from "../components/UI/Questionnaire/QTypes/TextInput/TextInput";

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
    },
    {
        type: TYPE_SELECT,
        select_type: TYPE_YEAR,
        name: 'year',
        from: 1900,
        to: 2020,
        selected: 1980,
        header: 'In welchem Jahr bist du geboren?',
        noAnswerText: 'Möchte ich nicht sagen',
        onNoAnswer: (event) => console.log('noAnwer')
    },
    {
        type: TYPE_TEXT_INPUT,
        header: 'Wo wohnst du?',
        subHeader: 'Bitte gib deine PLZ ein',
        name: 'plz',
        verify:  /^[0-9]{0,5}$/, // /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/, //plz
        placeholder: 'PLZ',
        noAnswerText: 'Möchte ich nicht sagen',
        onNoAnswer: (event) => console.log('noAnwer')
    }
];