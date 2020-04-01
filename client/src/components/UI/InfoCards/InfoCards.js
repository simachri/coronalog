import React from "react";

import InfoCard from './InfoCard/InfoCard';

import classes from './InfoCards.module.css';

const infoCards = ( props ) => {
    const cards = props.data.map((entry, idx) => (
        <InfoCard
            key={entry.id}
            svgIcon={entry.svgIcon}
            header={entry.header}
            content={entry.content}
            cardHeaderColor={entry.headerColor}
        />
    ));

    return (
        <div className={props.noBg ? null : classes.CardsBg}>
            <h2 className={props.headerCss}>{props.header}</h2>
            {props.subHeaderText ? <p>{props.subHeaderText}</p> : null}
            <div className={classes.Cards}>
                {cards}
            </div>
        </div>
    )

};

export default infoCards;