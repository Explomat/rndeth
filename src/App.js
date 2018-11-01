import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Home from './layouts/home/Home';
import Period from './lottery/layouts/period';
import ErrorContainer from './lottery/ui/error/ErrorContainer';
import { AlertWarning } from './lottery/ui/controls/alert';
//import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
//import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
//import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './css/grids-responsive-min.css';
import './App.css';

class App extends Component {
	render() {
		return (
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
				<Route path='/:period(Daily|Weekly|Monthly)' component={Period} />
				<Route path='/error' component={ErrorContainer} />
			</div>
		);
	}
}

export default App;
