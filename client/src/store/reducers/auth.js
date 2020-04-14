import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    username: null,
    loading: false,
    errorMsg: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_SIGNIN: return signin(state, action);
        case actionTypes.AUTH_SIGNIN_SUCCESS: return signinSuccess(state, action);
        case actionTypes.AUTH_SIGNIN_FAIL: return signinFail(state, action);
        case actionTypes.AUTH_SIGNUP: return signup(state, action);
        case actionTypes.AUTH_SIGNUP_SUCCESS: return signupSuccess(state, action);
        case actionTypes.AUTH_SIGNUP_FAIL: return signupFail(state, action);
        case actionTypes.AUTH_LOGOUT: return logout(state, action);
        default: return state;
    }
};

const signin = (state, action) => {
    return updateObject(state, {
        loading: true,
        errorMsg: null
    });
};

const signinSuccess = (state, action) => {
    return updateObject(state, {
        username: action.username,
        loading: false,
        errorMsg: null
    });
};

const signinFail = (state, action) => {
    return updateObject(state, {
        username: null,
        loading: false,
        errorMsg: action.msg
    });
};

const logout = (state, action) => {
    return updateObject(state, {
        username: null,
        errorMsg: null
    });
};

const signup = (state, action) => {
    return updateObject(state, {
        loading: true,
        errorMsg: null
    });
};

const signupFail = (state, action) => {
    return updateObject(state, {
        username: null,
        loading: false,
        errorMsg: action.msg
    });
};

const signupSuccess = (state, action) => {
    return updateObject(state, {
        username: action.username,
        loading: false,
        errorMsg: null
    });
};