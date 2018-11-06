pragma solidity ^0.4.24;

import './Lottery.sol';

contract LotteryDaily is Lottery {

	uint public constant TIMEOUT = 1; // timeout for 1 day

	constructor(uint _equalBet, uint _commission)
	Lottery(_equalBet, _commission)
	public
	payable {}
}