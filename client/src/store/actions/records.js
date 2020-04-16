import * as actionTypes from './actionTypes';

export const setRecords = (records) => {
    return {
        type: actionTypes.SET_RECORDS,
        data: records
    };
};

export const resetRecords = () => {
    return {
        type: actionTypes.RESET_RECORDS,
    };
};

export const fetchRecords = (username) => {
    return {
        type: actionTypes.FETCH_RECORDS,
        username: username
    };
};

export const fetchRecordsSuccess = (records) => {
    return {
        type: actionTypes.FETCH_RECORDS_SUCCESS,
        data: records
    };
};

export const fetchRecordsFail = (msg) => {
    return {
        type: actionTypes.FETCH_RECORDS_FAIL,
        errorMsg: msg
    };
};