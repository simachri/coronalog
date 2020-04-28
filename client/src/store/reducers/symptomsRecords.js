import {SYMPTOMS_RECORDS_LOADED} from "../actions/actionTypes";

const initialState = {
    dates: [],
    symptomsRecords: [
        { date: null,
          breathlessness: false,
          diarrhoea: false,
          fatigued: false,
          sniffles: false,
          cough_intensity: 0,
          limb_pain: 0,
          sore_throat: 0,
          fewer: 0,
    }]
};

function fillSymptomsRecords(state, payload) {
    if (payload.length === 0)
        return [];
    let new_state = { dates: [], symptomsRecords: []};
    payload.forEach(item => {
        new_state.dates.push(item.date);
        new_state.symptomsRecords.push(item.symptoms);
    });
    return new_state;
}

function reducer(state = initialState, action) {

    if (action.type === SYMPTOMS_RECORDS_LOADED) {
        return Object.assign({}, state, fillSymptomsRecords(state, action.payload));
    }
    return state;
}

export default reducer;