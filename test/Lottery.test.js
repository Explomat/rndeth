const assert = require('chai').assert; // use Chai Assertion Library
const ganache = require('ganache-cli'); // use ganache-cli with ethereum-bridge for Oraclize
const Web3 = require('web3');
const to = require('./utils/to.js');

const provider = ganache.provider();
const web3 = new Web3(provider);

const Lottery = artifacts.require('Lottery.sol');
const initState = {
	ipfsHash: 'QmQrpE9sfQrKc5RKqu5foxWWiRRycc24nQqc2mBzXk44oB',
	equalBet: 10000000000000000, //in wei == 0.01 ether
	commission: 10, //percent
	contract: {
		value: 100000000000000000
	}
}


// Define tests
contract('Lottery', accounts => {
	let lottery;

	// use fresh contract for each test
	beforeEach('Setup contract for each test', async function() {
		lottery = await Lottery.new(...Object.values(initState));
	})

	// check that it sends a query and receives a response
	it('sends a delay query and receives a response', async function() {
		let err;
		// for simplicity, we'll do both checks in this function

		// set this test to timeout after 1 minute
		//this.timeout(60 * 1000);

		[err] = await to(lottery.bet({
			from: accounts[0],
			value: 10000000000000000,
			gas: 3000000,
		}));
		if (err) { console.log(err); return; }
		

		[err] = await to(lottery.invoke({
			from: accounts[0]
		}));
		if (err) { console.log(err); return; }

		[err] =  await to(lottery.bet({
			from: accounts[0],
			value: 10000000000000000,
			gas: 3000000,
		}));
		if (err) { console.log(err); return; }

		/*const result = await lottery.delayRequest(0, 0, {
			from: accounts[0]
		});

		let testPassed = false // variable to hold status of result
		for (let i = 0; i < result.logs.length; i++) {
			let log = result.logs[i]
			if (log.event === 'event_delay_query_request') {
				// we found the event
				testPassed = true
			}
		}
		assert.equal(testPassed, false);*/

		//assert(testPassed, '"event_delay_query_request" event not found');
/*
		const event_delay_query_result = lottery.event_delay_query_result();

		// create promise so Mocha waits for value to be returned
		let checkForRequest = new Promise((resolve, reject) => {
			// watch for our LogResultReceived event
			event_delay_query_result.watch(async function(error, result) {
				if (error) {
					reject(error);
				}
				event_delay_query_result.stopWatching();
				resolve(true);
				//resolve(randomNumber);
			}) // end LogResultReceived.watch()
		}) // end new Promise

		const resultRequest = await checkForRequest;

		assert.equal(resultRequest, true);*/


		// Method 1 to check for events: loop through the "result" variable

		// look for the LogOraclizeQuery event to make sure query sent
		/*let testPassed = false // variable to hold status of result
		for (let i = 0; i < result.logs.length; i++) {
			let log = result.logs[i]
			if (log.event === 'event_delay_query_request') {
				// we found the event
				testPassed = true
			}
		}
		assert(testPassed, '"event_delay_query_request" event not found');*/


		// call promise and wait for result
		// ensure result is within our query's min/max values
		/*assert.isAtLeast(randomNumber, 1, 'Random number was less than 1');
		assert.isAtMost(randomNumber, 1000, 'Random number was greater than 1000');*/

	});

	/*it('determineWinner not calling while players count is 0', async function() {
		this.timeout(60 * 1000);
		await lottery.delayRequest(0, 0, {
			from: accounts[0]
		});

		const isLotteryActive = await lottery.isLotteryActive();
		assert.equal(isLotteryActive, false);
	});*/
});