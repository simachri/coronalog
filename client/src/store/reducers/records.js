import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    data: null,
    loading: false,
    errorMsg: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_RECORDS: return setRecords(state, action);
        case actionTypes.RESET_RECORDS: return resetRecords(state, action);
        case actionTypes.FETCH_RECORDS: return fetchRecords(state, action);
        case actionTypes.FETCH_RECORDS_SUCCESS: return fetchRecordsSuccess(state, action);
        case actionTypes.FETCH_RECORDS_FAIL: return fetchRecordsFail(state, action);
        default: return state;
    }
}

const setRecords = (state, action) => {
    return updateObject(state, {
        data: action.data,
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
        data: action.data,
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