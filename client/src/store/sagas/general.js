import { put, take } from 'redux-saga/effects';
import * as actions from '../actions';

export function* redirectOn(action) {
    yield take(action.onAction);
    yield put(actions.redirect(action.path));
}