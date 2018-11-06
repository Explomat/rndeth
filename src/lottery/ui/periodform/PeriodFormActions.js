import LotteryDaily from '../../../../build/contracts/LotteryDaily.json';
import LotteryWeekly from '../../../../build/contracts/LotteryWeekly.json';
import LotteryMonthly from '../../../../build/contracts/LotteryMonthly.json';
import constants from './periodConstants';
import { error } from '../../appActions';

const contract = require('truffle-contract');

const getCurrentLotteryContract = period => {
	period = (period || '').toLowerCase();

	return contract(
		period === 'daily' ? LotteryDaily :
		period === 'weekly' ? LotteryWeekly :
		LotteryMonthly
	);
}

export function getETHPrice(){
	return function(dispatch) {
		dispatch({ type: constants.GET_ETH_PRICE });

		fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&extraParams=rndeth')
		.then(data => {
			return data.json();
		})
		.then(data => {
			dispatch({
				type: constants.GET_ETH_PRICE_SUCCESS,
				price: data.USD
			})
		})
		.catch(error => {
			dispatch({
				type: constants.GET_ETH_PRICE_FAILURE,
				error
			})
		});
	}
}

export function getContractData(period){

	return function(dispatch, getState) {

		let web3 = getState().web3.web3Instance;

		if (typeof web3 !== 'undefined') {
			const lottery = getCurrentLotteryContract(period);

			lottery.setProvider(web3.currentProvider);
			var lotteryInstance;

			dispatch({ type: constants.CONTRACT_GET_DATA });

			web3.eth.getCoinbase((err, coinbase) => {

				if (err) {
					dispatch(error(err));
					return;
				}

				lottery.deployed().then(function(instance) {
					lotteryInstance = instance;

					Promise.all([
						lotteryInstance.equalBet(),
						lotteryInstance.totalBalance(),
						lotteryInstance.playersCount()
					]).then(([ equalBet, totalBalance, playersCount ]) => {

						const toEther = val => web3.fromWei(val.toNumber());
						dispatch({
							type: constants.CONTRACT_GET_DATA_SUCCESS,
							equalBet: toEther(equalBet),
							totalBalance: toEther(totalBalance),
							playersCount: playersCount.toNumber()
						});
					}).catch(err => {
						dispatch(error(err.message));
					});
				}).catch(err => {
					dispatch(error(err.message));
				});
			});
		} else {
			dispatch(error('Web3 is not initialized!'));
		}
	}
}

export function bet(period) {

	return function(dispatch, getState) {

		if (typeof web3 !== 'undefined') {
			const state = getState();
			let web3 = state.web3.web3Instance;

			const lottery = getCurrentLotteryContract(period);

			lottery.setProvider(web3.currentProvider);
			var lotteryInstance;

			dispatch({ type: constants.CONTRACT_BET });

			web3.eth.getCoinbase((err, coinbase) => {

				if (err) {
					dispatch(error(err));
					return;
				}

				lottery.deployed().then(function(instance) {
					lotteryInstance = instance;

					lotteryInstance.bet({
						from: coinbase,
						value: web3.toWei(state.lottery.domain.equalBet)
					}).then(function(result) {
						dispatch({
							type: constants.CONTRACT_BET_SUCCESS,
							tx: result.tx,
							period
						});
						dispatch(getContractData(period));
					}).catch(function(err) {
						dispatch(error(err.message));
					});
				}).catch(err => {
					dispatch(error(err.message));
				});
			});
		} else {
			dispatch(error('Web3 is not initialized!'));
		}
	}
}
