import {
	UPDATE_FOLLOWING,
	UPDATE_NEW_FOLLOWING_USER,
	ADD_NEW_FOLLOWING_USER,
} from '../actions/FollowReducerActions';

const inititalState = {
	following: [],
	follower: [],
	newFollowingUser: '',
};

const FollowReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_FOLLOWING: {
		return {
			...state,
			following: action.data,
		};
	}
	case UPDATE_NEW_FOLLOWING_USER: {
		return { ...state, newFollowingUser: action.data };
	}
	case ADD_NEW_FOLLOWING_USER: {
		const data = state.following.push(action.data);
		return { ...state, following: data };
	}
	case 'CLEAR_ALL_DATA': {
		return {
			...state,
			following: [],
			follower: [],
			newFollowingUser: '',
		};
	}
	default:
		return state;
	}
};

export default FollowReducer;
