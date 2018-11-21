'use strict';

const express = require('express')
	, glob = require('glob')
	, path = require('path')
	, Web3 = require('web3')
	, Tx = require('ethereumjs-tx')
	, axios = require('axios')
	, to = require('./utils/to.js')
	, config = require('./config.json')
	, logger = require('./utils/logger')
	, gasApiUrl = 'https://ethgasstation.info/json/ethgasAPI.json';

const dailyContract = require('./contracts/LotteryDaily.json')
	, weeklyContract = require('./contracts/LotteryWeekly.json')
	, monthlyContract = require('./contracts/LotteryMonthly.json')

const app = express();

const log = new logger({
	infoPath: './logs/info.txt',
	errorPath: './logs/error.txt',
	debugPath: './logs/debug.txt'
});
log.createStreams();

console.log = log.info.bind(log);
console.error = log.error.bind(log);
console.debug = log.debug.bind(log);

const networkTypes = {
	'1': 'mainnet',
	'42': 'kovan',
	'3': 'ropsten',
	'4': 'rinkeby'
}

/*const getContracts = () => {
	return glob.sync('./contracts/*.json').reduce((f, s) => {
		f.push(require(path.resolve(s)));
		return f;
	}, []);
}*/

const getCurrentGasPrices = async () => {
	const response = await axios.get(gasApiUrl);
	return {
		low: response.data.safeLow / 10,
		medium: response.data.average / 10,
		high: response.data.fast / 10
	}
}

const getWeb3 = async url => {
	const provider = new Web3.providers.HttpProvider(url);
	const web3 = await new Web3(provider);
	return web3;
}

const invoke = async c => {
	let web3;

	return new Promise(async (resolve, reject) => {
		const infuraAccessToken = config.infura_access_token;
		const networkId = Object.keys(c.networks)[0];

		if (!networkId) {
			reject(`${c.contractName}: No network in contract data`);
		}

		if (!config.networks[networkId]) {
			reject(`${c.contractName}: No network in config, networkId: ${networkId}`);
		}

		if (networkTypes[networkId]) {
			web3 = await getWeb3(`https://${networkTypes[networkId]}.infura.io/v3/${infuraAccessToken}`);
		} else {
			reject(`${c.contractName}: Incorrect network id`);
		}

		const privateKey = Buffer.from(config.networks[networkId].private_key, 'hex');
		const account = config.networks[networkId].address;
		const contractAddress = c.networks[networkId].address;
		const abi = c.abi;
		const contract = new web3.eth.Contract(abi, contractAddress);

		Promise.all([
			contract.methods.playersCount().call(),
			contract.methods.TIMEOUT().call()
		]).then(async ([ playersCount, timeout ]) => {
			console.log(c.contractName, `playersCount = ${playersCount}`);
			console.log(c.contractName, `timeout = ${timeout}`);

			const [error, events] = await to(
				contract.getPastEvents('event_random_query_result', {
					fromBlock: 0,
					toBlock: 'latest'
				})
			);

			if (error) {
				reject(`${c.contractName}: Events error while received = ${error}`);
			}

			let diffDays = 0;
			const lastEvent = events[events.length - 1];
			if (lastEvent){
				const block = await web3.eth.getBlock(lastEvent.blockHash);
				if (block) {
					const blockDate = new Date(block.timestamp * 1000);
					const diffSeconds = Math.round(Math.abs(new Date() - blockDate) / 1000);
					diffDays = Math.ceil(diffSeconds / (24 * 60 * 60));
				}
			}

			console.log(c.contractName, `diffDays = ${diffDays}`);

			if (parseInt(playersCount, 10) > 0 && 
				(diffDays >= parseInt(timeout, 10) || diffDays === 0)
			) {
				const contractFunction = contract.methods.invoke();

				const functionAbi = contractFunction.encodeABI();
				const gPrice = await getCurrentGasPrices();

				console.log(c.contractName, `Gas price (low) = ${gPrice.low}`);
				
				let estimatedGas = await contractFunction.estimateGas({ from: account });

				console.log(c.contractName, `Estimate gas = ${estimatedGas}`);

				let nonce = await web3.eth.getTransactionCount(account);

				const txParams = {
					nonce: '0x' + nonce.toString(16),
					chainId: parseInt(networkId, 10), //not working, when type is "string"
					gasPrice: '0x' + (gPrice.low * 1000000000).toString(16),
					gasLimit: '0x' + Math.floor(estimatedGas).toString(16),
					from: account,
					to: contractAddress,
					data: functionAbi
				};

				const tx = new Tx(txParams);
				tx.sign(privateKey);

				const serializedTx = tx.serialize();
				web3.eth.sendSignedTransaction(('0x' + serializedTx.toString('hex')), (err, result) => {
					if (err) {
						reject(`${c.contractName}: ${err}`);
					} else {
						console.log(c.contractName, result);
						resolve();
					}
				});
			} else {
				console.log(c.contractName, 'Impossible make transaction, conditions not done');
				resolve();
			}
		}).catch(e => {
			reject(`${c.contractName}: ${e}`);
		});
	});
}

app.get('/daily', (req, res) => {
	invoke(dailyContract)
		.then(() => {
			res.status(200).end();
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

app.get('/weekly', (req, res) => {
	invoke(weeklyContract)
		.then(() => {
			res.status(200).end();
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

app.get('/monthly', (req, res) => {
	invoke(monthlyContract)
		.then(() => {
			res.status(200).end();
		})
		.catch(err => {
			console.error(err);
			res.status(500).end();
		});
});

const server = app.listen(process.env.PORT || 3001, () => {
	const port = server.address().port;
	console.log(`Invoke app listening on port ${port}`);
});

module.exports = app;