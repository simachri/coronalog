import {FETCH_SYMPTOMS_RECORDS} from "./actionTypes";

export function fetchSymptomsRecords(username) {
    return { type: FETCH_SYMPTOMS_RECORDS, payload: { username } };
}