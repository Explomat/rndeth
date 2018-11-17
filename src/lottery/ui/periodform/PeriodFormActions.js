import LotteryDaily from '../../../../build/contracts/LotteryDaily.json';
import LotteryWeekly from '../../../../build/contracts/LotteryWeekly.json';
import LotteryMonthly from '../../../../build/contracts/LotteryMonthly.json';
import constants from './periodConstants';
import { error, info } from '../../appActions';

const contract = require('truffle-contract');
const PRICE_ETH_API_URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&extraParams=rndeth';

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

		fetch(PRICE_ETH_API_URL).then(data => {
			return data.json();
		}).then(data => {
			dispatch({
				type: constants.GET_ETH_PRICE_SUCCESS,
				price: data.USD
			})
		}).catch(err => {
			console.log(err);
			dispatch({
				type: constants.GET_ETH_PRICE_FAILURE,
				err
			})
		});
	}
}

export function getContractData(period){

	return function(dispatch, getState) {

		const state = getState();
		let web3 = state.web3.web3Instance, msg;

		if (typeof web3 !== 'undefined' && web3 !== null) {
			const lottery = getCurrentLotteryContract(period);

			lottery.setProvider(web3.currentProvider);
			var lotteryInstance;

			dispatch({ type: constants.CONTRACT_GET_DATA });


			lottery.deployed().then(instance => {
				lotteryInstance = instance;

				web3.eth.getCoinbase((err, coinbase) => {
					if (err) {
						console.error(err);
						dispatch(error(err));
						return;
					}

					if (!coinbase){
						console.error(err);
						dispatch(error('Coinbase not received. Please select your account in MetaMask'));
						return;
					}

					Promise.all([
						lotteryInstance.isLotteryActive(),
						lotteryInstance.equalBet(),
						lotteryInstance.totalBalance(),
						lotteryInstance.playersCount()
					]).then(([ isLotteryActive, equalBet, totalBalance, playersCount ]) => {

						const toEther = val => web3.fromWei(val).toNumber();

						if (!isLotteryActive){
							msg = 'Betting not allowed now, because the previos lottery draw not yet completed.';
							console.info(msg);
							dispatch(info(msg));
						}
						
						dispatch({
							type: constants.CONTRACT_GET_DATA_SUCCESS,
							period,
							equalBet: toEther(equalBet),
							totalBalance: toEther(totalBalance),
							playersCount: playersCount.toNumber(),
							isLotteryActive
						});
					}).catch(err => {
						console.log(err.stack);
						dispatch(error(err.message));
					});
				});
			}).catch(err => {
				console.log(err.stack);
				dispatch(error(err.message));
			});
		} else {
			msg = 'Web3 is not initialized!';
			console.error(msg);
			dispatch(error(msg));
		}
	}
}

export function bet(period) {

	return function(dispatch, getState) {

		const state = getState();
		let web3 = state.web3.web3Instance, msg;

		if (typeof web3 !== 'undefined' && web3 !== null) {

			const lottery = getCurrentLotteryContract(period);

			lottery.setProvider(web3.currentProvider);
			let lotteryInstance;

			dispatch({ type: constants.CONTRACT_BET });

			lottery.deployed().then(instance => {
				lotteryInstance = instance;

				web3.eth.getCoinbase((err, coinbase) => {

					if (err) {
						console.error(err);
						dispatch(error(err));
						return;
					}

					if (!coinbase){
						console.error(err);
						dispatch(error('Coinbase not received. Please select your account in MetaMask'));
						return;
					}

					lotteryInstance.isPlayerNotReBid(coinbase, {
						from: coinbase
					}).then(isNotReBid => {
						if (!isNotReBid) {
							msg = 'A player can make only one bet.';
							console.info(msg);
							dispatch(info(msg));
							return;
						}

						lotteryInstance.bet({
							from: coinbase,
							value: web3.toWei(state.lottery[period].equalBet)
						}).then(result => {
							dispatch({
								type: constants.CONTRACT_BET_SUCCESS,
								tx: result.tx,
								period
							});
							dispatch(getContractData(period));
						}).catch(err => {
							console.error(err.stack);
							dispatch(error(err.message));
						});
					}).catch(err => {
						console.error(err.stack);
						dispatch(error(err.message));
					});
				});
			}).catch(err => {
				console.error(err.stack);
				dispatch(error(err.message));
			});
		} else {
			msg = 'Web3 is not initialized!';
			console.error(msg);
			dispatch(error(msg));
		}
	}
}
