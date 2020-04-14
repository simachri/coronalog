import * as authSagas from './auth';
import * as actionTypes from '../actions/actionTypes';

import { takeEvery, all } from 'redux-saga/effects';

export function* authWatcher() {
    yield all([
        takeEvery(actionTypes.AUTH_SIGNIN, authSagas.signin),
        takeEvery(actionTypes.AUTH_SIGNUP, authSagas.signup),
        takeEvery(actionTypes.END_SIGNUP_PROCESS, authSagas.fetchUserAnamnesis)
    ]);
}