import * as authSagas from './auth';
import * as anamnesisSagas from './anamnesis';
import * as recordsSagas from './records';
import * as actionTypes from '../actions/actionTypes';

import { takeEvery, all } from 'redux-saga/effects';

export function* authWatcher() {
    yield all([
        takeEvery(actionTypes.AUTH_SIGNIN, authSagas.signin),
        takeEvery(actionTypes.AUTH_SIGNUP, authSagas.signup),
        takeEvery(actionTypes.END_SIGNUP_PROCESS, authSagas.endSignupProcess),
        takeEvery(actionTypes.AUTH_LOGOUT, authSagas.logout),
        takeEvery([
            actionTypes.AUTH_LOGOUT,
            actionTypes.AUTH_SIGNIN_FAIL,
            actionTypes.AUTH_SIGNUP_FAIL
         ], 
         anamnesisSagas.resetAnamnesisData),
        takeEvery([
            actionTypes.AUTH_LOGOUT,
            actionTypes.AUTH_SIGNIN_FAIL,
            actionTypes.AUTH_SIGNUP_FAIL
         ],
         recordsSagas.resetRecords),
         takeEvery(actionTypes.CHECK_AUTH_STATE, authSagas.checkAuthState)
    ]);
}

export function* anamnesisWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_ANAMNESIS_DATA, anamnesisSagas.fetchAnamnesisData),
        takeEvery(actionTypes.POST_ANAMNESIS_DATA, anamnesisSagas.postAnamnesisData),
        takeEvery([
            actionTypes.SET_ANAMNESIS_DATA,
            actionTypes.FETCH_ANAMNESIS_DATA_SUCCESS
         ], 
         anamnesisSagas.saveAnamnesisData)
    ])
}

export function* recordsWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_RECORDS, recordsSagas.fetchRecords),
        takeEvery([
            actionTypes.SET_RECORDS,
            actionTypes.FETCH_RECORDS_SUCCESS
         ], 
         recordsSagas.saveRecords)
    ])
}