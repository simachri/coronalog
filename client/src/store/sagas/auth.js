import server from "../../axios-main";
import { put } from 'redux-saga/effects';
import * as actions from '../actions';

export function* signin(action) {
    try {
        const res = yield server.get('/api/check?username=' + action.username);
        if(res.data.exists){ 
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
        if(res.data.exists){ 
            yield put(actions.signupFail('Nutzername existiert bereits'));
        } else {
            yield put(actions.signupSuccess(action.username));
            //ToDo 
        }
    } catch (err) {
        yield put(actions.signupFail('Server Error'));
    }
}