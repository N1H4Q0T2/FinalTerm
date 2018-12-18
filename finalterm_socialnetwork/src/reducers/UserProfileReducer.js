import { EDITING, UPDATE_PROFILE } from '../actions/UserProfileReducer';

const inititalState = {
	publicKey: 'GDJXKJMBXBSRCPN6LOYYASV7U5WIG5ZHOUW7D3X5I6AVEUHFVANTLH5K',
	privateKey: 'SDKGX6GW3YCUS34RPT3OM5UAJKHG4YINWFNO2LRGWGO5WR3LLRZSP63A',
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
