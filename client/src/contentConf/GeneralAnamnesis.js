import React, {Fragment} from "react";
import { Link } from 'react-router-dom';

import {TYPE_OPTIONS} from "../components/UI/Questionnaire/QTypes/Options/Options";
import {TYPE_START} from "../components/UI/Questionnaire/QTypes/Start/Start";
import { ReactComponent as InfoCircle} from '../assets/info_circle.svg';
import {TYPE_SELECT} from "../components/UI/Questionnaire/QTypes/Select/Select";
import {TYPE_YEAR} from "../components/UI/Picker/Picker";
import {TYPE_TEXT_INPUT} from "../components/UI/Questionnaire/QTypes/TextInput/TextInput";
import { TYPE_END } from './../components/UI/Questionnaire/QTypes/End/End';
import { TYPE_MULTI_OPTIONS } from './../components/UI/Questionnaire/QTypes/MultiOptions/MultiOptions';

export const GENERAL_ANAMNESIS_QUESTIONS = [
    {
        type: TYPE_START,
        name: 'start',
        header: 'Hallo, wir müssen dich näher kennenlernen, um dich besser unterstützen zu können',
        subHeader: (
            <Fragment>
                Wozu werden diese Daten benötigt? 
                <Link to='/info'><InfoCircle /></Link>
            </Fragment>
        ),
    },
    {
        type: TYPE_OPTIONS,
        name: 'gender',
        header: 'Welches Geschlecht hast du?',
        answers: [
            {id: 0, label: 'Weiblich', value: 'w'},
            {id: 1, label: 'Männlich', value: 'm'},
            {id: 2, label: 'Divers', value: 'd'},
            // {id: 3, label: 'Other', value: '', textInput: true}
        ],
        noAnswerText: 'Möchte ich nicht sagen',
        required: true
    },
    {
        type: TYPE_SELECT,
        name: 'birthyear',
        selectSpec: {
            type: TYPE_YEAR,
            from: 1900,
            to: 2020
        },
        header: 'In welchem Jahr bist du geboren?',
        noAnswerText: 'Möchte ich nicht sagen',
        required: true
    },
    {
        type: TYPE_TEXT_INPUT,
        name: 'residence',
        header: 'Wo wohnst du?',
        subHeader: 'Bitte gib deine PLZ ein',
        verify:  /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/, //plz
        placeholder: 'PLZ',
        noAnswerText: 'Möchte ich nicht sagen',
        required: true
    },
    {
        type: TYPE_OPTIONS,
        name: 'positive_tested',
        header: 'Wurdest du positiv auf Covid-19 getestet?',
        answers: [
            {id: 0, label: 'Ja', value: true},
            {id: 1, label: 'Nein', value: false},
        ],
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'risk_area_stay',
        header: 'Hast du dich in den letzen 2 Wochen (vor der Erkrankung) in einem Risikogebiet aufgehalten?',
        answers: [
            {id: 0, label: 'Ja', value: true},
            {id: 1, label: 'Nein', value: false},
        ],
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'infection_contact',
        header: 'Hattest du in den letzten zwei Wochen Kontakt zu einer infizierten Person?',
        answers: [
            {id: 0, label: 'Ja', value: 'yes'},
            {id: 1, label: 'Nein', value: 'no'},
            {id: 2, label: 'Weiß nicht', value: 'don\'t know'},
        ],
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_OPTIONS,
        name: 'medication',
        header: 'Nimmst du Medikamente?',
        answers: [
            {id: 0, label: 'Nein', value: 'no'},
            {id: 1, label: 'Ja', value: '', textInput: true}
        ],
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_MULTI_OPTIONS,
        name: 'pre_existing_conditions',
        header: 'Hast du eine oder mehrere der folgenden Vorerkrankungen?',
        subHeader: 'some info',
        options: [
            {id: 'cardiovascular_desease', label: 'Herzkreislauferkrankung'},
            {id: 'pulmonary_problems', label: 'Lungenprobleme'},
            {id: 'chronic_liver_disease', label: 'Lebererkrankung'},
            {id: 'diabetes_mellitus', label: 'Diabetes'},
            {id: 'cancer', label: 'Krebs'},
            {id: 'immunodeficiency', label: 'Immunschwäche'},
        ],
        addOptions: {
            id: 'miscellaneous',
            label: 'Sonstige'
        },
        allFalseLabel: 'Nein',
        noAnswerText: 'Möchte ich nicht sagen'
    }, 
    {
        type: TYPE_MULTI_OPTIONS,
        name: 'personal_conditions',
        header: 'Was hiervon trifft auf dich zu?',
        subHeader: 'some info',
        options: [
            {id: 'smoker', label: 'Raucher'},
            {id: 'pregnant', label: 'Schwanger'},
        ],
        allFalseLabel: 'Nichts',
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_END,
        name: 'end',
        header: 'Das ist schon alles!',
        showSaveButton: true,
        saveButtonText: 'Speichern',
    }
];