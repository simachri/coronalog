import React from "react";
import {ReactComponent as HistoryIcon} from "../assets/home_history_icon.svg";
import {ReactComponent as CurveIcon} from "../assets/home_curve_icon.svg";
import {ReactComponent as ContactIcon} from "../assets/home_contact_icon.svg";
import {ReactComponent as NewsIcon} from "../assets/home_news_icon.svg";
import {ReactComponent as HandsIcon} from "../assets/home_hands_icon.svg";
import {ReactComponent as PersonIcon} from "../assets/home_person_icon.svg";

export const HOME_CARDS = [
    {
        id: 0,
        svgIcon: <CurveIcon width={null} height={null} />,
        header: 'Dein Krankheitsverlauf im Überblick',
        content: 'Du kannst deinen eigenen Krankheitsverlauf täglich dokumentieren und siehst so einfach, ob sich Symptome verbessern oder verschlechtern. ',
    },
    {
        id: 1,
        svgIcon: <HistoryIcon width={null} height={null} />,
        header: 'Deine virtuelle Patientenakte',
        content: 'Wenn es doch zum Arzt gehen muss, kannst du deine aufgezeichneten Daten exportieren. Fieber am Donnerstag oder Freitag? Auf einen Blick beantwortet.',
    },
    {
        id: 2,
        svgIcon: <ContactIcon width={null} height={null} />,
        header: 'Hilfe zu medizinschen Anlaufstellen',
        content: 'In der App findest du hilfreiche Tipps wohin du dich wenden kannst. ',
    },
    {
        id: 3,
        svgIcon: <NewsIcon width={null} height={null} />,
        header: 'Tolle Nachrichten',
        content: 'So groß die Herausforderung auch ist, können weltweit schon Erfolge im Kampf gegen Corona erzielt werden. Hier findest du die Good News.',
    }
];

export const HOME_CARDS_BOTTOM = [
    {
        id: 0,
        svgIcon: <HandsIcon width={null} height={null}/>,
        header: 'Aktuelle Good News zum Thema Corona',
        headerColor: '#FF5959',
        content: 'Das tägliche Tracken deiner Symptome hilft uns, Krankheitsverläufe klarer zu erkennen und passende Handlungsempfehlungen geben zu können.'
    },
    {
        id: 1,
        svgIcon: <PersonIcon width={null} height={null}/>,
        header: 'Aktuelle Good News zum Thema Corona',
        headerColor: '#FF5959',
        content: 'Auch viele Symptome sind für uns neu. Es ist wichtig, davon zu erfahren!'
    }
];