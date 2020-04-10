import React, {Fragment} from "react";
import { Link } from 'react-router-dom';

import {TYPE_OPTIONS} from "../components/UI/Questionnaire/QTypes/Options/Options";
import {TYPE_START} from "../components/UI/Questionnaire/QTypes/Start/Start";
import { ReactComponent as InfoCircle} from '../assets/info_circle.svg';
import {TYPE_SELECT} from "../components/UI/Questionnaire/QTypes/Select/Select";
import {TYPE_YEAR} from "../components/UI/Picker/Picker";
import {TYPE_TEXT_INPUT} from "../components/UI/Questionnaire/QTypes/TextInput/TextInput";
import { TYPE_END } from './../components/UI/Questionnaire/QTypes/End/End';

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
        name: 'sex',
        header: 'Welches Geschlecht hast du?',
        answers: [
            {id: 0, label: 'Weiblich', value: 'w'},
            {id: 1, label: 'Männlich', value: 'm'},
            {id: 2, label: 'Divers', value: 'd'},
            // {id: 3, label: 'Other', value: '', textInput: true}
        ],
        val: null,
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
        val: null,
        header: 'In welchem Jahr bist du geboren?',
        noAnswerText: 'Möchte ich nicht sagen'
    },
    {
        type: TYPE_TEXT_INPUT,
        header: 'Wo wohnst du?',
        subHeader: 'Bitte gib deine PLZ ein',
        name: 'plz',
        verify:  /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/, //plz
        placeholder: 'PLZ',
        val: '',
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