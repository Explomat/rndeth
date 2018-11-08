import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { getETHPrice, getContractData, bet } from './PeriodFormActions';
import PeriodForm from './PeriodForm';
import getNetworkType from '../../../utils/getNetworkType';

import './period-form.css';

const getTxUrl = (networkType, tx) => {
	const networkTypes = {
		'mainnet': `https://etherscan.io/tx/${tx}`,
		'ropsten': `https://ropsten.etherscan.io/tx/${tx}`,
		'rinkeby': `https://rinkeby.etherscan.io/tx/${tx}`,
		'kovan': `https://kovan.etherscan.io/tx/${tx}`,
		'unknown': `https://unknown.etherscan.io/tx/${tx}`,
	}
	return networkTypes[networkType];
}

class PreriodFormContainer extends Component {

	componentDidMount(){
		this.props.loadData();
		this.props.getEthereumPrice();
	}

	render(){
		const { lottery, networkId, tx, ethPrice, error } = this.props;

		if (error) return <Redirect to='/error' />

		return (
			<div className='period-form'>
				{lottery &&
					<div className='period-form-descripton'>
						<div className='period-form-item'>
							<div className='period-form-item--description'>Bet</div>
							<div className='period-form-item--value'>{lottery.equalBet} ether {ethPrice && <span className='period-form-item--price'>~ ${ethPrice}</span>}</div>
						</div>
						<div className='period-form-item'>
							<div className='period-form-item--description'>Total balance</div>
							<div className='period-form-item--value'>{lottery.totalBalance} ether</div>
						</div>
						<div className='period-form-item'>
							<div className='period-form-item--description'>Players count</div>
							<div className='period-form-item--value'>{lottery.playersCount}</div>
						</div>
					</div>
				} 
				<PeriodForm onSubmit={this.props.onBet}/>
				{tx && <a href={getTxUrl(getNetworkType(networkId), tx)} target='__blank'>Watch transaction on explorer {tx}</a>}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const period = ownProps.match.params.period;

	const equalBet = state.lottery.domain.equalBet;
	const price = state.lottery.appState.ethPrice;

	const ethPrice = equalBet && price ?
					Math.round((Number(price) * Number(equalBet)) * 10) / 10 : null;

	return {
		lottery: state.lottery.domain,
		networkId: state.web3.web3Instance.version.network,
		tx: state.lottery.appState[period.toLowerCase()].tx,
		ethPrice,
		error: state.lottery.ui.error
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const period = ownProps.match.params.period;
	return {
		loadData: () => {
			dispatch(getContractData(period))
		},

		getEthereumPrice: () => {
			dispatch(getETHPrice());
		},

		onBet: event => {
			event.preventDefault();
			dispatch(bet(period));
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PreriodFormContainer));
