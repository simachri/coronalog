import server from "../../axios-main";
import { put, all, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as actionTypes from '../actions/actionTypes';

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
                yield put(actions.signinSuccess(action.username));
            }
        } else {
            yield put(actions.signinFail('Nutzer existiert nicht'));
        }
    } catch (err) {
        yield put(actions.signinFail('Server Error'));
    }
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
            yield put(actions.signupSuccess(action.username));
        } else {
            yield put(actions.signupFail('Server Error'));
        }
    } catch (err) {
        yield put(actions.signupFail(err));
    }
}