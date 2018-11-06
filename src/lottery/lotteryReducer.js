import constants from './ui/periodform/periodConstants';
import { commonConstants } from './appActions';

const initialState = {
	domain: {
		equalBet: 0,
		totalBalance: 0,
		playersCount: 0
	},
	appState: {
		ethPrice: null,
		daily: {
			tx: null
		},
		weekly: {
			tx: null
		},
		monthly: {
			tx: null
		}
	},
	ui: {
		error: null
	}
}

const lotteryReducer = (state = initialState, action) => {

	const { type, ...props } = action;

	if (type === constants.GET_ETH_PRICE_SUCCESS) {
		return {
			...state,
			appState: {
				...state.appState,
				ethPrice: action.price
			}
		}
	}

	if (type === constants.CONTRACT_GET_DATA_SUCCESS) {
		return {
			...state,
			domain: {
				...props
			}
		}
	}

	if (type === constants.CONTRACT_BET_SUCCESS) {
		return {
			...state,
			appState: {
				...state.appState,
				[action.period.toLowerCase()]: {
					tx: props.tx
				}
			}
		}
	}

	if (type === commonConstants.APP_ERROR_MESSAGE) {
		return {
			...state,
			ui: {
				error: props.errorMessage
			}
		}
	}
	return state;
}

export default lotteryReducer;
