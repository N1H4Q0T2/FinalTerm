import {
	UPDATE_ACCOUNT_POSTS,
	UPDATE_EVERYONE_POSTS,
} from '../actions/WallReducerActions';

const inititalState = {
	accountPosts: [],
	everyonePosts: [],
};

const WallReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_ACCOUNT_POSTS: {
		return {
			...state,
			accountPosts: action.data,
		};
	}
	case UPDATE_EVERYONE_POSTS: {
		return {
			...state,
			everyonePosts: action.data,
		};
	}
	default:
		return state;
	}
};

export default WallReducer;
