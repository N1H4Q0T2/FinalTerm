import React from 'react';
import { connect } from 'react-redux';
import { UserInfo } from '../../components';
import {
	isEditing,
	updateAvatar,
	updateUsername,
	update_Balance,
	update_Bandwidth,
} from '../../actions/UserProfileReducer';
import {
	getAccountAvatar,
	getAccountUsername,
	calculateBandwidth,
	updateAccountAvatar,
	updateAccountProfile,
	calculateAccountBalance,
} from '../../lib/function';

class UserInfoContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editUsername: '',
			editAvatar: '',
			avatarBase64: '',
		};
	}

	componentDidMount = async () => {
		this.props.getAccountAvatar(this.props.data.publicKey);
		this.props.getAccountUsername(this.props.data.publicKey);
		this.props.onLoadBalance(this.props.data.publicKey);
		this.props.onLoadBandwidth(this.props.data.publicKey);
	};

	updateEditUsername = data => {
		this.setState({ editUsername: data });
	};

	updateEditAvatar = data => {
		let reader = new FileReader();
		reader.readAsDataURL(data);
		var result;
		reader.onload = e => {
			this.setState({ avatarBase64: e.target.result });
		};
		this.setState({ editAvatar: data });
	};

	saveProfile = async () => {
		var result_username = false,
			result_avatar = false;
		if (this.state.editUsername !== '') {
			result_username = await this.props.updateUsername(
				this.props.data.publicKey,
				this.props.data.privateKey,
				this.state.editUsername,
				this.props.data.bandwidth,
				this.props.data.bandwidthTime,
				this.props.data.bandwidthLimit
			);
		}
		if (this.state.avatarBase64 !== '') {
			result_avatar = await this.props.updateAccountAvatar(
				this.props.data.publicKey,
				this.props.data.privateKey,
				this.state.avatarBase64,
				this.props.data.bandwidth,
				this.props.data.bandwidthTime,
				this.props.data.bandwidthLimit
			);
		}
		if (result_avatar && result_username) {
			alert('Update successful');
		} else if (result_avatar === false || result_username === false) {
			alert('Update fail');
		}
	};

	onEditProfileClick = () => {
		this.setState({ editUsername: '', editAvatar: '' });
		this.props.onEditProfileClick();
	};

	render() {
		return (
			<div>
				<UserInfo
					data={this.props.data}
					follower={this.props.follower}
					following={this.props.following}
					onEditProfileClick={this.onEditProfileClick}
					updateEditUsername={this.updateEditUsername}
					updateEditAvatar={this.updateEditAvatar}
					saveProfile={this.saveProfile}
					editAvatar={this.state.editAvatar}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		data: state.UserProfileReducer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onEditProfileClick: () => {
			dispatch(isEditing());
		},
		updateUsername: async (
			account,
			privateKey,
			data,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			dispatch(isEditing());
			const result = await updateAccountProfile(
				account,
				privateKey,
				data,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
			if (result === true) {
				const username = await getAccountUsername(account);
				dispatch(updateUsername(username));
			}
			return result;
		},
		updateAccountAvatar: async (
			account,
			privateKey,
			data,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			const result = await updateAccountAvatar(
				account,
				privateKey,
				data,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
			console.log(result);
			if (result === true) {
				const avatar = await getAccountAvatar(account);
				dispatch(updateAvatar(avatar));
			}
			return result;
		},
		onLoadBalance: async account => {
			const balance = await calculateAccountBalance(account);
			return dispatch(update_Balance(balance));
		},
		update_Balance: data => {
			dispatch(update_Balance(data));
		},
		onLoadBandwidth: async account => {
			const data = await calculateBandwidth(account);
			dispatch(update_Bandwidth(data));
		},
		getAccountUsername: async account => {
			const username = await getAccountUsername(account);
			dispatch(updateUsername(username));
		},
		getAccountAvatar: async account => {
			var avatar = await getAccountAvatar(account);
			if (avatar === '') avatar = '--';
			dispatch(updateAvatar(avatar));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserInfoContainer);
