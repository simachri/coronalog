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
        name: 'coughing',
        header: 'Leidest du an Husten?',
        subHeader: subHeaderRKI,
        answers: [
            {id: 0, label: 'Ja', value: 'yes'},
            {id: 1, label: 'Nein', value: 'no'},
        ],
        val: null,
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'coughinh-intensity',
        header: 'Wie stark is dein Husten?',
        subHeader: subHeaderRKI,
        answers: [
            {id: 0, label: 'leicht', value: '0'},
            {id: 1, label: 'moderat', value: '1'},
            {id: 2, label: 'stark', value: '2'},
            {id: 3, label: 'sehr stark', value: '3'},
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
            {id: 0, label: 'Verlust des Geschmakssinns'},
            {id: 1, label: 'Übelkeit'},
            {id: 2, label: 'Bauchschmerzen'},
            {id: 3, label: 'Apathie'},
            {id: 4, label: 'Appetitlosigkeit'},
            {id: 5, label: 'Gewichtsverlust'},
            {id: 6, label: 'Hautausschlag'},
            {id: 7, label: 'Juckreiz'},
            {id: 8, label: 'Bindehautentzündung'},
            {id: 9, label: 'Lymphknotenschwellung'},
            {id: 10, label: 'Erbrechen'},
        ],
        val: [1,4],
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'add_own_symptoms',
        header: 'Hast du sonstige Beschwerden, welche noch nicht aufgeführt wurden?',
        answers: [
            {id: 0, label: 'Nein', value: 'no'},
            {id: 1, label: 'Ja', value: '', textInput: true}
        ],
        val: null,
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