pragma solidity ^0.4.24;

import './Lottery.sol';

contract LotteryMonth is Lottery {

	uint public constant TIMEOUT = 540; //24 * 60 * 60 * 7 * 30; //timeout in seconds

	constructor(string _ipfsHash, uint _equalBet, uint _commission)
	Lottery(_ipfsHash, _equalBet, _commission)
	public
	payable {}
}