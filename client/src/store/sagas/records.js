import server from "../../axios-main";
import { put, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { saveItem, sortRecords } from '../../util/utility';
import { getErrorMessage } from './../../contentConf/Errors';

export function* fetchRecords(action) {
    try {
        const res = yield server.get('/api/records');
        yield put(actions.fetchRecordsSuccess(res.data));
    } catch (err) {
        let message = 'Error';
        if (err.response && err.response.data.error && err.response.data.error.key) {
            message = getErrorMessage(err.response.data.error.key);
        }
        yield put(actions.fetchRecordsFail(message));
    }
}

export function* postRecord(action) {
    try {
        const data = {
            date: action.date,
            symptoms: action.symptoms
        };
        yield server.post('/api/record', data);
        yield put(actions.postRecordSuccess());
    } catch (err) {
        let message = 'Error';
        if (err.response && err.response.data.error && err.response.data.error.key) {
            message = getErrorMessage(err.response.data.error.key);
        }
        yield put(actions.postRecordFail(message));
    }
}

export function* resetRecords(action) {
    yield put(actions.resetRecords());
}

export function* saveRecords(action) {
    const state = yield select();
    yield saveItem('records', sortRecords(state.records.data));
}