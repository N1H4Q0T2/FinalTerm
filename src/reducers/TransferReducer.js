import {
	UPDATE_ADDRESS,
	UPDATE_AMOUNT,
	SUBMIT_TRANSFER,
	UPDATE_SUBMITSUCCESS,
} from '../actions/TransferReducerActions';

const inititalState = {
	submitSuccess: 0,
	amount: 0,
	address: '',
};

const RouteReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_AMOUNT:
		return {
			...state,
			amount: action.data,
		};
	case UPDATE_ADDRESS:
		return {
			...state,
			address: action.data,
		};
	case SUBMIT_TRANSFER:
		return {
			...state,
			amount: 0,
			address: '',
		};
	case UPDATE_SUBMITSUCCESS:
		return {
			...state,
			submitSuccess: action.data,
		};
	case 'CLEAR_ALL_DATA': {
		return {
			...state,
			submitSuccess: 0,
			amount: 0,
			address: '',
		};
	}
	default:
		return state;
	}
};

export default RouteReducer;
