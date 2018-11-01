pragma solidity ^0.4.24;

import './Lottery.sol';

contract LotteryDaily is Lottery {

	uint public constant TIMEOUT = 1; // timeout for 1 day

	constructor(string _ipfsHash, uint _equalBet, uint _commission)
	Lottery(_ipfsHash, _equalBet, _commission)
	public
	payable {}
}