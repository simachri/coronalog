import * as actionTypes from './actionTypes';

export const setRecords = (records) => {
    return {
        type: actionTypes.SET_RECORDS,
        data: records
    };
};

export const setRecord = (date, symptoms) => {
    return {
        type: actionTypes.SET_RECORD,
        date: date,
        symptoms: symptoms
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

export const postRecord = (date, symptoms) => {
    return {
        type: actionTypes.POST_RECORD,
        date: date,
        symptoms: symptoms
    };
};

export const postRecordSuccess = () => {
    return {
        type: actionTypes.POST_RECORD_SUCCESS,
    };
};

export const postRecordFail = (errorMsg) => {
    return {
        type: actionTypes.POST_RECORD_FAIL,
        errorMsg: errorMsg
    };
};