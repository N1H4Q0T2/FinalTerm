import { UPDATE_ACCOUNT_POSTS } from '../actions/WallReducerActions';

const inititalState = {
	accountPosts: [],
};

const WallReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_ACCOUNT_POSTS: {
		return {
			...state,
			accountPosts: action.data,
		};
	}
	default:
		return state;
	}
};

export default WallReducer;
