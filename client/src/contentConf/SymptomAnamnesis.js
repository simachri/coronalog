import React, {Fragment} from "react";

export const pages = [
    {
        type: 'start',
        header: <Fragment><span style={{fontSize: '3.5rem'}}>Hallo,</span><br/> willkommen in meiner virtuellen Sprechstunde.</Fragment>,
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