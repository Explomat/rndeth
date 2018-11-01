import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
//import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
//import { syncHistoryWithStore } from 'react-router-redux'
//import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'
import getWeb3 from './utils/web3/getWeb3';

// Layouts
import App from './App';
/*import Home from './layouts/home/Home';
import Dashboard from './layouts/dashboard/Dashboard';
import SignUp from './user/layouts/signup/SignUp';
import Profile from './user/layouts/profile/Profile';*/

// Redux Store
import store from './store';


import './index.css';

// Initialize react-router-redux.
//const history = syncHistoryWithStore(browserHistory, store)

// Initialize web3 and set in Redux.
getWeb3.then(results => {
	console.log('Web3 initialized!');
	
	ReactDOM.render(
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>,
		document.getElementById('root')
	);
}).catch(() => {
	console.log('Error in web3 initialization.');
});





/*ReactDOM.render(
	(
		<Provider store={store}>
			<Router history={history}>
				<Route path="/" component={App}>
					<IndexRoute component={Home} />
					<Route path="dashboard" component={Dashboard} />
					<Route path="signup" component={SignUp} />
					<Route path="profile" component={Profile} />
				</Route>
			</Router>
		</Provider>
	),
	document.getElementById('root')
)*/
