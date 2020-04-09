import React, {Component} from "react";
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons/faAngleDoubleDown";
import { faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons/faAngleDoubleUp";

import classes from '../../Questionnaire.module.css';

class Question extends Component {
    render() {
        return (
            <div ref={this.props.outerRef} className={classes.Page}>
                {this.props.children}
                {!this.props.hideBack
                    ?   <div className={classes.Back} onClick={this.props.onGoBack}>
                        <FontAwesomeIcon icon={faAngleDoubleUp} />
                    </div>
                    : null}
                {!this.props.hideResume
                    ?   <div className={classes.Resume} onClick={this.props.onResume}>
                        <FontAwesomeIcon icon={faAngleDoubleDown} />
                    </div>
                    : null}
            </div>
        );
    }
}

Question.propTypes = {
    outerRef: propTypes.instanceOf(Object),
    hideBack: propTypes.bool,
    onGoBack: propTypes.func,
    hideResume: propTypes.bool,
    onResume: propTypes.func,
    value: propTypes.string,
    valueChanged: propTypes.func,
};

export const NO_ANSWER = 123456789;
export default Question;