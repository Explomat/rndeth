import store from '../../store';
import Web3 from 'web3';
import { error } from '../../lottery/appActions';

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED';

function web3Initialized(results) {
	return {
		type: WEB3_INITIALIZED,
		payload: results
	}
}

let getWeb3 = new Promise(function(resolve, reject) {
	// Wait for loading completion to avoid race conditions with web3 injection timing.
	window.addEventListener('load', function(dispatch) {
		let results;
		let web3 = window.web3;

		// Checking if Web3 has been injected by the browser (Mist/MetaMask)
		if (typeof web3 !== 'undefined') {
			// Use Mist/MetaMask's provider.
			web3 = new Web3(web3.currentProvider);

			web3.version.getNetwork(function(err, result) {
				if (err){
					console.log('Web3 is not connected to MetaMask');
					reject(store.dispatch(error(err.message)));
					return;
				}

				results = {
					web3Instance: web3,
					networkId: result
				}

				console.log('Injected web3 detected.');

				resolve(store.dispatch(web3Initialized(results)));

			});
		} else {
			const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
			web3 = new Web3(provider);

			web3.version.getNetwork(function(err, result) {
				if (err){
					console.log('Web3 is not connected to localhost');
					reject(store.dispatch(error(err.message)));
					return;
				}

				results = {
					web3Instance: web3,
					networkId: result
				}

				console.log('No web3 instance injected, using Local web3.');

				resolve(store.dispatch(web3Initialized(results)));
			});
		}
	})
})

export default getWeb3;
