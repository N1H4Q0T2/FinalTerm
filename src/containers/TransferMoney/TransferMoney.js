import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TransferMoney from '../../components/TransferMoney/TransferMoney';
import {
	updateAddress,
	updateAmount,
	submitTransfer,
	updateSubmitSuccess,
} from '../../actions/TransferReducerActions';
import * as v1 from '../../lib/tx/v1';
import * as transaction from '../../lib/tx';
import * as api from '../../config/api';
import { test } from '../../lib/test';
import { transferMoney } from '../../lib/function';

class TransferMoneyContainer extends React.Component {
	submitTransfer = async () => {
		if (this.props.amount !== 0) {
			const result = await this.props.submitTransfer(
				this.props.amount,
				this.props.publicKey,
				this.props.privateKey,
				this.props.address
			);
			if (result === true) {
				alert('Transfer successful');
				this.props.history.push({
					pathname: '/dashboard',
				});
			} else {
				alert('Transfer fail');
			}
		} else {
			alert('Amount could not be 0');
		}
	};

	render() {
		return (
			<TransferMoney
				address={this.props.address}
				updateAddress={this.props.updateAddress}
				updateAmount={this.props.updateAmount}
				submitTransfer={this.submitTransfer}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		amount: state.TransferReducer.amount,
		address: state.TransferReducer.address,
		publicKey: state.UserProfileReducer.publicKey,
		privateKey: state.UserProfileReducer.privateKey,
		submitSuccess: state.TransferReducer.submitSuccess,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateAmount: input => {
			const data = parseInt(input);
			return dispatch(updateAmount(data));
		},
		updateAddress: input => {
			return dispatch(updateAddress(input.toUpperCase()));
		},
		updateSubmitSuccess: input => {
			return dispatch(updateSubmitSuccess(input));
		},
		submitTransfer: async (amount, account, privateKey, address) => {
			const result = await transferMoney(account, privateKey, address, amount);
			if (result === true) {
				dispatch(submitTransfer());
			}
			return result;
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TransferMoneyContainer)
);
