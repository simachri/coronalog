import { takeEvery, call, put } from "redux-saga/effects";
import {API_ERROR, FETCH_SYMPTOMS_RECORDS, SYMPTOMS_RECORDS_LOADED} from "../actions/actionTypes";

const axios = require('axios').default;

function fetchRecords(username) {
    return axios.get(`/api/records?username=${ username }`)
        .then(response => response.data);
}

function* workerSaga(action) {
    try {
        const payload = yield call(fetchRecords, action.payload.username);
        yield put({ type: SYMPTOMS_RECORDS_LOADED, payload });
    } catch (e) {
        yield put({ type: API_ERROR, payload: e });
    }
}

export default function* watcherSaga() {
    yield takeEvery(FETCH_SYMPTOMS_RECORDS, workerSaga);
}