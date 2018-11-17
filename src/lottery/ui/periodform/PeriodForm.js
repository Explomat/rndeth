import React from 'react';
import { ButtonPrimary } from '../controls/button';

const PeriodForm = ({ onSubmit }) => {
	return (
		<form className='pure-form pure-form-stacked' onSubmit={onSubmit}>
			<fieldset>
				<ButtonPrimary type='submit'>PLACE A BET</ButtonPrimary>
			</fieldset>
		</form>
	);
}

export default PeriodForm;
