pragma solidity ^0.4.24;

import './Lottery.sol';

contract LotteryWeekly is Lottery {

	uint public constant TIMEOUT = 7; // timeout for 7 day

	constructor(string _ipfsHash, uint _equalBet, uint _commission)
	Lottery(_ipfsHash, _equalBet, _commission)
	public
	payable {}
}