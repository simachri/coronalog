import server from "../../axios-main";
import { put, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { saveItem } from '../../util/utility';
import { getErrorMessage } from './../../contentConf/Errors';

export function* fetchAnamnesisData(action) {
    try {
        const res = yield server.get('/api/anamnesis');
        yield put(actions.fetchAnamnesisDataSuccess(res.data));
    } catch (err) {
        let message = 'Error';
        if (err.response && err.response.data.error && err.response.data.error.key) {
            message = getErrorMessage(err.response.data.error.key);
        }
        yield put(actions.fetchAnamnesisDataFail(message));
    }
}

export function* postAnamnesisData(action) {
    const state = yield select();
    try {
        const data = {
            anamnesis_data: state.anamnesis.data
        }
        yield server.post('/api/anamnesis', data);
        yield put(actions.postAnamnesisDataSuccess());
    } catch (err) {
        let message = 'Error';
        if (err.response && err.response.data.error && err.response.data.error.key) {
            message = getErrorMessage(err.response.data.error.key);
        }
        yield put(actions.postAnamnesisDataFail(message));
    }
}

export function* resetAnamnesisData(action) {
    yield put(actions.resetAnamnesisData());
}

export function* saveAnamnesisData(action) {
    yield saveItem('anamnesis', action.anamnesisData);
}