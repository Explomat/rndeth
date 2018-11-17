import React, { Component } from 'react';
import { connect } from 'react-redux';
import { error } from '../../appActions';
import Error from './Error';

import './error.css';

class ErrorContainer extends Component {
	render(){
		return (
			<div className='overlay'>
				<div className='overlay-alert'>
					<Error {...this.props} />
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClose: () => {
			dispatch(error(null));
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		error: state.lottery.ui.error
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorContainer);
