import React from 'react';
import { connect } from 'react-redux';
import { UserInfo } from '../../components';
import {
	isEditing,
	updateUsername,
	update_Balance,
	update_Bandwidth,
} from '../../actions/UserProfileReducer';
import {
	calculateBandwidth,
	calculateAccountBalance,
	getAccountUsername,
	updateAccountProfile,
} from '../../lib/function';

class UserInfoContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editUsername: '',
		};
	}

	componentDidMount = async () => {
		this.props.onGetAccountUsername(this.props.data.publicKey);
		this.props.onLoadBalance(this.props.data.publicKey);
		this.props.onLoadBandwidth(this.props.data.publicKey);
	};

	updateEditUsername = data => {
		this.setState({ editUsername: data });
	};

	saveProfile = async () => {
		if (this.state.editUsername !== '') {
			const result = await this.props.updateUsername(
				this.props.data.publicKey,
				this.props.data.privateKey,
				this.state.editUsername
			);
			if(result === true){
				alert('Update profile successful');
			}else{
				alert('Update profile fail');
			}
		}
	};

	render() {
		return (
			<div>
				<UserInfo
					data={this.props.data}
					follower={this.props.follower}
					following={this.props.following}
					onEditProfileClick={this.props.onEditProfileClick}
					updateEditUsername={this.updateEditUsername}
					saveProfile={this.saveProfile}
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
		updateUsername: async (account, privateKey, data) => {
			dispatch(isEditing());
			const result = await updateAccountProfile(account, privateKey, data);
			if (result === true) {
				const username = await getAccountUsername(account);
				dispatch(updateUsername(username));
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
			const bandwidth = await calculateBandwidth(account);
			dispatch(update_Bandwidth(bandwidth));
		},
		onGetAccountUsername: async account => {
			const username = await getAccountUsername(account);
			dispatch(updateUsername(username));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserInfoContainer);
