import server from "../../axios-main";
import { put, all, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as actionTypes from '../actions/actionTypes';
import { saveItem, parseItem, delItem } from '../../util/utility';
import { getErrorMessage } from './../../contentConf/Errors';

export function* signin(action) {
    try {
        const data = {
            username: action.username,
            password: action.password
        }
        const res = yield server.post('/auth/signin', data);
        saveItem('username', res.data.username);

        // try getting records and anamnesis
        yield all({
            afetch:             put(actions.fetchAnamnesisData()),
            rfetch:             put(actions.fetchRecords()),
            anamnesesResult:    take([actionTypes.FETCH_ANAMNESIS_DATA_SUCCESS, actionTypes.FETCH_ANAMNESIS_DATA_FAIL]),
            recordsResult:      take([actionTypes.FETCH_RECORDS_SUCCESS, actionTypes.FETCH_RECORDS_FAIL])
        });

        yield all([
            put(actions.signinSuccess(action.username)),
            put(actions.redirect('/dashboard'))
        ]);
    } catch (err) {
        let message = 'Error';
        if (err.response && err.response.data.error && err.response.data.error.key) {
            message = getErrorMessage(err.response.data.error.key);
        }
        yield put(actions.signinFail(message));
    }
}

export function* logout(action) {
    try {
        delItem('username');
        delItem('anamnesis');
        delItem('records');
        yield server.get('/auth/logout');
    } catch (err) {
        console.log(err);
    }
}

export function* signup(action){
    if (action.password1 === action.password2) {
        try {
            const data = {
                username: action.username,
                password: action.password1,
                usage_purpose: action.vendor
            }
            const res = yield server.post('/auth/signup', data);
            saveItem('username', res.data.username);

            yield put(actions.setAnamnesisData({}));
            yield put(actions.setRecords([]));
            yield put(actions.signupSuccess(res.data.username));
            yield put(actions.redirect('/user-info'));

        } catch (err) {
            let message = 'Error';
            if (err.response && err.response.data.error && err.response.data.error.key) {
                message = getErrorMessage(err.response.data.error.key);
            }
            yield put(actions.signinFail(message));
        }
    }
}

export function* checkAuthState(action) {
    const username = parseItem('username');
    if ( !username ) {
        yield put(actions.logout());
    } else {
        //try to fetch user data. If it fails --> logout
        const anamnesis = parseItem('anamnesis');
        const records = parseItem('records');

        let signinSuccess = true;
        if(anamnesis === null) {
            const {fetchResult} = yield all({
                fData: put(actions.fetchAnamnesisData(username)),
                fetchResult: take([actionTypes.FETCH_ANAMNESIS_DATA_SUCCESS, actionTypes.FETCH_ANAMNESIS_DATA_FAIL])
            });
            if (fetchResult.type === actionTypes.FETCH_ANAMNESIS_DATA_FAIL) {
                signinSuccess = false;
            }
        } else {
            yield put(actions.setAnamnesisData(anamnesis));
        }

        if (signinSuccess) {
            if (records === null) {
                const {fetchResult} = yield all({
                    fData: put(actions.fetchRecords(username)),
                    fetchResult: take([actionTypes.FETCH_RECORDS_SUCCESS, actionTypes.FETCH_RECORDS_FAIL])
                });
                if (fetchResult.type === actionTypes.FETCH_RECORDS_FAIL) {
                    signinSuccess = false;
                }
            } else {
                yield put(actions.setRecords(records));
            }
        }

        if (signinSuccess) {
            yield put(actions.signinSuccess(username));
        } else {
            yield put(actions.logout());
        }
    }
}