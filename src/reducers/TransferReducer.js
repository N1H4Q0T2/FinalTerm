import {
	UPDATE_ADDRESS,
	UPDATE_AMOUNT,
	SUBMIT_TRANSFER,
	UPDATE_SUBMITSUCCESS,
} from '../actions/TransferReducerActions';

const inititalState = {
	submitSuccess: 0,
	amount: 0,
	address: 'GAG2MLRZWL673MR6JZDWDERRLCTFG7LEKNI42R3S2LQWAPBDU26TJEED',
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
	default:
		return state;
	}
};

export default RouteReducer;
