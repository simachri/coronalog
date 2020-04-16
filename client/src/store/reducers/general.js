import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    redirectTo: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.REDIRECT: return redirect(state, action);
        case actionTypes.RESET_REDIRECT: return resetRedirect(state, action);
        default: return state;
    }
}

const redirect = (state, action) => {
    return updateObject(state, {
        redirectTo: action.path,
    });
};

const resetRedirect = (state, action) => {
    return updateObject(state, {
        redirectTo: null,
    });
};