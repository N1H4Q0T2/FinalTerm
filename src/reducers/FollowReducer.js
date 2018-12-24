import { UPDATE_FOLLOWING } from '../actions/FollowReducerActions';

const inititalState = {
	following: [],
	follower: [],
};

const FollowReducer = (state = inititalState, action) => {
	switch (action.type) {
	case UPDATE_FOLLOWING: {
		return {
			...state,
			following: action.data,
		};
	}
	default:
		return state;
	}
};

export default FollowReducer;
