pragma solidity ^0.4.24;

import './lib/oraclizeAPI.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Lottery is Ownable, usingOraclize {
	
	event event_log(string str);
	event event_log_uint(uint elu);
	event event_random_query_request(string rqreq);
	event event_random_query_result(string rqres);
	event event_transfer(address t);
	event event_error(string e);

	// lottery couner
	uint public counter;

	// next query id
	bytes32 nextQueryId;

	// player bet
	uint public equalBet;

	uint public totalBalance;
	uint public playersCount;

	// lottery percent comission
	uint public commission;

	// generating random number
	uint public rndNumber; 

	// disable players bet when process oraclize request
	bool public isLotteryActive;
	uint constant ORACLIZE_GAS_LIMIT = 300000;

	struct Player {
		address recipient;
		uint value;
	}

	mapping(bytes32 => bool) pendingQueries; //oraclize queries
	mapping(address => uint) playersList; //mapping for counter
	Player[] public players;

	constructor(uint _equalBet, uint _commission) public payable {
		oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);

		counter = 1;
		equalBet = _equalBet;
		commission = _commission;
		isLotteryActive = true;
	}

	function bet() public payable {
		require(msg.value == equalBet);
		require(isLotteryActive, 'Lottery is not active now');
		require(isPlayerNotReBid(msg.sender), 'Only one bet for game');

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
				'URL',
				'json(https://api.random.org/json-rpc/1/invoke).result.random.data.0',
				strConcat('\n{"jsonrpc": "2.0", "method": "generateSignedIntegers", "params": {"apiKey": "11c0c31c-2e26-4b94-943a-702dee93ef88", "n": "1", "min": "0", "max": ', uint2str(playersCount), ', "replacement": "true", "base": "10"}, "id": "14215" }'),
				ORACLIZE_GAS_LIMIT
			);

			nextQueryId = queryId;
			pendingQueries[queryId] = true;
			emit event_random_query_request('Oraclize computation query was request');
		} else if (playersCount == 1){
			players[0].recipient.transfer(totalBalance);
			reset();
			counter++; // increment lottery counter
			emit event_transfer(players[0].recipient);
		}	
	}

	function __callback(bytes32 myid, string result, bytes proof) public {
		require(msg.sender == oraclize_cbAddress(), 'Caller is not Oraclize address!');
        require(pendingQueries[myid], 'Query has already been processed!');

        if (nextQueryId == myid){ // for avoid overlay oraclize queries
        	rndNumber = parseInt(result);
        	emit event_log_uint(rndNumber);
			distributeFunds(rndNumber);
			reset();
			counter++; // increment lottery counter
			delete pendingQueries[myid];
			emit event_random_query_result('Oraclize computation query was received');
        }
	}

	function distributeFunds(uint winningNumber) private {
		Player memory wPlayer = players[winningNumber];
		uint prizeToDistribute = calculateTotalPrize();

		if (wPlayer.recipient != address(0)){
			wPlayer.recipient.transfer(prizeToDistribute);
			emit event_transfer(wPlayer.recipient);
		}
	}

	function calculateTotalPrize() public constant returns (uint){
		uint totalPercent = 100 - commission;
		if (totalPercent >= 0){
			return (totalBalance / 100) * totalPercent;
		}
		return totalBalance;
	}


	function invoke() public onlyOwner {
		require(playersCount > 0, 'Players count must be greater than 0');
		isLotteryActive = false;
		determineWinner();
	}

	function reset() private {
		isLotteryActive = true;
		totalBalance = 0;
		playersCount = 0;
	}

	function changeCommission(uint _commission) public onlyOwner {
		commission = _commission;
	}

	function changeLotteryActive(bool _isLotteryActive) public onlyOwner {
		isLotteryActive = _isLotteryActive;
	}

	function isPlayerNotReBid(address _sender) public view returns (bool) {
		return playersList[_sender] < counter;
	}

	//catch ether
	function() public payable {}
}
