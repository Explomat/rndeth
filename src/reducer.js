import { combineReducers } from 'redux';
import lotteryReducer from './lottery/lotteryReducer';
import web3Reducer from './utils/web3/web3Reducer';

const reducer = combineReducers({
	lottery: lotteryReducer,
	web3: web3Reducer
})

export default reducer;
