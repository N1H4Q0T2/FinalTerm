const inititalState = {
	data: '123',
};

const TestReducer = (state = inititalState, action) => {
	switch (action.type) {
	case 'TESTING': {
		return {
			...state,
			data: action.data,
		};
	}
	default:
		return state;
	}
};

export default TestReducer;