import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../../components/Login/Login';
import {
	update_PrivateKey,
	update_PublicKey,
	update_isLogin,
} from '../../actions/UserProfileReducer';
import { updateRoute } from '../../actions/RouteReducerActions';
import * as api from '../../config/api';

class LoginContainer extends React.Component {
	onLogin = () => {
		this.props.onLogin(this.props.publicKey);
		this.props.history.push({
			pathname: '/dashboard',
		});
		this.props.updateRoute('/dashboard');
	};

	render() {
		console.log('fdjkdls');
		return (
			<Login
				publicKey={this.props.publicKey}
				privateKey={this.props.privateKey}
				update_PrivateKey={this.props.update_PrivateKey}
				update_PublicKey={this.props.update_PublicKey}
				onLogin={this.onLogin}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		publicKey: state.UserProfileReducer.publicKey,
		privateKey: state.UserProfileReducer.privateKey,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		update_PublicKey: data => {
			return dispatch(update_PublicKey(data));
		},
		update_PrivateKey: data => {
			return dispatch(update_PrivateKey(data));
		},
		onLogin: async publicKey => {
			const url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${publicKey}%27%22`;
			const response = await axios({
				url,
				method: 'GET',
			});
			if (response.status == 200) {
				if (response.data.result.total_count !== 0) dispatch(update_isLogin());
			}
		},
		updateRoute: data => {
			return dispatch(updateRoute(data));
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(LoginContainer)
);
