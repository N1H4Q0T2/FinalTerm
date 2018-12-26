import { UPDATE_CONTENT } from '../actions/PostReducerActions';

const inititalState = {
	content: '',
};

const PostReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_CONTENT: {
		return {
			...state,
			content: action.data,
		};
	}
	case 'CLEAR_ALL_DATA': {
		return {
			...state,
			content: '',
		};
	}
	default:
		return state;
	}
};

export default PostReducer;
