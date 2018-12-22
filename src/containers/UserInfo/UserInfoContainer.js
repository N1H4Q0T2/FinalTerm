import React from 'react';
import { connect } from 'react-redux';
import { UserInfo } from '../../components';
import {
	isEditing,
	updateProfile,
	update_Balance,
	update_Bandwidth,
} from '../../actions/UserProfileReducer';
import {
	calculateBandwidth,
	calculateAccountBalance,
} from '../../lib/function';

class UserInfoContainer extends React.Component {
	componentDidMount() {
		this.props.onLoadBalance(this.props.data.publicKey);
		this.props.onLoadBandwidth(this.props.data.publicKey);
	}

	constructor(props) {
		super(props);
		this.state = {
			editUsername: '',
			editDateOfBirth: '',
		};
	}

	updateEditUsername = data => {
		this.setState({ editUsername: data });
	};

	updateEditDateOfBirth = data => {
		this.setState({ editDateOfBirth: data });
	};

	saveProfile = () => {
		const userName =
			this.state.editUsername === ''
				? this.props.data.userName
				: this.state.editUsername;
		const dateOfBirth =
			this.state.editDateOfBirth === ''
				? this.props.data.dateOfBirth
				: this.state.editDateOfBirth;
		const data = {
			userName: userName,
			dateOfBirth: dateOfBirth,
		};
		this.props.updateProfile(data);
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
					updateEditDateOfBirth={this.updateEditDateOfBirth}
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
		updateProfile: data => {
			dispatch(isEditing());
			dispatch(updateProfile(data));
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
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserInfoContainer);
