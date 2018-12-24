export const UPDATE_FOLLOWING = 'UPDATE_FOLLOWING';
export const UPDATE_NEW_FOLLOWING_USER = 'UPDATE_NEW_FOLLOWING_USER';
export const ADD_NEW_FOLLOWING_USER = 'ADD_NEW_FOLLOWING_USER';

export const updateFollowing = data => {
	return {
		type: UPDATE_FOLLOWING,
		data: data,
	};
};

export const updateNewFollowingUser = data => {
	return {
		type: UPDATE_NEW_FOLLOWING_USER,
		data: data,
	};
};

export const addNewFollowingUserIntoFollowingList = data => {
	return {
		type: ADD_NEW_FOLLOWING_USER,
		data: data,
	};
};
