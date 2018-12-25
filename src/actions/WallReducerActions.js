export const UPDATE_ACCOUNT_POSTS = 'UPDATE_ACCOUNT_POSTS';
export const UPDATE_EVERYONE_POSTS = 'UPDATE_EVERYONE_POSTS';

export const update_AccountPosts = data => ({
	type: UPDATE_ACCOUNT_POSTS,
	data: data,
});

export const updateEveryonePosts = data => {
	return {
		type: UPDATE_EVERYONE_POSTS,
		data: data,
	};
};
