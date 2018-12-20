export const EDITING = 'EDITING';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PUBLICKEY = 'UPDATE_PUBLICKEY';
export const UPDATE_PRIVATEKEY = 'UPDATE_PRIVATEKEY';
export const UPDATE_ISLOGIN = 'UPDATE_ISLOGIN';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const RESET_BALANCE = 'RESET_BALANCE';
export const UPDATE_BANDWIDTH = 'UPDATE_BANDWIDTH';

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

export const update_Balance = data => ({
	type: UPDATE_BALANCE,
	data: data,
});

export const reset_Balance = () => ({
	type: RESET_BALANCE,
});

export const update_Bandwidth = data => ({
	type: UPDATE_BANDWIDTH,
	data: data,
});
