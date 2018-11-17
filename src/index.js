import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import getWeb3 from './utils/web3/getWeb3';

import App from './App';

// Redux Store
import store from './store';
import './index.css';

const render = () => (
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>
);

getWeb3.then(results => {
	console.log('Web3 initialized!');
	ReactDOM.render(render(), document.getElementById('root'));
}).catch(() => {
	console.log('Error in web3 initialization.');
	ReactDOM.render(render(), document.getElementById('root'));
});


