var LotteryDaily = artifacts.require('LotteryDaily.sol');
var LotteryWeekly = artifacts.require('LotteryWeekly.sol');
var LotteryMonthly = artifacts.require('LotteryMonthly.sol');

module.exports = function(deployer) {
	LotteryDaily.synchronization_timeout = 3600;

	deployer.deploy(LotteryDaily,
		web3.toWei('0.1', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);

	LotteryWeekly.synchronization_timeout = 3600;
	deployer.deploy(LotteryWeekly,
		web3.toWei('0.5', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);

	LotteryMonthly.synchronization_timeout = 3600;
	deployer.deploy(LotteryMonthly,
		web3.toWei('1', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);
};
