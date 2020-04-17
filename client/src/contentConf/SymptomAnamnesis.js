import React, {Fragment} from "react";
// import { Link } from 'react-router-dom';

import {TYPE_OPTIONS} from "../components/UI/Questionnaire/QTypes/Options/Options";
import {TYPE_MULTI_OPTIONS} from "../components/UI/Questionnaire/QTypes/MultiOptions/MultiOptions";
import {TYPE_START} from "../components/UI/Questionnaire/QTypes/Start/Start";
import { ReactComponent as InfoCircle} from '../assets/info_circle.svg';
// import {TYPE_SELECT} from "../components/UI/Questionnaire/QTypes/Select/Select";
// import {TYPE_YEAR} from "../components/UI/Picker/Picker";
// import {TYPE_TEXT_INPUT} from "../components/UI/Questionnaire/QTypes/TextInput/TextInput";
import { TYPE_END } from './../components/UI/Questionnaire/QTypes/End/End';

const subHeaderRKI = (
    <Fragment>
        Was bedeutet das? 
        <a href='https://rki.de' alt='RKI'><InfoCircle /></a>
    </Fragment>
);

export const SYMPTOM_ANAMNESIS_QUESTIONS = [
    {
        type: TYPE_START,
        name: 'start',
        header: 'Hallo, willkommen in deiner virtuellen Sprechstunde. Wie geht es dir heute?',
    },
    {
        type: TYPE_OPTIONS,
        name: 'cough_intensity',
        header: 'Leidest du an Husten?',
        subHeader: subHeaderRKI,
        answers: [
            {id: 0, label: 'Nein', value: 0},
            {id: 1, label: 'leicht', value: 1},
            {id: 1, label: 'moderat', value: 2},
            {id: 1, label: 'stark', value: 3},
            {id: 1, label: 'sehr stark', value: 4},
        ],
        val: null,
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'limb_pain',
        header: 'Leidest du an Gliederschmerzen?',
        subHeader: subHeaderRKI,
        answers: [
            {id: 0, label: 'Nein', value: 0},
            {id: 1, label: 'leicht', value: 1},
            {id: 1, label: 'moderat', value: 2},
            {id: 1, label: 'stark', value: 3},
            {id: 1, label: 'sehr stark', value: 4},
        ],
        val: null,
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'sore_throat',
        header: 'Leidest du an Halsschmerzen?',
        subHeader: subHeaderRKI,
        answers: [
            {id: 0, label: 'Nein', value: 0},
            {id: 1, label: 'leicht', value: 1},
            {id: 1, label: 'moderat', value: 2},
            {id: 1, label: 'stark', value: 3},
            {id: 1, label: 'sehr stark', value: 4},
        ],
        val: null,
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'fever',
        header: 'Hast du Fieber?',
        subHeader: 'Wenn ja, welche Temperatur?',
        answers: [
            {id: 0, label: 'Nein', value: 0},
            {id: 1, label: 'Ja', value: '38.0', textInput: true}
        ],
        val: null,
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_MULTI_OPTIONS,
        name: 'add_symptoms',
        header: 'Hast du weitere Symptome?',
        subHeader: subHeaderRKI,
        options: [
            {id: 'breathlessness', label: 'Atemnot'},
            {id: 'fatigued', label: 'Müdigkeit'},
            {id: 'sniffles', label: 'Schnupfen'},
            {id: 'diarrhoea', label: 'Durchfall'},
        ],
        val: {},
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_END,
        name: 'end',
        header: 'Toll!',
        subHeader: 'Du hast alle Fragen beantwortet. Danke!',
        showSaveButton: true,
        saveButtonText: 'Speichern',
    }
];