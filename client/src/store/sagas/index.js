import * as authSagas from './auth';
import * as anamnesisSagas from './anamnesis';
import * as actionTypes from '../actions/actionTypes';

import { takeEvery, all } from 'redux-saga/effects';

export function* authWatcher() {
    yield all([
        takeEvery(actionTypes.AUTH_SIGNIN, authSagas.signin),
        takeEvery(actionTypes.AUTH_SIGNUP, authSagas.signup),
        takeEvery(actionTypes.END_SIGNUP_PROCESS, authSagas.fetchUserAnamnesis),
        takeEvery(actionTypes.AUTH_LOGOUT, authSagas.logout)
    ]);
}

export function* anamnesisWatcher() {
    yield all([
        takeEvery(actionTypes.FETCH_ANAMNESIS_DATA, anamnesisSagas.fetchAnamnesisData),
    ])
}