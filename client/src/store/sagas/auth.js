import server from "../../axios-main";
import { put, all, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as actionTypes from '../actions/actionTypes';
import { saveItem, parseItem, delItem } from '../../util/utility';

export function* signin(action) {
    try {
        const res = yield server.get('/api/check?username=' + action.username);
        if(res.data.exists){ 
            const {anamnesesResult, recordsResult} = yield all({
                afetch:             put(actions.fetchAnamnesisData(action.username)),
                rfetch:             put(actions.fetchRecords(action.username)),
                anamnesesResult:    take([actionTypes.FETCH_ANAMNESIS_DATA_SUCCESS, actionTypes.FETCH_ANAMNESIS_DATA_FAIL]),
                recordsResult:      take([actionTypes.FETCH_RECORDS_SUCCESS, actionTypes.FETCH_RECORDS_FAIL])
            });
            if(anamnesesResult.type === actionTypes.FETCH_ANAMNESIS_DATA_FAIL || recordsResult.type === actionTypes.FETCH_RECORDS_FAIL){
                yield put(actions.signinFail('Server Error'));
            } else {
                saveItem('username', action.username);
                yield all([
                    put(actions.signinSuccess(action.username)),
                    put(actions.redirect('/dashboard'))
                ]);
            }
        } else {
            yield put(actions.signinFail('Nutzer existiert nicht'));
        }
    } catch (err) {
        yield put(actions.signinFail('Server Error'));
    }
}

export function* logout(action) {
    delItem('username');
    delItem('records');
    yield delItem('anamnesis');
}

export function* signup(action){
    try {
        const res = yield server.get('/api/check?username=' + action.username);
        if(!res.data.exists){ 
            yield put(actions.startSignupProcess(action.username));
        } else {
            yield put(actions.signupFail('Nutzername existiert bereits'));
        }
    } catch (err) {
        yield put(actions.signupFail('Server Error'));
    }
}

export function* endSignupProcess(action){
    try {
        const data = {
            user: {username: action.username},
            anamnesis_data: action.anamnesisData
        }
        const res = yield server.post('/api/anamneses', data);
        yield put(actions.setAnamnesisData(res.data));
        const {fetchResult} = yield all({
            frecords:       put(actions.fetchRecords(action.username)),
            fetchResult:    take([actionTypes.FETCH_RECORDS_SUCCESS, actionTypes.FETCH_RECORDS_FAIL])
        });
        if (fetchResult.type === actionTypes.FETCH_RECORDS_SUCCESS){
            saveItem('username', action.username);
            yield all([
                put(actions.signupSuccess(action.username)),
                put(actions.redirect('/dashboard'))
            ]);
        } else {
            yield put(actions.signupFail('Server Error'));
        }
    } catch (err) {
        yield put(actions.signupFail(err.message));
    }
}

export function* checkAuthState(action) {
    const username = parseItem('username');
    const anamnesis = parseItem('anamnesis');
    const records = parseItem('records');
    if (username === null) {
        yield put(actions.logout());
    } else {
        
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