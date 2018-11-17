import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '../portal';
import { AlertDanger } from '../alert';

import './error-boundary.css';

class ErrorBoundary extends Component {

	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}
	
	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});

		const { onError, ...props } = this.props;
		if (typeof onError === 'function') {
			try {
				onError.call(this, error, errorInfo, props);
			} catch (e) {}
		}
	}
	
	render() {
		if (this.state.error) {
			return (
				<Portal>
					<div className='overlay'>
						<div className='overlay-alert'>
							<AlertDanger className='error-boundary' onClose={this.props.onClose}>
								<label>Something went wrong.</label>
								<details className='error-boundary__details'>
									{this.state.error && this.state.error.toString()}
									{/*<br />
									{this.state.errorInfo.componentStack}*/}
								</details>
							</AlertDanger>
						</div>
					</div>
				</Portal>
			);
		}
		return this.props.children;
	}  
}

ErrorBoundary.propTypes = {
	onClose: PropTypes.func,
	onError: PropTypes.func
};

export default ErrorBoundary;