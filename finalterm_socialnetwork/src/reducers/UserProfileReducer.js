import { EDITING, UPDATE_PROFILE } from '../actions/UserProfileReducer';

const inititalState = {
	userName: 'NGUYEN HO QUOC THINH',
	dateOfBirth: 'Feb 14 1997',
	isEditing: false,
};

const UserProfileReducer = (state = inititalState, action) => {
	switch (action.type) {
	case EDITING: {
		return {
			...state,
			isEditing: !state.isEditing,
		};
	}
	case UPDATE_PROFILE: {
		return {
			...state,
			userName: action.data.userName,
			dateOfBirth: action.data.dateOfBirth,
		};
	}
	default:
		return state;
	}
};

export default UserProfileReducer;
