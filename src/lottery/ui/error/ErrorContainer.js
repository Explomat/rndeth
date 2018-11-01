import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Error from './Error';

import './error.css';

const ErrorContainer = props => {
	return (
		<div className='overlay'>
			<div className='overlay-alert'>
				<Error {...props} />
			</div>
		</div>
	);
}

const mapDispatchToProps = (state, ownProps) => {
	const { history } = ownProps;
	return {
		onClose: () => {
			history.goBack();
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		error: state.lottery.ui.error
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ErrorContainer));
