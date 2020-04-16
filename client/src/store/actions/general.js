import * as actionTypes from './actionTypes';

export const redirect = (path) => {
    return {
        type: actionTypes.REDIRECT,
        path: path
    };
};

export const resetRedirect = () => {
    return {
        type: actionTypes.RESET_REDIRECT,
    };
};