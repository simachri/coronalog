import server from "../../axios-main";
import { put, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { saveItem, sortRecords } from '../../util/utility';

export function* fetchRecords(action) {
    try {
        const res = yield server.get('/api/records?username=' + action.username);
        yield put(actions.fetchRecordsSuccess(res.data));
    } catch (err) {
        yield put(actions.fetchRecordsFail(err));
    }
}

export function* postRecord(action) {
    const state = yield select();
    try {
        const data = {
            user: {username: state.auth.username},
            record: {
                date: action.date,
                symptoms: action.symptoms
            }
        };
        yield server.post('/api/records', data);
        yield put(actions.postRecordSuccess());
    } catch (err) {
        yield put(actions.postRecordFail(err));
    }
}

export function* resetRecords(action) {
    yield put(actions.resetRecords());
}

export function* saveRecords(action) {
    const state = yield select();
    yield saveItem('records', sortRecords(state.records.data));
}