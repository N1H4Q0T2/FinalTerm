import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import getRoutes from './config/routes';
import './index.css';

const store = createStore(
	combineReducers({
		...reducers,
	}),
	applyMiddleware(thunk)
);

ReactDOM.render(
	<Provider store={store}>{getRoutes()}</Provider>,
	document.getElementById('root')
);
