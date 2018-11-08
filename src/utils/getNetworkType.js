const networks = {
	'1': 'mainnet',
	'3': 'ropsten',
	'4': 'rinkeby',
	'42': 'kovan'
}

const getNetworkType = id => {
	return (networks[id] || 'unknown');
}

export default getNetworkType;