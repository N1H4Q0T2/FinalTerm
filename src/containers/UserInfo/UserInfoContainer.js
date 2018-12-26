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
	updateIsSubmitting,
	updateChangeProfileSuccess,
	updateCommentAndReacSuccess
} from '../../actions/SubmitReducerActions';
import {
	getAccountAvatar,
	getAccountUsername,
	calculateBandwidth,
	updateAccountAvatar,
	updateAccountProfile,
	calculateAccountBalance,
} from '../../lib/function';
import * as hashKey from '../../config/hashKey';

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

	componentDidUpdate() {
		if (
			this.props.SubmitReducerData.postAndTransferSuccess === true ||
			this.props.SubmitReducerData.followSuccess === true ||
			this.props.SubmitReducerData.changeProfileSuccess === true ||
			this.props.SubmitReducerData.commentAndReacSuccess === true
		) {
			this.props.update_Balance(0);
			this.props.onLoadBalance(this.props.data.publicKey);
			this.props.onLoadBandwidth(this.props.data.publicKey);
			if(this.props.SubmitReducerData.changeProfileSuccess === true){
				this.props.updateChangeProfileSuccess(false);
			}
			if(this.props.SubmitReducerData.commentAndReacSuccess === true){
				this.props.updateCommentAndReacSuccess(false);
			}
		}
	}

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
		const privateKeyFromStorage = localStorage.getItem(
			this.props.data.publicKey
		);
		this.props.updateIsSubmitting(true);
		this.props.updateChangeProfileSuccess(true);
		const privateKey = hashKey.decode(privateKeyFromStorage);
		if (this.state.editUsername !== '') {
			result_username = await this.props.updateUsername(
				this.props.data.publicKey,
				privateKey,
				this.state.editUsername,
				this.props.data.bandwidth,
				this.props.data.bandwidthTime,
				this.props.data.bandwidthLimit
			);
			if (result_username === true) alert('Update username successful');
			else alert('Update username fail');
		}
		if (this.state.avatarBase64 !== '') {
			result_avatar = await this.props.updateAccountAvatar(
				this.props.data.publicKey,
				privateKey,
				this.state.avatarBase64,
				this.props.data.bandwidth,
				this.props.data.bandwidthTime,
				this.props.data.bandwidthLimit
			);
			if (result_avatar === true) alert('Update avatar successful');
			else alert('Update avatar fail');
		}
		this.props.updateIsSubmitting(false);
	};

	onEditProfileClick = () => {
		this.setState({ editUsername: '', editAvatar: '', avatarBase64: '' });
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
		SubmitReducerData: state.SubmitReducer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateCommentAndReacSuccess: data => {
			return dispatch(updateCommentAndReacSuccess(data));
		},
		updateChangeProfileSuccess: data => {
			return dispatch(updateChangeProfileSuccess(data));
		},
		updateIsSubmitting: data => {
			return dispatch(updateIsSubmitting(data));
		},
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
		update_Bandwidth: data => {
			dispatch(update_Bandwidth(data));
		},
		onLoadBandwidth: async account => {
			const data = await calculateBandwidth(account);
			console.log(data);
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
