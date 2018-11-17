
const initialState = {
	web3Instance: null,
	networkId: null
}

const web3Reducer = (state = initialState, action) => {
	if (action.type === 'WEB3_INITIALIZED') {
		return Object.assign({}, state, {
			...action.payload
		})
	}

	return state
}

export default web3Reducer
