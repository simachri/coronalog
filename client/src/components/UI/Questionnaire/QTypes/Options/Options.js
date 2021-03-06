import React, { Component } from "react";
import propTypes from 'prop-types';

import classes from '../../Questionnaire.module.css';
import Bubble from "../../../Bubble/Bubble";
import Input from "../../../Input/Input";
import {arrToCss} from "../../../../../util/utility";
import {NO_ANSWER} from '../../Questions/Question/Question';

class Options extends Component {

    state = {
        textInput: this.props.extraTextSelected ? this.props.value : ''
    };

   render() {

      const answers = this.props.answers.map( answer => {
          const answerIsSelected = (!answer.textInput && answer.value === this.props.value) || (answer.textInput && this.props.extraTextSelected);
          const inputClasses = [classes.AnswerInput];
          if(answer.textInput){
              if(answerIsSelected){
                  inputClasses.push(classes.Show);
              } else {
                  inputClasses.push(classes.Hide);
              }
          }
          return (
              <div key={answer.id} className={classes.Answer}>
                  <div className={this.props.extraTextSelected ? classes.SlideUp : classes.SlideDown}>
                      <Bubble
                          selected={answerIsSelected}
                          text={answer.label}
                          clicked={() => this.props.valueChanged(
                              !answer.textInput ? answer.value : this.state.textInput,
                              answer.textInput
                          )}
                      />
                  </div>
                  {answer.textInput
                      ?
                      <div className={arrToCss(inputClasses)}>
                          <Input
                              elementType='input'
                              elementConfig={{
                                  type: 'text',
                                  name: answer.label
                              }}
                              val={this.state.textInput}
                              verify={this.props.verify}
                              inputChangedHandler={(event) => {
                                  const newVal = event.target.value.replace(',', '.');
                                  if (newVal.length <= 1 || this.props.verify.test(newVal)){
                                    this.setState({textInput: newVal});
                                    this.props.valueChanged(newVal, true);
                                  }                                  
                              }}
                          />
                      </div>
                      : null
                  }
              </div>
          );
      });

      const noAnswerClasses = [classes.NoAnswer];
      if(this.props.value === NO_ANSWER){
          noAnswerClasses.push(classes.NoAnswerSelected);
      }

      return (
         <div className={classes.Question}>
            <div className={classes.Header}>{this.props.header + (this.props.required ? ' *' : '')}</div>
            <div className={classes.SubHeader}>{this.props.subHeader}</div>
            <div className={classes.Answers}>
               {answers}
            </div>

            {!this.props.required ? (
                <div 
                    className={arrToCss(noAnswerClasses)}
                    onClick={this.props.onNoAnswer}
                >
                {this.props.noAnswerText}
                </div>
            ) : null}
         </div>
      );
   }
}

Options.propTypes = {
    header: propTypes.string.isRequired,
    subHeader: propTypes.oneOfType([
        propTypes.string,
        propTypes.element
    ]),
    answers: propTypes.arrayOf(propTypes.shape({
        id: propTypes.number,
        label: propTypes.string,
        value: propTypes.oneOfType([
            propTypes.string,
            propTypes.number,
            propTypes.bool
        ]),
        textInput: propTypes.bool,
    })).isRequired,
    noAnswerText: propTypes.string,
    onNoAnswer: propTypes.func,
    extraTextSelected: propTypes.bool,
    value: propTypes.oneOfType([
        propTypes.string,
        propTypes.number,
        propTypes.bool
    ]).isRequired,
    valueChanged: propTypes.func.isRequired,
    required: propTypes.bool,
    verify: propTypes.objectOf(RegExp)
};

export default Options;
export const TYPE_OPTIONS = 'type_options';