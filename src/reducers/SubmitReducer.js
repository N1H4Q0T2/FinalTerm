import {
	UPDATE_IS_SUBMITTING,
	UPDATE_FOLLOW_SUCCESS,
	UPDATE_POST_AND_TRANSFER_SUCCESS,
	UPDATE_CHANGE_PROFILE_SUCCESS,
	UPDATE_COMMENT_AND_REACT_SUCCESS
} from '../actions/SubmitReducerActions';

const inititalState = {
	isSubmitting: false,
	postAndTransferSuccess: false,
	followSuccess: false,
	changeProfileSuccess: false,
	commentAndReacSuccess: false,
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
	case UPDATE_CHANGE_PROFILE_SUCCESS: {
		return {
			...state,
			changeProfileSuccess: action.data,
		};
	}
	case UPDATE_COMMENT_AND_REACT_SUCCESS: {
		return {
			...state,
			commentAndReacSuccess: action.data,
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
