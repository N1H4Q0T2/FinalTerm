import {
	EDITING,
	UPDATE_PROFILE,
	UPDATE_PRIVATEKEY,
	UPDATE_PUBLICKEY,
	UPDATE_ISLOGIN,
	UPDATE_BALANCE,
} from '../actions/UserProfileReducer';

const inititalState = {
	isLogin: false,
	publicKey: 'GDJXKJMBXBSRCPN6LOYYASV7U5WIG5ZHOUW7D3X5I6AVEUHFVANTLH5K',
	privateKey: 'SDKGX6GW3YCUS34RPT3OM5UAJKHG4YINWFNO2LRGWGO5WR3LLRZSP63A',
	userName: 'NGUYEN HO QUOC THINH',
	dateOfBirth: 'Feb 14 1997',
	balance: 10000000,
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
	case UPDATE_PUBLICKEY: {
		return {
			...state,
			publicKey: action.data,
		};
	}
	case UPDATE_PRIVATEKEY: {
		return {
			...state,
			privateKey: action.data,
		};
	}
	case UPDATE_ISLOGIN: {
		return {
			...state,
			isLogin: !state.isLogin,
		};
	}
	case UPDATE_BALANCE: {
		return {
			...state,
			balance: action.data,
		};
	}
	default:
		return state;
	}
};

export default UserProfileReducer;
