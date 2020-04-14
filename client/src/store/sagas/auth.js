import server from "../../axios-main";
import { put } from 'redux-saga/effects';
import * as actions from '../actions';

export function* signin(action) {
    try {
        const res = yield server.get('/api/check?username=' + action.username);
        if(res.data.exists){ 
            yield put(actions.signinSuccess(action.username));
        } else {
            yield put(actions.signinFail('Username does not exist'));
        }
    } catch (err) {
        yield put(actions.signinFail(err));
    }
}