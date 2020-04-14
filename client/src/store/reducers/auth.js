import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    username: null,
    loading: false,
};

export default (state = initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_SIGNIN: return signin(state, action);
        case actionTypes.AUTH_SIGNIN_SUCCESS: return signinSuccess(state, action);
        case actionTypes.AUTH_SIGNIN_FAIL: return signinFail(state, action);
        default: return state;
    }
};

const signin = (state, action) => {
    return updateObject(state, {
        loading: true
    });
};

const signinSuccess = (state, action) => {
    return updateObject(state, {
        username: action.username,
        loading: false
    });
};

const signinFail = (state, action) => {
    return updateObject(state, {
        username: null,
        loading: false
    });
};