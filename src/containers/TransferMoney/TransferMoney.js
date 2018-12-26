import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TransferMoney from '../../components/TransferMoney/TransferMoney';
import {
	updateAmount,
	updateAddress,
	submitTransfer,
	updateSubmitSuccess,
} from '../../actions/TransferReducerActions';
import { updateIsSubmitting, updatePostAndTransferSuccess } from '../../actions/SubmitReducerActions';
import { update_AccountPosts } from '../../actions/WallReducerActions';
import { transferMoney } from '../../lib/function';
import * as hashKey from '../../config/hashKey';
import { updateRoute } from '../../actions/RouteReducerActions';

class TransferMoneyContainer extends React.Component {
	submitTransfer = async () => {
		this.props.history.push({
			pathname: '/dashboard',
		});
		this.props.updateRoute('/dashboard');
		this.props.updateIsSubmitting(true);
		const privateKeyFromStorage = localStorage.getItem(this.props.publicKey);
		const privateKey = hashKey.decode(privateKeyFromStorage);
		if (this.props.amount !== 0 && this.props.bandwidth !== 0) {
			const result = await this.props.submitTransfer(
				this.props.amount,
				this.props.publicKey,
				privateKey,
				this.props.address,
				this.props.bandwidth,
				this.props.bandwidthTime,
				this.props.bandwidthLimit
			);
			if (result === true) {
				this.props.updateIsSubmitting(false);
				this.props.updatePostAndTransferSuccess(true);
				alert('Transfer successful');
			} else {
				this.props.updateIsSubmitting(false);
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
		bandwidth: state.UserProfileReducer.bandwidth,
		bandwidthLimit: state.UserProfileReducer.bandwidthLimit,
		bandwidthTime: state.UserProfileReducer.bandwidthTime,
		submitSuccess: state.TransferReducer.submitSuccess,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateRoute: input => {
			return dispatch(updateRoute(input));
		},
		updatePostAndTransferSuccess: data => {
			return dispatch(updatePostAndTransferSuccess(data));
		},
		update_AccountPosts: data => {
			return dispatch(update_AccountPosts(data));
		},
		updateIsSubmitting: data => {
			return dispatch(updateIsSubmitting(data));
		},
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
		submitTransfer: async (
			amount,
			account,
			privateKey,
			address,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			const result = await transferMoney(
				account,
				privateKey,
				address,
				amount,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
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
