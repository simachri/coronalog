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
    ]);
}

export function* anamnesisWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_ANAMNESIS_DATA, anamnesisSagas.fetchAnamnesisData),
    ])
}

export function* recordsWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_RECORDS, recordsSagas.fetchRecords),
    ])
}