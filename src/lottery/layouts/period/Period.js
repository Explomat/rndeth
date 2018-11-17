import React from 'react';
import PeriodFormContainer from '../../ui/periodform/PeriodFormContainer';

import './period.css';

const Period = ({ period }) => {
	return (
		<main className='period'>
			<div className='pure-g'>
				<div className='pure-u-1-1'>
					<h4>{period} period</h4>
					<PeriodFormContainer period={period}/>
				</div>
			</div>
		</main>
	);
}

export default Period;
