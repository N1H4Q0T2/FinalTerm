export const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const SUBMIT_TRANSFER = 'SUBMIT_TRANSFER';
export const UPDATE_SUBMITSUCCESS = 'UPDATE_SUBMITSUCCESS';

export const updateAmount = input => ({
	type: UPDATE_AMOUNT,
	data: input,
});

export const updateAddress = input => ({
	type: UPDATE_ADDRESS,
	data: input,
});

export const submitTransfer = () => ({
	type: SUBMIT_TRANSFER,
});

export const updateSubmitSuccess = input => ({
	type: UPDATE_SUBMITSUCCESS,
	data: input,
});
