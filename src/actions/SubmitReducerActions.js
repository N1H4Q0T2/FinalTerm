export const UPDATE_IS_SUBMITTING = 'UPDATE_IS_SUBMITTING';
export const UPDATE_POST_AND_TRANSFER_SUCCESS =
	'UPDATE_POST_AND_TRANSFER_SUCCESS';
export const UPDATE_FOLLOW_SUCCESS = 'UPDATE_FOLLOW_SUCCESS';

export const updateIsSubmitting = data => {
	return {
		type: UPDATE_IS_SUBMITTING,
		data: data,
	};
};

export const updatePostAndTransferSuccess = data => {
	return {
		type: UPDATE_POST_AND_TRANSFER_SUCCESS,
		data: data,
	};
};

export const updateFollowSuccess = data => {
	return {
		type: UPDATE_FOLLOW_SUCCESS,
		data: data,
	};
};

