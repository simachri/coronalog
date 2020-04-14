import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    username: null,
    loading: false,
    errorMsg: null,
    currentlySignup: null,
    redirectTo: null
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
        case actionTypes.START_SIGNUP_PROCESS: return startSignupProcess(state, action);
        case actionTypes.END_SIGNUP_PROCESS: return endSignupProcess(state, action);
        case actionTypes.RESET_REDIRECT: return resetRedirect(state, action);
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
        errorMsg: null,
        redirectTo: '/dashboard'
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
        errorMsg: action.msg,
        currentlySignup: false
    });
};

const signupSuccess = (state, action) => {
    return updateObject(state, {
        username: action.username,
        loading: false,
        errorMsg: null,
        currentlySignup: false,
        redirectTo: '/dashboard'
    });
};

const startSignupProcess = (state, action) => {
    return updateObject(state, {
        loading: false,
        currentlySignup: {
            username: action.username
        }
    });
};

const endSignupProcess = (state, action) => {
    const loading = state.currentlySignup ? true : false;
    return updateObject(state, {
        loading: loading,
    });
};

const resetRedirect = (state, action) => {
    return updateObject(state, {
        redirectTo: null,
    });
};