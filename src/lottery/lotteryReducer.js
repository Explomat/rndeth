import constants from './ui/periodform/periodConstants';
import { commonConstants } from './appActions';

const appStateReducer = (state = {
	ethPrice: null,
	error: null
}, action) => {

	switch(action.type) {
		case constants.GET_ETH_PRICE_SUCCESS: {
			return {
				...state,
				ethPrice: action.price
			}
		}

		case commonConstants.APP_ERROR_MESSAGE: {
			return {
				...state,
				error: action.errorMessage
			}
		}

		default: return state;
	}
}

const contractReducer = (state = {
	equalBet: 0,
	totalBalance: 0,
	playersCount: 0,
	tx: null
}, action) => {

	switch(action.type) {
		case constants.CONTRACT_GET_DATA_SUCCESS: {
			const { equalBet, totalBalance, playersCount } = action;
			return {
				...state,
				equalBet,
				totalBalance,
				playersCount
			}
		}

		case constants.CONTRACT_BET_SUCCESS: {
			const { tx } = action;
			return {
				...state,
				tx
			}
		}

		default: return state;
	}
}

const lotteryReducer = (state = {
	daily: {},
	weekly: {},
	monthly: {},
	appState: {}
}, action) => {

	const { type } = action;

	if (type.indexOf('@@redux') !== -1) {
		return {
			daily: contractReducer(undefined, action),
			weekly: contractReducer(undefined, action),
			monthly: contractReducer(undefined, action),
			appState: appStateReducer(undefined, action)
		}
	}

	switch(type) {

		case constants.GET_ETH_PRICE_SUCCESS:
		case commonConstants.APP_ERROR_MESSAGE: {
			return {
				...state,
				appState: appStateReducer(state.appState, action)
			}
		}

		case constants.CONTRACT_GET_DATA_SUCCESS:
		case constants.CONTRACT_BET_SUCCESS: {
			return {
				...state,
				[action.period]: contractReducer(state[action.period], action)
			}
		}

		default: return state;
	}
}

export default lotteryReducer;
