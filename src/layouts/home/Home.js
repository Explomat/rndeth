import React from 'react';
import { Link } from 'react-router-dom';
import { AlertInfo } from '../../lottery/ui/controls/alert';

import './home.css';

const Home = () => (
	<div className='container'>
		<AlertInfo isClose={false}>
			<p>
				This is a random Ethereum lottery. With a little luck you might already to win some money.
				The lottery numbers are generated with <a href='https://random.org/' target='__blank'>random.org</a>
				, you can see this on smart contracts <a href='https://github.com/explomat/rndeth' target='__blank'>code</a>.
			</p>
		</AlertInfo>
		<div className='pure-g'>
			<div className='pure-u-1 pure-u-md-1-2'>
				<Link to='/daily' className='period-item period-item--daily'>
					<h1 className='period-item__title'>Daily Lottery</h1>
				</Link>
			</div>
			<div className='pure-u-1 pure-u-md-1-2'>
				<Link to='/weekly' className='period-item period-item--weekly'>
					<h1 className='period-item__title'>Weekly Lottery</h1>
				</Link>
			</div>
		</div>
		<div className='pure-g'>
			<div className='pure-u-1'>
				<Link to='/monthly' className='period-item period-item--monthly'>
					<h1 className='period-item__title'>Monthly Lottery</h1>
				</Link>
			</div>
		</div>
	</div>
);


export default Home;
