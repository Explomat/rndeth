const assert = require('chai').assert; // use Chai Assertion Library
const ganache = require('ganache-cli'); // use ganache-cli with ethereum-bridge for Oraclize
const Web3 = require('web3');
const to = require('./utils/to.js');

const provider = ganache.provider();
const web3 = new Web3(provider);

const Lottery = artifacts.require('Lottery.sol');
const initState = {
	ipfsHash: 'QmQrpE9sfQrKc5RKqu5foxWWiRRycc24nQqc2mBzXk44oB',
	equalBet: web3.toWei('0.1', 'ether'),
	commission: 10, //percent
	contract: {
		value: web3.toWei('0.1', 'ether'),
	}
}

const getAccountBalance = account => {
	return new Promise((resolve, reject) => {
		web3.eth.getBalance(account, (error, result) => {
			if (error) reject(error);
			console.log(result);
			resolve(result);
		});
	});
}

contract('Lottery', accounts => {
	let lottery;

	// use fresh contract for each test
	beforeEach('Setup contract for each test', async function() {
		lottery = await Lottery.new(...Object.values(initState));
	});

	it('transfer for recipient, when many players', async function(){

		this.timeout(1200 * 1000);

		let err, result;

		await lottery.bet({
			from: accounts[0],
			value: web3.toWei('0.1', 'ether')
		});

		await lottery.bet({
			from: accounts[1],
			value: web3.toWei('0.1', 'ether')
		});

		await lottery.bet({
			from: accounts[2],
			value: web3.toWei('0.1', 'ether')
		});

		[err, result] = await to(lottery.invoke({
			from: accounts[0]
		}));

		if (err){
			console.log(err);
			return;
		}

		const eventRandomQueryResult = lottery.event_random_query_result();
		const eventTransfer = lottery.event_transfer();

		let checkForNumber = new Promise((resolve, reject) => {

			eventRandomQueryResult.watch(async function(error, result) {

				if (error) {
					reject(error);
				}

				const bigNumber = await lottery.rndNumber();
				const randomNumber = bigNumber.toNumber();

				console.log(randomNumber);

				eventRandomQueryResult.stopWatching();
				resolve(randomNumber);
			})
		});

		let checkForTransfer = new Promise((resolve, reject) => {

			eventTransfer.watch(async function(error, result) {

				if (error) {
					reject(error);
				}

				resolve(true);
			})
		});

		const randomNumber = await checkForNumber;
		const transfer = await checkForTransfer;

		assert.isAtLeast(randomNumber, 0, 'randomNumber is greater or equal 0');
		assert.isBelow(randomNumber, 3, 'randomNumber is strictly less than 2');
		assert(transfer, 'Not transfered to recipient');
	});

	it('transfer for recipient, when one player', async function(){
		const playerAddress = accounts[0];

		await lottery.bet({
			from: playerAddress,
			value: web3.toWei('0.1', 'ether')
		});

		const result = await lottery.invoke({
			from: playerAddress,
		});

		let testPassed = false;
		for (let i = 0; i < result.logs.length; i++) {
			let log = result.logs[i];
			if (log.event === 'event_transfer' && log.args.t === playerAddress) {
				testPassed = true;
			}
		}

		assert(testPassed, '"event_transfer" event not found');
	});

	// check that it sends a query and receives a response
	it('Different players for one lottery circle', async function() {
		let err;
		// for simplicity, we'll do both checks in this function

		// set this test to timeout after 1 minute
		//this.timeout(60 * 1000);

		await lottery.bet({
			from: accounts[0],
			value: web3.toWei('0.1', 'ether')
		});

		[err] = await to(lottery.bet({
			from: accounts[0],
			value: web3.toWei('0.1', 'ether')
		}));

		[err, playersCount] = await to(lottery.playersCount());
		assert.equal(playersCount, 1, 'Players count must be 1');


		await lottery.bet({
			from: accounts[1],
			value: web3.toWei('0.1', 'ether')
		});

		[err, playersCount] = await to(lottery.playersCount());
		assert.equal(playersCount, 2, 'Players count must be 2');

	});
});