var LotteryDaily = artifacts.require('LotteryDaily.sol');
var LotteryWeek = artifacts.require('LotteryWeek.sol');
var LotteryMonth = artifacts.require('LotteryMonth.sol');
//var SafeMath = artifacts.require('openzeppelin-solidity/contracts/math/SafeMath.sol');

const ipfsHash = 'QmQrpE9sfQrKc5RKqu5foxWWiRRycc24nQqc2mBzXk44oB';

//console.log(artifacts);
//console.log(web3);

module.exports = function(deployer) {
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

	deployer.deploy(LotteryWeek,
		ipfsHash,
		web3.toWei('0.5', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);

	deployer.deploy(LotteryMonth,
		ipfsHash,
		web3.toWei('1', 'ether'),
		10, //commission percent
		{
			value: web3.toWei('0.1', 'ether'),
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);


	/*deployer.deploy(SafeMath);
	deployer.link(SafeMath, Lottery);
	deployer.deploy(Lottery,
		ipfsHash,
		10000000000000000, //in wei == 0.01 ether
		10, //percent
		{
			value: 100000000000000000,
			gasLimit: 3500000,
			gasPrice: 10000000000
		}
	);*/
};
