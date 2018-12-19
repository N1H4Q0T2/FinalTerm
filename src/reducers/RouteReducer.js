import { UPDATE_ROUTE } from '../actions/RouteReducerActions';

const inititalState = {
	currentRoute: '/',
};

const RouteReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_ROUTE:
		return {
			...state,
			currentRoute: action.data,
		};
	default:
		return state;
	}
};

export default RouteReducer;
