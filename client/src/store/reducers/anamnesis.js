import * as actionTypes from '../actions/actionTypes';
import { updateObject } from './../../util/utility';

const initialState = {
    anamnesisData: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_ANAMNESIS_DATA: return setAnamnesisData(state, action);
        default: return state;
    }
}

const setAnamnesisData = (state, action) => {
    return updateObject(state, {
        anamnesisData: action.anamnesisData,
    });
};