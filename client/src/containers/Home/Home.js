import React, { Component, Fragment } from "react";
import { toCss } from '../../util/utility';
import { HOME_CARDS, HOME_CARDS_BOTTOM } from "../../contentConf/Home";
import { NavLink } from "react-router-dom";

import Button from '../../components/UI/Button/Button';

import classes from './Home.module.css';
import {ReactComponent as Logo} from "../../assets/logo_transparent.svg";
import {ReactComponent as HeaderBg} from "../../assets/header_shaped_bg.svg";
import InfoCards from "../../components/UI/InfoCards/InfoCards";
import SimpleCTA from "../../components/UI/SimpleCTA/SimpleCTA";

class Home extends Component {

    render() {
        return (
            <div className={classes.Home}>
                <div className={classes.Header}>
                    <div className={classes.Logo}><Logo width={null} height={null} /></div>
                    <div className={classes.HeaderBg}><HeaderBg width={null} height={null} /></div>
                    <NavLink
                        to='/user'
                        exact={true}>
                        <div className={classes.SignIn}>Anmelden</div>
                    </NavLink>
                </div>
                <h1 className={toCss(classes.HeaderText, classes.Header1)}>Gib dir & anderen Sicherheit</h1>
                <p>Mit CORONALOG hast du die Gelegenheit, Symptome, die dich verunsichern, abzuklären und im Auge zu behalten.</p>
                <p>Auch viele Symptome sind für uns neu. Es ist wichtig, davon zu erfahren!</p>

                <div className={classes.StartButton}>
                    <NavLink
                        to='/user'
                        exact={true}>
                        <Button>Jetzt mitmachen</Button>
                    </NavLink>
                </div>

                <InfoCards
                    data={HOME_CARDS}
                    headerCss={toCss(classes.Header2, classes.HeaderText)}
                    header='Deine Vorteile'/>

                <InfoCards
                    data={HOME_CARDS_BOTTOM}
                    headerCss={toCss(classes.Header2, classes.HeaderText)}
                    header='Du tust dabei Gutes für Alle'
                    subHeaderText='Es handelt sich um ein neuartiges Virus. Je mehr Informationen wir dazu sammeln können, desto schneller können wir reagieren.'
                    noBg />

                <SimpleCTA
                    headerClasses={toCss(classes.Header2, classes.HeaderText)}
                    header='Jeder Tag zählt. Beginne jetzt!'
                    content='So groß die Herausforderung auch ist, können weltweit schon Erfolge im Kampf gegen Corona erzielt werden. Hier findest du die Good News.'
                    ctaLabel='Anmelden' />

                <div className={classes.Centered}>
                    <img src='/assets/logo_project.png' alt='The project logo' />
                </div>


            </div>
        );
    }

}

export default Home;