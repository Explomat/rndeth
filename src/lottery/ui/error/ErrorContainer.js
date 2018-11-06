import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { error } from '../../appActions';
import Error from './Error';

import './error.css';

const ErrorContainer = props => {
	const { error } = props;

	if (!error) return <Redirect to='/' />;
	return (
		<div className='overlay'>
			<div className='overlay-alert'>
				<Error {...props} />
			</div>
		</div>
	);
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { history } = ownProps;
	return {
		onClose: () => {
			dispatch(error(null));
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
