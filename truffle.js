var HDWalletProvider = require('truffle-hdwallet-provider');
var rbmnemonic = 'motion ask village spend meat mansion expect suit amused damage attend mention';
var rnmnemonic = 'custom cancel blossom soda stereo setup yellow stamp ranch rather ghost leader';

module.exports = {
	networks: {
		development: {
			host: 'localhost',
			port: 8545,
			network_id: '*' // Match any network id
		},
		ropsten: {
			network_id: '3',
			provider: function() {
				return new HDWalletProvider(rnmnemonic, 'https://ropsten.infura.io/v3/5ab4dd7c7baa4882a9fdb1b8ea6a37b2')
			},
			gas: 5000000,
			gasPrice: 21000000000
			//from: '0xc06e80c58386e071b8c19b833ab40267a51d007d'
		},
		rinkeby: {
			network_id: '4',
			provider: function() {
				return new HDWalletProvider(rbmnemonic, 'https://rinkeby.infura.io/v3/5ab4dd7c7baa4882a9fdb1b8ea6a37b2')
			},
			gas: 5000000,
			gasPrice: 21000000000
			//from: '0xc06e80c58386e071b8c19b833ab40267a51d007d'
		}

	},
	solc: {
		optimizer: {
			enabled: true,
			runs: 200
		}
	},
};
// /home/explomat/.ethereum/testnet/geth/chaindata
//geth --fast --cache=1048 --testnet --unlock '0xc06e80c58386e071b8c19b833ab40267a51d007d' --rpc --rpcapi 'eth,net,web3,personal' --rpccorsdomain '*' --rpcaddr localhost --rpcport 8545

//geth --syncmode 'fast' --cache=2048 --testnet --unlock '0xc06e80c58386e071b8c19b833ab40267a51d007d' --password '/home/explomat/ropsten_pk' --rpc --rpcapi 'eth,net,web3,personal' --rpccorsdomain '*' --rpcaddr localhost --rpcport 8545
