import server from "../../axios-main";
import { put } from 'redux-saga/effects';
import * as actions from '../actions';

export function* fetchAnamnesisData(action) {
    try {
        const res = yield server.get('/api/anamneses?username=' + action.username);
        yield put(actions.fetchAnamnesisDataSuccess(res.data));
    } catch (err) {
        yield put(actions.fetchAnamnesisDataFail(err));
    }
}

export function* postAnamnesisData(action) {
    try {
        const data = {
            user: {username: action.username},
            anamnesis_data: action.anamnesisData
        }
        yield server.post('/api/anamneses', data);
        yield put(actions.postAnamnesisDataSuccess());
    } catch (err) {
        yield put(actions.postAnamnesisDataFail(err));
    }
}

export function* resetAnamnesisData(action) {
    yield put(actions.resetAnamnesisData());
}