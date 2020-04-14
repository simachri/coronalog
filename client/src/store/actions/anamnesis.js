import * as actionTypes from './actionTypes';

export const setAnamnesisData = (anamnesisData) => {
    return {
        type: actionTypes.SET_ANAMNESIS_DATA,
        anamnesisData: anamnesisData
    };
};