var LotteryDaily = artifacts.require('LotteryDaily.sol');
var LotteryWeekly = artifacts.require('LotteryWeekly.sol');
var LotteryMonthly = artifacts.require('LotteryMonthly.sol');
//var SafeMath = artifacts.require('openzeppelin-solidity/contracts/math/SafeMath.sol');

const ipfsHash = 'QmQrpE9sfQrKc5RKqu5foxWWiRRycc24nQqc2mBzXk44oB';

module.exports = function(deployer) {
	//console.log('-----------------------0----------------------');
	deployer.deploy(LotteryDaily,
		ipfsHash,
		web3.toWei('0.1', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);

	//console.log('-----------------------1----------------------');
	deployer.deploy(LotteryWeekly,
		ipfsHash,
		web3.toWei('0.5', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);

	//console.log('-----------------------2----------------------');
	deployer.deploy(LotteryMonthly,
		ipfsHash,
		web3.toWei('1', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);
};
