pragma solidity ^0.4.24;

import './Lottery.sol';

contract LotteryWeek is Lottery {

	uint public constant TIMEOUT = 360;//24 * 60 * 60 * 7; //timeout in seconds

	constructor(string _ipfsHash, uint _equalBet, uint _commission)
	Lottery(_ipfsHash, _equalBet, _commission)
	public
	payable {}
}