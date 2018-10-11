const fs = require('fs');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const axios = require('axios');
const contractData = require('./contract_build.json');
const accountData = require('./account.json');

const gasApiUrl = 'https://ethgasstation.info/json/ethgasAPI.json';

const getCurrentGasPrices = async () => {
	const response = await axios.get(gasApiUrl)
	return {
		low: response.data.safeLow / 10,
		medium: response.data.average / 10,
		high: response.data.fast / 10
	}
}

const main = async () => {

	const networkId = Object.keys(contractData.networks)[0];

	if (!networkId) {
		console.log('No network in contract data');
		return;
	}

	const privateKey = Buffer.from(accountData.private_key, 'hex');
	const infuraAccessToken = accountData.infura_access_token;
	const account = accountData.address;
	const contractAddress = contractData.networks[networkId].address;
	const abi = contractData.abi;


	const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + infuraAccessToken);
	const web3 = new Web3(provider);


	const contract = new web3.eth.Contract(abi, contractAddress, {
		from: account,
		gasLimit: 3000000,
	});

	const contractFunction = contract.methods.test();
	//const contractFunction = contract.methods.bet();

	const functionAbi = contractFunction.encodeABI();
	const gPrice = await getCurrentGasPrices();

	console.log('Gas price (low): ' + gPrice.low);
	
	let estimatedGas = await contractFunction.estimateGas({ from: account });

	console.log('Estimate gas: ' + estimatedGas);

	let nonce = await web3.eth.getTransactionCount(account);

	console.log('Nonce: ' + nonce);
	const txParams = {
		nonce: '0x' + nonce.toString(16),
		chainId: parseInt(networkId), //not working, when it has type "string"
		gasPrice: '0x' + (gPrice.low * 1000000000).toString(16),
		gasLimit: '0x' + estimatedGas.toString(16),
		from: account,
		to: contractAddress,
		//value: '0x2386f26fc10000',//10000000000000000,
		data: functionAbi
	};

	//contract.methods.isLotteryActive().call().then(v => console.log('Value before increment: ' + v));

	const tx = new Tx(txParams);
	tx.sign(privateKey);

	const serializedTx = tx.serialize();
	web3.eth.sendSignedTransaction(('0x' + serializedTx.toString('hex')), (err, result) => {
		console.log(err, result);
	});

	/*.once('receipt', receipt => {
		console.log('receipt', receipt);
	}).on('confirmation', function(confNumber, receipt){
		console.log('confirmation', confNumber, receipt);
	}).on('error', function(error){
		console.log('error', error);
	}).then(function(receipt){
		console.log('receipt', receipt);
	});*/
}

main();