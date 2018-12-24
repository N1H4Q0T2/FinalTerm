export const UPDATE_FOLLOWING = 'UPDATE_FOLLOWING';

export const updateFollowing = data => {
	return {
		type: UPDATE_FOLLOWING,
		data: data,
	};
};
