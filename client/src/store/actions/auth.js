import * as actionTypes from './actionTypes';

export const signin = (username) => {
    return {
        type: actionTypes.AUTH_SIGNIN,
        username: username
    };
};

export const signinFail = (err) => {
    return {
        type: actionTypes.AUTH_SIGNIN_FAIL,
        error: err
    };
};

export const signinSuccess = (username) => {
    return {
        type: actionTypes.AUTH_SIGNIN_SUCCESS,
        username: username
    };
};