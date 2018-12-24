import React from 'react';
import { connect } from 'react-redux';
import { Follow } from '../../components';
import { withRouter } from 'react-router-dom';
import {
	getFollowing,
	getAccountUsername,
	getAccountAvatar,
} from '../../lib/function';
import { updateRoute } from '../../actions/RouteReducerActions';
import { updateFollowing } from '../../actions/FollowReducerActions';
import { updateAddress } from '../../actions/TransferReducerActions';

class FollowerContainer extends React.Component {
	componentDidMount() {
		const account = this.props.accountProfile.publicKey;
		if (this.props.title === 'Following') {
			this.props.getFollowing(account);
		}
	}

	onTransferMoney = data => {
		this.props.history.push({
			pathname: '/transfer',
		});
		this.props.updateRoute('/transfer');
		this.props.updateAddress(data);
		localStorage.setItem('currentRoute', '/transfer');

	};

	render() {
		return (
			<Follow
				title={this.props.title}
				data={
					this.props.title === 'Following'
						? this.props.followData.following
						: this.props.followData.follower
				}
				onTransferMoney={this.onTransferMoney}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		accountProfile: state.UserProfileReducer,
		followData: state.FollowReducer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateRoute: input => {
			return dispatch(updateRoute(input));
		},
		updateAddress: input => {
			return dispatch(updateAddress(input));
		},
		getFollowing: async account => {
			const followingList = await getFollowing(account);
			var result = [];
			for (var i = 0; i < followingList.length; i++) {
				var currentAccount = followingList[i];
				var username = await getAccountUsername(currentAccount);
				var avatar = await getAccountAvatar(currentAccount);
				var data = {
					username: username === '' ? '--' : username,
					address: currentAccount,
					avatar: avatar === '' ? '--' : avatar,
				};
				result.push(data);
			}
			return dispatch(updateFollowing(result));
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FollowerContainer)
);
