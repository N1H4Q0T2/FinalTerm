export const UPDATE_IS_SUBMITTING = 'UPDATE_IS_SUBMITTING';

export const updateIsSubmitting = data => {
	return {
		type: UPDATE_IS_SUBMITTING,
		data: data,
	};
};
