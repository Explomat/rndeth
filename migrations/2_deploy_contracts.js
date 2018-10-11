//var Ownable = artifacts.require("openzeppelin-solidity/contracts/ownership/Ownable.sol");
//var Destructible = artifacts.require("openzeppelin-solidity/contracts/lifecycle/Destructible.sol");
//var Oraclize = artifacts.require("./lib/usingOraclize");
//var Authentication = artifacts.require("./Authentication.sol");
//var Casino = artifacts.require("./Casino.sol");
var LotteryDaily = artifacts.require('LotteryDaily.sol');
var SafeMath = artifacts.require('openzeppelin-solidity/contracts/math/SafeMath.sol');

module.exports = function(deployer) {
	deployer.deploy(SafeMath);
	deployer.link(SafeMath, LotteryDaily);
	deployer.deploy(LotteryDaily,
		'QmQrpE9sfQrKc5RKqu5foxWWiRRycc24nQqc2mBzXk44oB',
		10000000000000000, //in wei == 0.01 ether
		10, //percent
		300, //delay
		false,
		{
			value: 100000000000000000
		}
	);
	//deployer.deploy(LotteryDaily);
};
