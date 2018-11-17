import React from 'react';
import { Route, Link } from 'react-router-dom';
import Home from './layouts/home/Home';
import Period from './lottery/layouts/period';
import { AlertWarning } from './lottery/ui/controls/alert';

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './css/grids-responsive-min.css';
import './App.css';

const App = () => (
	<div className='App'>
		<nav className='navbar pure-menu pure-menu-horizontal'>
			<ul className='pure-menu-list navbar-right'>
				<span>
					<li className='pure-menu-item'>
						<a href='https://github.com/explomat/rndeth' target='__blank' className='pure-menu-link'>GitHub</a>
					</li>
				</span>
			</ul>
			<Link to='/' className='pure-menu-heading pure-menu-link'>Random Ethereum</Link>
		</nav>
		<AlertWarning className='warning' isClose={false}>
			In order to be able to use this d-application, you will need to use the MetaMask browser add-on.
			Learn more <a href='https://metamask.io/' target='__blank'>metamask.io</a>
		</AlertWarning>

		<Route exact path='/' component={Home} />
		{/*<Route path='/:period(daily|weekly|monthly)' component={Period} />*/}
		<Route path='/daily' render={() => <Period period='daily'/>} />
		<Route path='/weekly' render={() => <Period period='weekly'/>} />
		<Route path='/monthly' render={() => <Period period='monthly'/>} />
	</div>
);

export default App;
