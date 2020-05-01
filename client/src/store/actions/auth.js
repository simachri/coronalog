import * as actionTypes from './actionTypes';

export const signin = (username, password) => {
    return {
        type: actionTypes.AUTH_SIGNIN,
        username: username,
        password: password
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

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const signup = (username, password1, password2, vendor) => {
    return {
        type: actionTypes.AUTH_SIGNUP,
        username: username,
        password1: password1,
        password2: password2,
        vendor: vendor
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

export const checkAuthState = () => {
    return {
        type: actionTypes.CHECK_AUTH_STATE,
    };
};