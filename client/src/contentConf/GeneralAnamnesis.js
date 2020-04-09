import React, {Fragment} from "react";
import {TYPE_OPTIONS} from "../components/UI/Questionnaire/QTypes/Options/Options";
import {TYPE_START} from "../components/UI/Questionnaire/QTypes/Start/Start";
import { ReactComponent as InfoCircle} from '../assets/info_circle.svg';
import {TYPE_SELECT} from "../components/UI/Questionnaire/QTypes/Select/Select";
import {TYPE_YEAR} from "../components/UI/Picker/Picker";
import {TYPE_TEXT_INPUT} from "../components/UI/Questionnaire/QTypes/TextInput/TextInput";

export const GENERAL_ANAMNESIS_QUESTIONS = [
    {
        type: TYPE_START,
        name: 'start',
        header: 'Hallo, wir müssen dich näher kennenlernen, um dich besser unterstützen zu können',
        subHeader: <Fragment>Wozu werden diese Daten benötigt? <InfoCircle /></Fragment>,
    },
    {
        type: TYPE_OPTIONS,
        name: 'sex',
        header: 'Welches Geschlecht hast du?',
        answers: [
            {id: 0, label: 'Weiblich', value: 'w'},
            {id: 1, label: 'Männlich', value: 'm'},
            {id: 2, label: 'Divers', value: 'd'},
            // {id: 3, label: 'Other', value: '', textInput: true}
        ],
        infoHref: 'https://rki.de',
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_SELECT,
        name: 'year',
        selectSpec: {
            type: TYPE_YEAR,
            from: 1900,
            to: 2020
        },
        header: 'In welchem Jahr bist du geboren?',
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_TEXT_INPUT,
        header: 'Wo wohnst du?',
        subHeader: 'Bitte gib deine PLZ ein',
        name: 'plz',
        verify:  /^[0-9]{0,5}$/, // /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/, //plz
        placeholder: 'PLZ',
        val: '',
        noAnswerText: 'Möchte ich nicht sagen'
    }
];