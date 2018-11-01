import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { getContractData, bet } from './PeriodFormActions';
import PeriodForm from './PeriodForm';
import getNetworkType from '../../../utils/getNetworkType';

const getTxUrl = (networkType, tx) => {
	const networkTypes = {
		'mainnet': `https://etherscan.io/tx/${tx}`,
		'ropsten': `https://ropsten.etherscan.io/tx/${tx}`,
		'rinkeby': `https://rinkeby.etherscan.io/tx/${tx}`,
		'unknown': `https://unknown.etherscan.io/tx/${tx}`,
	}
	return networkTypes[networkType];
}

class PreriodFormContainer extends Component {

	componentDidMount(){
		this.props.loadData();
	}

	render(){
		const { lottery, networkId, tx, error } = this.props;

		if (error) return <Redirect to='/error' />

		return (
			<div>
				{lottery &&
					<div>
						{lottery.equalBet}<br />
						{lottery.totalBalance}<br />
						{lottery.playersCount}<br />
					</div>
				} 
				<PeriodForm onSubmit={this.props.onBet}/>
				{tx && getTxUrl(getNetworkType(networkId), tx)}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const period = ownProps.match.params.period;
	return {
		lottery: state.lottery.domain,
		networkId: state.web3.networkId,
		tx: state.lottery.appState[period.toLowerCase()].tx,
		error: state.lottery.ui.error
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const period = ownProps.match.params.period;
	return {
		loadData: () => {
			dispatch(getContractData(period))
		},

		onBet: event => {
			event.preventDefault();
			dispatch(bet(period));
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreriodFormContainer));
