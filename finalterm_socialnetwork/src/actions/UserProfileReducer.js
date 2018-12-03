export const EDITING = 'EDITING';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const isEditing = () => ({
	type: EDITING,
});

export const updateProfile = data => ({
	type: UPDATE_PROFILE,
	data: data,
});
