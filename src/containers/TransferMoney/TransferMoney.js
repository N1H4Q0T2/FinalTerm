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

class TransferMoneyContainer extends React.Component {
	submitTransfer = () => {
		if(this.props.amount !== 0){
			this.props.submitTransfer(
				this.props.amount,
				this.props.publicKey,
				this.props.privateKey,
				this.props.address
			);
			this.props.history.push({
				pathname: '/dashboard',
			});
		}else{
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
			var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
			const accountTransactions = await axios({
				url,
				method: 'GET',
			});
			if (accountTransactions.status === 200) {
				const allTransaction = accountTransactions.data.result.txs.map(item => {
					const data = Buffer.from(item.tx, 'base64');
					const transaction = v1.decode(data);
					return transaction;
				});
				const accountTrans = allTransaction.filter(item => {
					return item.account === account;
				});
				const sequence = accountTrans.length + 1;
				const tx = {
					version: 1,
					operation: 'payment',
					account: account,
					params: {
						address: address,
						amount: amount,
					},
					sequence: sequence,
					memo: Buffer.alloc(0),
				};
				transaction.sign(tx, privateKey);
				const txEncode = '0x' + transaction.encode(tx).toString('hex');
				url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
				const res = await axios({
					url,
					method: 'POST',
				});
				alert('Transfer money success');
				console.log(res);
			}
			return dispatch(submitTransfer());
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TransferMoneyContainer)
);
