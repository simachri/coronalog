import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    data: null,
    loading: false,
    errorMsg: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_ANAMNESIS_DATA: return setAnamnesisData(state, action);
        case actionTypes.RESET_ANAMNESIS_DATA: return resetAnamnesisData(state, action);
        case actionTypes.FETCH_ANAMNESIS_DATA: return fetchAnamnesisData(state, action);
        case actionTypes.FETCH_ANAMNESIS_DATA_SUCCESS: return fetchAnamnesisDataSuccess(state, action);
        case actionTypes.FETCH_ANAMNESIS_DATA_FAIL: return fetchAnamnesisDataFail(state, action);
        case actionTypes.POST_ANAMNESIS_DATA: return postAnamnesisData(state, action);
        case actionTypes.POST_ANAMENSIS_DATA_SUCCESS: return postAnamnesisDataSuccess(state, action);
        case actionTypes.POST_ANAMNESIS_DATA_FAIL: return postAnamnesisDataFail(state, action);
        default: return state;
    }
}

const setAnamnesisData = (state, action) => {
    return updateObject(state, {
        data: action.anamnesisData,
        loading: false,
        errorMsg: null
    });
};

const resetAnamnesisData = (state, action) => {
    return updateObject(state, {
        data: null,
    });
};

const fetchAnamnesisData = (state, action) => {
    return updateObject(state, {
        loading: true,
    });
};

const fetchAnamnesisDataSuccess = (state, action) => {
    return updateObject(state, {
        data: action.anamnesisData,
        loading: false,
        errorMsg: null
    });
};

const fetchAnamnesisDataFail = (state, action) => {
    return updateObject(state, {
        data: null,
        loading: false,
        errorMsg: action.errorMsg
    });
};

const postAnamnesisData = (state, action) => {
    return updateObject(state, {
        loading: true,
    });
};

const postAnamnesisDataSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        errorMsg: null
    });
};

const postAnamnesisDataFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        errorMsg: action.errorMsg
    });
};