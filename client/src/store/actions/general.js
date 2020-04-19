import * as actionTypes from './actionTypes';

export const redirect = (path) => {
    return {
        type: actionTypes.REDIRECT,
        path: path
    };
};

export const redirectOn = (path, actionType, fallbackActionType) => {
    return {
        type: actionTypes.REDIRECT_ON,
        path: path,
        onAction: actionType,
        fallbackAction: fallbackActionType
    };
};

export const resetRedirect = () => {
    return {
        type: actionTypes.RESET_REDIRECT,
    };
};