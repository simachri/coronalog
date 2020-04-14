import server from "../../axios-main";
import { put, all } from 'redux-saga/effects';
import * as actions from '../actions';

export function* signin(action) {
    try {
        const res = yield server.get('/api/check?username=' + action.username);
        if(res.data.exists){ 
            yield put(actions.fetchAnamnesisData(action.username));
            yield put(actions.signinSuccess(action.username));
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

export function* fetchUserAnamnesis(action){
    try {
        const data = {
            user: {username: action.username},
            anamnesis_data: action.anamnesisData
        }
        const res = yield server.post('/api/anamneses', data);
        yield all([
            put(actions.signupSuccess(action.username)),
            put(actions.setAnamnesisData(res.data))
        ]);
    } catch (err) {
        yield put(actions.signupFail(err));
    }
}

export function* logout(action){
    yield put(actions.resetAnamnesisData());
}