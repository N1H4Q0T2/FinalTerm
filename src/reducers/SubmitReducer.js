import { UPDATE_IS_SUBMITTING, UPDATE_FOLLOW_SUCCESS, UPDATE_POST_AND_TRANSFER_SUCCESS } from '../actions/SubmitReducerActions';

const inititalState = {
	isSubmitting: false,
	postAndTransferSuccess: false,
	followSuccess: false,
};

const SubmitReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_IS_SUBMITTING: {
		return {
			...state,
			isSubmitting: action.data,
		};
	}
	case UPDATE_FOLLOW_SUCCESS: {
		return {
			...state,
			followSuccess: action.data,
		};
	}
	case UPDATE_POST_AND_TRANSFER_SUCCESS: {
		return {
			...state,
			postAndTransferSuccess: action.data,
		};
	}
	case 'CLEAR_ALL_DATA': {
		return {
			...state,
			isSubmitting: false,
		};
	}
	default:
		return state;
	}
};

export default SubmitReducer;
