import React, { Component } from 'react';
import { ButtonPrimary } from '../controls/button';

class PeriodForm extends Component {

	render() {
		return(
			<form className='pure-form pure-form-stacked' onSubmit={this.props.onSubmit}>
				<fieldset>
					{/*<label htmlFor="name">Name</label>
					<span className="pure-form-message">This is a required field.</span>

					<br />

					<button type="submit" className="pure-button pure-button-primary">Update</button>*/}
					<ButtonPrimary type='submit'>Bet</ButtonPrimary>
				</fieldset>
			</form>
		)
	}
}

export default PeriodForm;
