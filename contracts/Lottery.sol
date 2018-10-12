pragma solidity ^0.4.24;

import './lib/oraclizeAPI.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Lottery is Ownable, usingOraclize {
	
	event event_log(string str);
	event event_log_uint(uint str);
	event event_random_query_request(string rqreq);
	event event_random_query_result(string rqres);
	event event_transfer(address t);
	event event_error(string e);

	uint public counter;

	//player bet
	uint public equalBet;

	uint public totalBalance;
	uint public playersCount;

	//lottery percent comission
	uint public commission;

	//generating random number
	uint public rndNumber; 

	//ipfs hash
	string public ipfsHash;

	// disable players bet when process oraclize request
	// If callback never executed, we will invoke determineWinner() on next step
	bool public isLotteryActive;
	uint constant ORACLIZE_GAS_LIMIT = 300000;

	string public _result;

	struct Player {
		address recipient;
		uint value;
	}

	mapping(bytes32 => bool) pendingQueries; //oraclize queries
	mapping(address => uint) playersList; //mapping for counter
	Player[] public players;

	constructor(string _ipfsHash, uint _equalBet, uint _commission) public payable {
		oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);

		counter = 1;
		ipfsHash = _ipfsHash;
		equalBet = _equalBet;
		commission = _commission;
		isLotteryActive = true;
	}

	function bet() public payable {
		emit event_log_uint(msg.value);
		require(msg.value == equalBet);
		require(isLotteryActive, 'Lottery is not active now');
		require(playersList[msg.sender] < counter, 'Only one bet for game');

		Player memory newPlayer = Player({
			recipient: msg.sender,
			value: msg.value
		});
		players.length = playersCount + 1;

		playersList[msg.sender] = counter;
		players[playersCount++] = newPlayer;
		totalBalance += msg.value;
	}
	
	function determineWinner() private {
		if (playersCount > 1){
			if (oraclize_getPrice('computation', ORACLIZE_GAS_LIMIT) > address(this).balance) {
				emit event_error('Oraclize computation query was NOT sent, please add some ETH to cover for the query fee');
				return;
			}

			bytes32 queryId = oraclize_query( 
				'computation', 
				[
					strConcat('json(', ipfsHash, ').result.random.data.0'),
					'1',
					'0',
					uint2str(playersCount)
				], 
				ORACLIZE_GAS_LIMIT
			);

			pendingQueries[queryId] = true;
			emit event_random_query_request('Oraclize computation query was request');
		} else if (playersCount == 1){
			players[0].recipient.transfer(totalBalance);
			reset();
			counter++; // increment lottery counter
			emit event_transfer(players[0].recipient);
		}	
	}

	// the callback function is called by Oraclize when the result is ready
	// the oraclize_randomDS_proofVerify modifier prevents an invalid proof to execute this function code:
	// the proof validity is fully verified on-chain
	function __callback(bytes32 myid, string result, bytes proof) public {
		_result = "0";
		require(msg.sender == oraclize_cbAddress(), 'Caller is not Oraclize address!');
        require(pendingQueries[myid], 'Query has already been processed!');

		emit event_random_query_result('Oraclize computation query was received');
		rndNumber = parseInt(result);
		distributeFunds(rndNumber);
		reset();
		counter++; // increment lottery counter
		delete pendingQueries[myid];
	}

	function distributeFunds(uint winningNumber) private {
		Player memory wPlayer = players[winningNumber];
		uint prizeToDistribute = calculateTotalPrize();

		if (wPlayer.recipient != address(0)){
			wPlayer.recipient.transfer(prizeToDistribute);
			emit event_transfer(wPlayer.recipient);
		}
	}

	function calculateTotalPrize() public constant returns (uint256){
		uint totalPercent = 100 - commission;
		if (totalPercent >= 0){
			return (totalBalance / 100) * totalPercent;
		}
		return totalBalance;
	}


	function invoke() public onlyOwner {
		if (playersCount > 0){
			_result = "6";
			isLotteryActive = false;
			determineWinner();
		}
	}

	function reset() private {
		isLotteryActive = true;
		totalBalance = 0;
		playersCount = 0;
	}

	function changeIpfsHash(string _ipfsHash) public onlyOwner {
		ipfsHash = _ipfsHash;
	}

	function changeCommission(uint _commission) public onlyOwner {
		commission = _commission;
	}

	//catch ether
	function() public payable {}
}
