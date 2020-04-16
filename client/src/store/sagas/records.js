import server from "../../axios-main";
import { put } from 'redux-saga/effects';
import * as actions from '../actions';

export function* fetchRecords(action) {
    try {
        const res = yield server.get('/api/records?username=' + action.username);
        yield put(actions.fetchRecordsSuccess(res.data));
    } catch (err) {
        yield put(actions.fetchRecordsFail(err));
    }
}

export function* resetRecords(action) {
    yield put(actions.resetRecords());
}