pragma solidity ^0.4.24;

import './Lottery.sol';

contract LotteryMonthly is Lottery {

	uint public constant TIMEOUT = 30; // timeout for 30 days

	constructor(uint _equalBet, uint _commission)
	Lottery(_equalBet, _commission)
	public
	payable {}
}