pragma solidity ^0.4.24;

import './lib/oraclizeAPI.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract LotteryDaily is Ownable, usingOraclize {
	using SafeMath for *;

	event event_log(string str);
	event event_log_uint(uint str);
	event event_delay_query_request(string dqrst);
	event event_delay_query_result(string dqrlt);
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

	//For stopping requrcive queries
	bool private isDelayRequestActive;

	// last query id
	bytes32 public nextDelayRecursiveQueryId;

	//
	uint public oraclizeDefaultDelay; // seconds
	uint constant ORACLIZE_GAS_LIMIT = 300000;

	string public _result;
	string public result1;

	enum OraclizeState { Delay, Request }

	struct Player {
		address recipient;
		uint value;
	}

	struct QueryIDs {
		OraclizeState state;
		bool isRevival;
		bool isManual;
		bool isProcessed;
		uint64 dueAt;
		//uint128 gasPriceUsed;
	}

	mapping(bytes32 => QueryIDs) pendingQueries; //oraclize queries
	mapping(address => uint) playersList; //mapping for counter
	Player[] public players;

	constructor(string _ipfsHash, uint _equalBet, uint _commission, uint _delay, bool _isDelayRequestActive) public payable {
		oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        nextDelayRecursiveQueryId = keccak256('Oraclize LotteryDaily');

        counter = 1;
		ipfsHash = _ipfsHash;
		equalBet = _equalBet;
		commission = _commission;
		oraclizeDefaultDelay = _delay;
		isDelayRequestActive = _isDelayRequestActive;
		isLotteryActive = true;

		recursiveDelayRequest(oraclizeDefaultDelay);
	}

	function test() public onlyOwner returns(bool){
		result1 = '1';
		return true;
	}

	function bet() public payable {
		emit event_log_uint(msg.value);
		require(msg.value == equalBet, 'Require 0.01 ether');
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

	function recursiveDelayRequest(uint _delay) private {
		emit event_log('recursiveDelayRequest');
		if (oraclize_getPrice('URL', ORACLIZE_GAS_LIMIT) > address(this).balance) {
			emit event_error('Oraclize delay query was NOT sent, please add some ETH to cover for the query fee');
			return;
		}

		if (isDelayRequestActive == false){
			emit event_error('Lottery is not active');
			return;
		}

		bytes32 queryId = oraclize_query(_delay, 'URL', '', ORACLIZE_GAS_LIMIT);
		pendingQueries[queryId].state = OraclizeState.Delay;
		pendingQueries[queryId].dueAt = uint64(now + _delay);
		nextDelayRecursiveQueryId = queryId;

		emit event_delay_query_request('Oraclize delay query was request');
	}


	function delayRequest(uint _delay, uint _coefficient) public onlyOwner {
		oraclizeDefaultDelay = _delay;
		emit event_log_uint(now);

		if (isRecursiveStale(_delay * _coefficient)) {
			emit event_log('delay request');
			isDelayRequestActive = true;
			recursiveDelayRequest(oraclizeDefaultDelay);
			pendingQueries[nextDelayRecursiveQueryId].isRevival = true;
		} else {
			emit event_log('simple request');
			bytes32 queryId = oraclize_query(_delay, 'URL', '', ORACLIZE_GAS_LIMIT);
			pendingQueries[queryId].isManual = true;
			pendingQueries[queryId].state = OraclizeState.Delay;
			pendingQueries[queryId].dueAt = uint64(now + _delay);
		}
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
			pendingQueries[queryId].state = OraclizeState.Request;
			emit event_random_query_request('Oraclize computation query was request');
			//emit event_random_query(strConcat(uint2str(now), ' Oraclize query was sent');
		} else if (playersCount == 1){
			players[0].recipient.transfer(totalBalance);
			emit event_transfer(players[0].recipient);
			reset();
		}	
	}

	// the callback function is called by Oraclize when the result is ready
	// the oraclize_randomDS_proofVerify modifier prevents an invalid proof to execute this function code:
	// the proof validity is fully verified on-chain
	function __callback(bytes32 myid, string result, bytes proof) public {
		_result = "0";
		require(msg.sender == oraclize_cbAddress(), 'Caller is not Oraclize address!');
        require(!pendingQueries[myid].isProcessed, 'Query has already been processed!');

		QueryIDs memory qi = pendingQueries[myid];
		if (qi.state == OraclizeState.Request){
			emit event_random_query_result('Oraclize computation query was received');
			_result = "1";
			counter++; // increment lottery counter
			rndNumber = parseInt(result);
			distributeFunds(rndNumber);
			reset();
		} else if (qi.state == OraclizeState.Delay){
			emit event_delay_query_result('Oraclize delay query was received');
			_result = "2";
			invoke();
			if (!qi.isManual && nextDelayRecursiveQueryId == myid){
				recursiveDelayRequest(oraclizeDefaultDelay);
				emit event_delay_query_result('Oraclize delay query was received, next query');
				_result = "3";
			}
			_result = "4";
		} else {
			_result = "5";
		}

		pendingQueries[myid].isProcessed = true;
		//delete pendingQueries[myid];
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
			return totalBalance.div(100).mul(totalPercent);
		}
		return totalBalance;
	}


	function invoke() private {
		if (playersCount > 0){
			_result = "6";
			isLotteryActive = false;
			determineWinner();
		}
	}

	function reset() private {
		isLotteryActive = true;
		isDelayRequestActive = true;
		totalBalance = 0;
		playersCount = 0;
	}

	function isRecursiveStale(uint _delay) public view returns (bool) {
		return now > pendingQueries[nextDelayRecursiveQueryId].dueAt + _delay || 
			pendingQueries[nextDelayRecursiveQueryId].isRevival;
	}

	function changeIpfsHash(string _ipfsHash) public onlyOwner {
		ipfsHash = _ipfsHash;
	}

	function changeDelayRequestState(bool _state) public onlyOwner {
		isDelayRequestActive = _state;
	}

	function changeCommission(uint _commission) public onlyOwner {
		commission = _commission;
	}

	function changeDelay(uint _delay) public onlyOwner {
		oraclizeDefaultDelay = _delay;
	}

	//catch ether
	function() public payable {}
}
