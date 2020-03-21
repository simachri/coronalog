import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/utility';

const initialState = {
    currentQuestion: 0,
};

const nextQuestion = ( state, action ) => {
    const updatedState = {

    };
    return updateObject(state, updatedState);
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.NEXT_QUESTION: return nextQuestion( state, action );
        default: return state;
    }
};

export default reducer;