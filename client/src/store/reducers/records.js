import * as actionTypes from '../actions/actionTypes';
import { updateObject, sortRecords, sameDay } from './../../util/utility';

const initialState = {
    data: null,
    loading: false,
    errorMsg: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_RECORDS: return setRecords(state, action);
        case actionTypes.SET_RECORD: return setRecord(state, action);
        case actionTypes.RESET_RECORDS: return resetRecords(state, action);
        case actionTypes.FETCH_RECORDS: return fetchRecords(state, action);
        case actionTypes.FETCH_RECORDS_SUCCESS: return fetchRecordsSuccess(state, action);
        case actionTypes.FETCH_RECORDS_FAIL: return fetchRecordsFail(state, action);
        case actionTypes.POST_RECORD: return postRecord(state, action);
        case actionTypes.POST_RECORD_SUCCESS: return postRecordSuccess(state, action);
        case actionTypes.POST_RECORD_FAIL: return postRecordFail(state, action);
        default: return state;
    }
}

const setRecords = (state, action) => {
    return updateObject(state, {
        data: sortRecords(action.data),
    });
};

const setRecord = (state, action) => {
    const newRecordData = [];
    for (let record of state.data) {
        if (!sameDay(record.date, action.date)) {
            newRecordData.push(record);
        }
    }
    newRecordData.push({
        date: action.date,
        symptoms: action.symptoms
    });

    return updateObject(state, {
        data: sortRecords(newRecordData),
    });
};

const resetRecords = (state, action) => {
    return updateObject(state, {
        data: null,
    });
};

const fetchRecords = (state, action) => {
    return updateObject(state, {
        loading: true,
    });
};

const fetchRecordsSuccess = (state, action) => {
    return updateObject(state, {
        data: sortRecords(action.data),
        loading: false,
        errorMsg: null
    });
};

const fetchRecordsFail = (state, action) => {
    return updateObject(state, {
        data: null,
        loading: false,
        errorMsg: action.errorMsg
    });
};

const postRecord = (state, action) => {
    return updateObject(state, {
        loading: true,
    });
};

const postRecordSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        errorMsg: null
    });
};

const postRecordFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        errorMsg: action.errorMsg
    });
};