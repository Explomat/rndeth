import React from 'react';

let __ErrorBoundary;

if (
	process.env.NODE_ENV === 'development' ||
	process.env.ERROR_ENV === 'development'
) {
	const ErrorBoundary = require('./ErrorBoundary');
	__ErrorBoundary = ErrorBoundary.default;
} else {
	class ErrorBoundary extends React.Component {
		componentDidCatch(error, errorInfo) {
			const { onError, ...props } = this.props;
			if (typeof onError === 'function') {
				try {
					onError.call(this, error, errorInfo, props);
				} catch (e) {}
			}
		}

		render() {
			return this.props.children;
		}
	}
	__ErrorBoundary = ErrorBoundary;
}

export default __ErrorBoundary;