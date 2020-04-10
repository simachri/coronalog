import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './MultiOptions.module.css';
import qClasses from '../../Questionnaire.module.css';
import { arrToCss } from './../../../../../util/utility';
import { NO_ANSWER } from './../../Questions/Question/Question';

class MultiOptions extends Component {

    render() {

        let options = this.props.options.map(option => (
            <div 
                key={option.id} 
                onClick={() => {
                    if(this.props.value.constructor === Array && this.props.value.includes(option.id)){
                        const newValue = [...this.props.value];
                        newValue.splice(newValue.indexOf(option.id), 1);
                        this.props.valueChanged(newValue);
                    } else {
                        this.props.valueChanged(
                            this.props.value.constructor === Array 
                                ? [...new Set([...this.props.value, option.id])]
                                : [option.id]
                        )
                    }
                }}
                className={classes.Option + ' ' + (this.props.value.constructor === Array && this.props.value.includes(option.id) ? classes.Selected : '')}
            >
                {option.label}
            </div>
        ));

        const noAnswerClasses = [qClasses.NoAnswer];
        if(this.props.value === NO_ANSWER){
            noAnswerClasses.push(qClasses.NoAnswerSelected);
        }

        return (
            <div className={qClasses.Question}>
                <div className={qClasses.Header}>{this.props.header}</div>
                <div className={qClasses.SubHeader}>{this.props.subHeader}</div>

                <div className={classes.Options}>
                    {options}
                </div>

                <div 
                    className={arrToCss(noAnswerClasses)}
                    onClick={this.props.onNoAnswer}
                >
                    {this.props.noAnswerText}
                </div>
            </div>
        );
    }
}

MultiOptions.propTypes = {
    header: propTypes.string.isRequired,
    subHeader: propTypes.oneOfType([
        propTypes.string,
        propTypes.element
    ]),
    options: propTypes.arrayOf(propTypes.shape({
        id: propTypes.number,
        label: propTypes.string,
    })).isRequired,
    noAnswerText: propTypes.string,
    onNoAnswer: propTypes.func,
    value: propTypes.oneOfType([
        propTypes.string,
        propTypes.arrayOf(propTypes.number),
        propTypes.number
    ]).isRequired,
    valueChanged: propTypes.func.isRequired,
};

export const TYPE_MULTI_OPTIONS = 'type_multi_options';
export default MultiOptions;