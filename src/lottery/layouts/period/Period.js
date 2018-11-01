import React from 'react';
import PeriodFormContainer from '../../ui/periodform/PeriodFormContainer';

const Period = ({ match }) => {
	const { period } = match.params;
	return (
		<main className='container'>
			<div className='pure-g'>
				<div className='pure-u-1-1'>
					<p>{period} period</p>
					<PeriodFormContainer />
				</div>
			</div>
		</main>
	);
}

export default Period;
