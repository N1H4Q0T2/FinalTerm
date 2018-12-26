import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FollowDashboard from '../../components/FollowDashboard/FollowDashboard';
import {
	updateNewFollowingUser,
	addNewFollowingUserIntoFollowingList,
} from '../../actions/FollowReducerActions';
import {
	checkIfAccountIsExits,
	followAnotherAccount,
} from '../../lib/function';
import { updateRoute } from '../../actions/RouteReducerActions';
import { updateIsSubmitting, updateFollowSuccess } from '../../actions/SubmitReducerActions';
import * as hashKey from '../../config/hashKey';

class FollowDashboardContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			available: false,
		};
	}

	checkAddress = async address => {
		const result = await this.props.checkAddress(address);
		if (result === true) {
			alert('Account is available');
			this.setState({ available: true });
		} else {
			this.setState({ available: false });
			alert('Account is not available. Please try again');
		}
	};
	handleSubmit = async () => {
		this.props.history.push({
			pathname: '/dashboard',
		});
		const { following, newFollowingUser } = this.props.FollowReducerData;
		const {
			publicKey,
			bandwidth,
			bandwidthTime,
			bandwidthLimit,
		} = this.props.accountReducerData;
		this.props.updateIsSubmitting(true);
		const privateKeyFromStorage = localStorage.getItem(publicKey);
		const privateKey = hashKey.decode(privateKeyFromStorage);
		const result = await this.props.followAnotherAccount(
			newFollowingUser,
			following,
			publicKey,
			privateKey,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		);
		if (result === true) {
			this.props.updateIsSubmitting(false);
			this.props.updateFollowSuccess(true);
			alert('Following new user successful');
		} else {
			this.props.updateIsSubmitting(false);
			alert('Following new user fail');
		}

		this.props.updateRoute('/dashboard');
		localStorage.setItem('currentRoute', '/dashboard');
	};

	render() {
		return (
			<FollowDashboard
				updateNewFollowingUser={this.props.updateNewFollowingUser}
				newFollowingUser={this.props.FollowReducerData.newFollowingUser}
				available={this.state.available}
				checkAddress={this.checkAddress}
				handleSubmit={this.handleSubmit}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		FollowReducerData: state.FollowReducer,
		accountReducerData: state.UserProfileReducer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateFollowSuccess: data => {
			return dispatch(updateFollowSuccess(data));
		},
		updateIsSubmitting: data => {
			return dispatch(updateIsSubmitting(data));
		},
		updateNewFollowingUser: data => {
			return dispatch(updateNewFollowingUser(data));
		},
		checkAddress: async address => {
			const result = await checkIfAccountIsExits(address);
			return result;
		},
		updateRoute: input => {
			return dispatch(updateRoute(input));
		},
		followAnotherAccount: async (
			newUser,
			followingList,
			account,
			privateKey,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			var data = [];
			data.push(newUser);
			console.log('Begin');
			const result = await followAnotherAccount(
				account,
				privateKey,
				data,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
			return result;
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FollowDashboardContainer)
);
