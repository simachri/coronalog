import React from "react";

import classes from '../../../../containers/Questionnaire/Questionnaire.module.css';

import {ReactComponent as NoBubble} from "../../../../assets/speechbubble_no.svg";
import {ReactComponent as YesBubble} from "../../../../assets/speechbubble_yes.svg";
import {ReactComponent as InfoCircle} from "../../../../assets/info_circle.svg";
import Bubble from "../../Bubble/Bubble";

const yesNo = ( props ) => {
    return (
        <div className={props.pageClasses}>
            <div className={classes.Header}>{props.header}</div>
            <div className={classes.SubHeaderInfo}>Was bedeutet das? <a href={''+props.infoHref}><InfoCircle /></a></div>
            <div className={classes.Answers}>
                {/*<div className={classes.YesBubble} onClick={props.onYes}>*/}
                {/*    <YesBubble />*/}
                {/*</div>*/}
                <Bubble text='Yes' />
                <div className={classes.NoBubble} onClick={props.onNo}>
                    <NoBubble />
                </div>
                <div className={classes.NoAnswer} onClick={props.onNoAnswer}>
                    Möchte ich nicht sagen
                </div>
            </div>
        </div>
    );
};

export default yesNo;