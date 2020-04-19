import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    redirectTo: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.REDIRECT: return redirect(state, action);
        case actionTypes.REDIRECT_ON: return redirectOn(state, action);
        case actionTypes.RESET_REDIRECT: return resetRedirect(state, action);
        default: return state;
    }
}

const redirect = (state, action) => {
    return updateObject(state, {
        redirectTo: action.path,
    });
};

const redirectOn = (state, action) => {
    return state;
};

const resetRedirect = (state, action) => {
    return updateObject(state, {
        redirectTo: null,
    });
};