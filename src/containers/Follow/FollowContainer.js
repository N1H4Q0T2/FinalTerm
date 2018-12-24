import React from 'react';
import { connect } from 'react-redux';
import { Follow } from '../../components';
import { getFollowing, getAccountUsername, getAccountAvatar } from '../../lib/function';
import { updateFollowing } from '../../actions/FollowReducerActions';

class FollowerContainer extends React.Component {
	componentDidMount() {
		if (this.props.title === 'Following') {
			this.props.getFollowing(this.props.accountProfile.publicKey);
		}
		else{
			this.props.getFollowing(this.props.accountProfile.publicKey);
		}
	}

	render() {
		return (
			<Follow
				title={this.props.title}
				data={
					this.props.title === 'Following'
						? this.props.followData.following
						: this.props.followData.follower
				}
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FollowerContainer);
