import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getETHPrice, getContractData, bet } from './PeriodFormActions';
import { error } from '../../appActions';
import PeriodForm from './PeriodForm';
import ErrorBoundary from '../controls/error-boundary';
import { AlertInfo } from '../controls/alert';
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

const Period = ({ lottery, networkId, ethPrice, error, info, onBet }) => {
	if (error) throw new Error(error);
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
			{!lottery.isLotteryActive && info && <AlertInfo className='period-form__info' isClose={false}>{info}</AlertInfo>}
			{lottery.isLotteryActive && <PeriodForm onSubmit={onBet} /> }
			{lottery.tx && networkId && <a href={getTxUrl(getNetworkType(networkId), lottery.tx)} target='__blank'>Watch transaction on explorer {lottery.tx}</a>}
		</div>
	);
}

class PeriodFormContainer extends Component {

	componentDidMount(){
		this.props.loadData();
		this.props.getEthereumPrice();
	}

	render(){
		const { onCloseError, ...props } = this.props;
		return (
			<ErrorBoundary onClose={onCloseError}>
				<Period {...props} />
			</ErrorBoundary>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const period = state.lottery[ownProps.period];
	const { appState } = state.lottery;

	const equalBet = period.equalBet;
	const price = appState.ethPrice;

	const ethPrice = equalBet && price ?
					Math.round((price * equalBet) * 10) / 10 : null;
	

	return {
		lottery: period,
		networkId: state.web3.networkId,
		tx: period.tx,
		ethPrice,
		error: appState.error,
		info: appState.info
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const period = ownProps.period;
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
		},

		onCloseError: () => {
			dispatch(error(null));
			ownProps.history.goBack();
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PeriodFormContainer));
