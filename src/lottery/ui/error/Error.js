import React from 'react';
import { AlertDanger } from '../controls/alert';

const Error = ({ error, onClose }) => (
	<AlertDanger onClose={onClose}>{error}</AlertDanger>
);

export default Error;
