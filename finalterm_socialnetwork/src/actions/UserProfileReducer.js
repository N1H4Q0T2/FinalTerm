export const EDITING = 'EDITING';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PUBLICKEY = 'UPDATE_PUBLICKEY';
export const UPDATE_PRIVATEKEY = 'UPDATE_PRIVATEKEY';
export const UPDATE_ISLOGIN = 'UPDATE_ISLOGIN';

export const isEditing = () => ({
	type: EDITING,
});

export const updateProfile = data => ({
	type: UPDATE_PROFILE,
	data: data,
});

export const update_PublicKey = data => ({
	type: UPDATE_PUBLICKEY,
	data: data,
});

export const update_PrivateKey = data => ({
	type: UPDATE_PRIVATEKEY,
	data: data,
});

export const update_isLogin = () => ({
	type: UPDATE_ISLOGIN,
});
