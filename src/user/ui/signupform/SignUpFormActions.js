import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import LotteryDaily from '../../../../build/contracts/LotteryDaily.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../../../store'

const contract = require('truffle-contract')

export function test(number) {
	let web3 = store.getState().web3.web3Instance

	// Double-check web3's status.
	if (typeof web3 !== 'undefined') {

		return function(dispatch) {
			// Using truffle-contract we create the authentication object.
			const lottery = contract(LotteryDaily)
			lottery.setProvider(web3.currentProvider)

			// Declaring this for later so we can chain functions on Authentication.
			var lotteryInstance

			// Get current ethereum wallet.
			web3.eth.getCoinbase((error, coinbase) => {
				// Log errors, if any.
				if (error) {
					console.error(error);
				}

				lottery.deployed().then(function(instance) {
					lotteryInstance = instance;

					/*lotteryInstance.test({from: coinbase}).then(result => {
						console.log(result);
					}).catch(e => {
						console.log(e);
					})*/

					// Attempt to sign up user.
					lotteryInstance.bet({from: coinbase, value: 10000000000000000 }) 
					.then(function(result) {
						// If no error, login user.
						//return dispatch(loginUser())
						console.log(`has bet ${number}`);
					})
					.catch(function(error) {
						console.log(error);
					});
				})
			})
		}
	} else {
		console.error('Web3 is not initialized.');
	}
}

export function signUpUser(name) {
	let web3 = store.getState().web3.web3Instance

	// Double-check web3's status.
	if (typeof web3 !== 'undefined') {

		return function(dispatch) {
			// Using truffle-contract we create the authentication object.
			const authentication = contract(AuthenticationContract)
			authentication.setProvider(web3.currentProvider)

			// Declaring this for later so we can chain functions on Authentication.
			var authenticationInstance

			// Get current ethereum wallet.
			web3.eth.getCoinbase((error, coinbase) => {
				// Log errors, if any.
				if (error) {
					console.error(error);
				}

				authentication.deployed().then(function(instance) {
					authenticationInstance = instance

					// Attempt to sign up user.
					authenticationInstance.signup(name, {from: coinbase})
					.then(function(result) {
						// If no error, login user.
						return dispatch(loginUser())
					})
					.catch(function(result) {
						// If error...
					})
				})
			})
		}
	} else {
		console.error('Web3 is not initialized.');
	}
}
