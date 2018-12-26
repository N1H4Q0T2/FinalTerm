import { UPDATE_IS_SUBMITTING } from '../actions/SubmitReducerActions';

const inititalState = {
	isSubmitting: false,
};

const SubmitReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_IS_SUBMITTING: {
		return {
			...state,
			isSubmitting: action.data,
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
