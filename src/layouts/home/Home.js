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
				<div className='period-item period-item--daily'>
					<Link to='/Daily'>Daily</Link>
				</div>
			</div>
			<div className='pure-u-1 pure-u-md-1-2'>
				<div className='period-item period-item--weekly'>
					<Link to='/Weekly'>Weekly</Link>
				</div>
			</div>
		</div>
		<div className='pure-g'>
			<div className='pure-u-1'>
				<div className='period-item period-item--monthly'>
					<Link to='/Monthly'>Monthly</Link>
				</div>
			</div>
		</div>
	</div>
);


export default Home;
