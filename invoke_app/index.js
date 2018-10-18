const glob = require('glob')
	, path = require('path')
	, Web3 = require('web3')
	, Tx = require('ethereumjs-tx')
	, axios = require('axios')
	, to = require('./utils/to.js')
	, accountData = require('./config.json')
	, logger = require('./utils/logger')
	, gasApiUrl = 'https://ethgasstation.info/json/ethgasAPI.json';


const log = new logger({
	infoPath: './logs/info.txt',
	errorPath: './logs/error.txt',
	debugPath: './logs/debug.txt'
});
log.createStreams();

console.log = log.info.bind(log);
console.error = log.error.bind(log);
console.debug = log.debug.bind(log);

const getContracts = () => {
	const c = [];
	glob.sync('./contracts/*.json').forEach(file => {
		c.push(require(path.resolve(file)));
	});
	return c;
}

const getCurrentGasPrices = async () => {
	const response = await axios.get(gasApiUrl)
	return {
		low: response.data.safeLow / 10,
		medium: response.data.average / 10,
		high: response.data.fast / 10
	}
}

const privateKey = Buffer.from(accountData.private_key, 'hex');
const infuraAccessToken = accountData.infura_access_token;
const account = accountData.address;
const contracts = getContracts();

const providerUrl =
	process.env.NODE_ENV === 'development' ?
		'http://localhost:8545' :
		'https://rinkeby.infura.io/v3/' + infuraAccessToken;
const provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(provider);

contracts.forEach(c => {
	const networkId = Object.keys(c.networks)[0];

	if (!networkId) {
		console.error(c.contractName, 'No network in contract data');
		return;
	}

	const contractAddress = c.networks[networkId].address;
	const abi = c.abi;
	const contract = new web3.eth.Contract(abi, contractAddress);

	Promise.all([
		contract.methods.isLotteryActive().call(),
		contract.methods.playersCount().call(),
		contract.methods.TIMEOUT().call()
	]).then(async ([ isLotteryActive, playersCount, timeout ]) => {
		console.log(c.contractName, `isLotteryActive = ${isLotteryActive}`);
		console.log(c.contractName, `playersCount = ${playersCount}`);
		console.log(c.contractName, `timeout = ${timeout}`);

		const [error, events] = await to(
			contract.getPastEvents('event_random_query_result', {
				//filter: { rqres: 'Oraclize computation query was received' },
				fromBlock: 0,
				toBlock: 'latest'
			})
		);

		if (error) {
			console.error(c.contractName, `Events error while received = ${error}`);
			return;
		}

		let diffDates = 0;
		const lastEvent = events[events.length - 1];
		//console.debug(c.contractName, 'lastEvent:' + JSON.stringify(lastEvent));
		if (lastEvent){
			const block = await web3.eth.getBlock(lastEvent.blockHash);
			if (block) {
				const blockDate = new Date(block.timestamp * 1000);
				diffDates = Math.round(Math.abs(new Date() - blockDate) / 1000);
			}
		}

		console.log(c.contractName, `diffDates = ${diffDates}`);

		if (
			isLotteryActive && 
			playersCount > 0 && 
			((diffDates + (30 * 60)) >= timeout || diffDates === 0)){
			const contractFunction = contract.methods.invoke();
			//const contractFunction = contract.methods.bet();

			const functionAbi = contractFunction.encodeABI();
			const gPrice = await getCurrentGasPrices();

			console.log(c.contractName, 'Gas price (low) = ' + gPrice.low);
			
			let estimatedGas = await contractFunction.estimateGas({ from: account });

			console.log(c.contractName, 'Estimate gas = ' + estimatedGas);

			let nonce = await web3.eth.getTransactionCount(account);

			console.log(c.contractName, 'Nonce = ' + nonce);
			const txParams = {
				nonce: '0x' + nonce.toString(16),
				chainId: parseInt(networkId, 10), //not working, when it has type "string"
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
				if (err)console.error(c.contractName, err);
				else console.log(c.contractName, result);
			});
		} else {
			console.error(c.contractName, 'Impossible make transaction, conditions not done');
		}
	});
});