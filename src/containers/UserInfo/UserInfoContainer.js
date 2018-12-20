import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as v1 from '../../lib/tx/v1';
import * as api from '../../config/api';
import { UserInfo } from '../../components';
import {
	isEditing,
	updateProfile,
	update_Balance,
} from '../../actions/UserProfileReducer';

class UserInfoContainer extends React.Component {
	componentDidMount() {
		this.props.onLoadBalance(this.props.data.publicKey);
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
		onLoadBalance: publicKey => {
			var url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${publicKey}%27%22`;
			const per_page = 50;
			axios.get(url).then(res => {
				const total_count = res.data.result.total_count;
				const total_page = Math.floor(total_count / per_page) + 1;
				for (var i = 0; i < total_page; i++) {
					var url2 = `${
						api.API_GET_ACCOUNT_TRANSACTIONS
					}${publicKey}%27%22&page=${i + 1}&per_page=${per_page}`;
					axios.get(url2).then(response => {
						const transactions = response.data.result.txs.map(item => {
							const data = Buffer.from(item.tx, 'base64');
							const transaction = v1.decode(data);
							return transaction;
						});
						const result = transactions.filter(item => {
							return item.operation === 'payment';
						});
						var balance = 0;
						for (var k = 0; k < result.length; k++) {
							if (result[k].account != publicKey) {
								balance = balance + result[k].params.amount;
							} else {
								balance = balance - result[k].params.amount;
							}
						}
						dispatch(update_Balance(balance));
					});
				}
			});
		},
		update_Balance: data => {
			dispatch(update_Balance(data));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserInfoContainer);
