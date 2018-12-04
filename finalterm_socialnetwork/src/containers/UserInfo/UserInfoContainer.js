import React from 'react';
import { connect } from 'react-redux';
import { UserInfo } from '../../components';
import { isEditing, updateProfile } from '../../actions/UserProfileReducer';

class UserInfoContainer extends React.Component {
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
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserInfoContainer);
