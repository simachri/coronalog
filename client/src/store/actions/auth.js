import * as actionTypes from './actionTypes';

export const signin = (username) => {
    return {
        type: actionTypes.AUTH_SIGNIN,
        username: username
    };
};

export const signinFail = (msg) => {
    return {
        type: actionTypes.AUTH_SIGNIN_FAIL,
        msg: msg
    };
};

export const signinSuccess = (username) => {
    return {
        type: actionTypes.AUTH_SIGNIN_SUCCESS,
        username: username
    };
};

export const logout = (username) => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const signup = (username) => {
    return {
        type: actionTypes.AUTH_SIGNUP,
        username: username
    };
};

export const signupFail = (msg) => {
    return {
        type: actionTypes.AUTH_SIGNUP_FAIL,
        msg: msg
    };
};

export const signupSuccess = (username) => {
    return {
        type: actionTypes.AUTH_SIGNUP_SUCCESS,
        username: username
    };
};

export const startSignupProcess = (username) => {
    return {
        type: actionTypes.START_SIGNUP_PROCESS,
        username: username
    };
};

export const endSignupProcess = (username, anamnesisData) => {
    return {
        type: actionTypes.END_SIGNUP_PROCESS,
        anamnesisData: anamnesisData,
        username: username
    };
};

export const checkAuthState = () => {
    return {
        type: actionTypes.CHECK_AUTH_STATE,
    };
};