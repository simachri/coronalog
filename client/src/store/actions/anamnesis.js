import * as actionTypes from './actionTypes';

export const setAnamnesisData = (anamnesisData) => {
    return {
        type: actionTypes.SET_ANAMNESIS_DATA,
        anamnesisData: anamnesisData
    };
};

export const resetAnamnesisData = () => {
    return {
        type: actionTypes.RESET_ANAMNESIS_DATA,
    };
};

export const fetchAnamnesisData = (username) => {
    return {
        type: actionTypes.FETCH_ANAMNESIS_DATA,
        username: username
    };
};

export const fetchAnamnesisDataSuccess = (anamnesisData) => {
    return {
        type: actionTypes.FETCH_ANAMNESIS_DATA_SUCCESS,
        anamnesisData: anamnesisData
    };
};

export const fetchAnamnesisDataFail = (msg) => {
    return {
        type: actionTypes.FETCH_ANAMNESIS_DATA_FAIL,
        errorMsg: msg
    };
};