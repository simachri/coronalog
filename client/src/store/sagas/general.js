import { put, take } from 'redux-saga/effects';
import * as actions from '../actions';

export function* redirectOn(action) {
    const result = yield take([
        action.onAction,
        action.fallbackAction
    ]);
    if (result.type === action.onAction) {
        yield put(actions.redirect(action.path));
    }
}