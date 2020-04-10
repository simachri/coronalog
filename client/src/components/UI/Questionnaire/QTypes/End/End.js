import React from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import classes from '../../Questionnaire.module.css';
import Button from './../../../Button/Button';
import Spinner from './../../../Spinner/Spinner';

const end = (props) => {

    let button = null;
    if(props.showLoading){
        button = <Spinner />
    } else if (props.showFinished){
        button = <FontAwesomeIcon icon={faCheck} />
    } else if (props.showSaveButton) {
        button = <Button click={() => console.log('Saved')} >{props.saveButtonText}</Button>
    }

    return (
        <div className={classes.Question}>
            <div className={classes.Header}>{props.header}</div>
            <div className={classes.SubHeader}>{props.subHeader}</div>
            
            <div className={classes.SaveArea}>
                {button}
            </div>
            
         </div>
    );
};

end.propTypes = {
    header: propTypes.string.isRequired,
    subHeader: propTypes.string,
    showLoading: propTypes.bool,
    showFinished: propTypes.bool,
    showSaveButton: propTypes.bool,
    saveButtonText: propTypes.string,
    onSave: propTypes.func
}

export const TYPE_END = 'type_end';
export default end;
