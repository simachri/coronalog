import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import dailyLogReducer from './store/reducers/dailyLog';
import symptomsRecordsReducer from './store/reducers/symptomsRecords';
import createSagaMiddleware from "redux-saga";
import api from "./store/sagas/api"

const initialiseSagaMiddleware = createSagaMiddleware();

// noinspection JSUnresolvedVariable
const composeEnhancers = process.env.NODE_ENV === 'development' ?
    ((typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose) : compose;

const rootReducer = combineReducers({
    dailyLog: dailyLogReducer,
    symptomsRecords: symptomsRecordsReducer,
});

const store = createStore(rootReducer,
    composeEnhancers(
        applyMiddleware(initialiseSagaMiddleware)
    )
);

// noinspection JSUnresolvedFunction
initialiseSagaMiddleware.run(api);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
