import {
	EDITING,
	UPDATE_USERNAME,
	UPDATE_PRIVATEKEY,
	UPDATE_PUBLICKEY,
	UPDATE_ISLOGIN,
	UPDATE_BALANCE,
	RESET_BALANCE,
	UPDATE_BANDWIDTH,
	UPDATE_AVATAR,
} from '../actions/UserProfileReducer';

const inititalState = {
	isLogin: false,
	publicKey: 'GDJXKJMBXBSRCPN6LOYYASV7U5WIG5ZHOUW7D3X5I6AVEUHFVANTLH5K',
	privateKey: 'SDKGX6GW3YCUS34RPT3OM5UAJKHG4YINWFNO2LRGWGO5WR3LLRZSP63A',
	avatar: '',
	userName: '',
	balance: 0,
	isEditing: false,
	bandwidth: 0,
	bandwidthTime: '',
	bandwidthLimit: 0,
};

const UserProfileReducer = (state = inititalState, action) => {
	switch (action.type) {
	case EDITING: {
		return {
			...state,
			isEditing: !state.isEditing,
		};
	}
	case UPDATE_USERNAME: {
		return {
			...state,
			userName: action.data,
		};
	}
	case UPDATE_AVATAR: {
		return {
			...state,
			avatar: action.data,
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
	case UPDATE_BANDWIDTH: {
		return {
			...state,
			bandwidth: action.data.bandwidth,
			bandwidthTime: action.data.bandwidthTime,
			bandwidthLimit: action.data.bandwidthLimit,
		};
	}
	case RESET_BALANCE: {
		return {
			...state,
			balance: 0,
		};
	}
	default:
		return state;
	}
};

export default UserProfileReducer;
