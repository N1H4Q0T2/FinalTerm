import React from 'react';
import axios from 'axios';
import { Keypair } from 'stellar-base';
import * as hashKey from '../../config/hashKey';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../../components/Login/Login';
import {
	update_PrivateKey,
	update_PublicKey,
	update_isLogin,
	update_Balance,
} from '../../actions/UserProfileReducer';
import { updateRoute } from '../../actions/RouteReducerActions';

class LoginContainer extends React.Component {
	componentDidMount() {
		localStorage.setItem('currentRoute', '/');
	}

	onLogin = () => {
		try {
			const key = Keypair.fromSecret(this.props.privateKey);
			const publicKeyFromSerect = key.publicKey();
			const privateKeyFromStorage = localStorage.getItem(publicKeyFromSerect);
			if (privateKeyFromStorage === null) {
				const hashPrivateKey = hashKey.encode(this.props.privateKey);
				localStorage.setItem(publicKeyFromSerect, hashPrivateKey);
			}
			this.props.update_PublicKey(publicKeyFromSerect);
			this.props.update_PrivateKey('');
			this.props.history.push({
				pathname: '/dashboard',
			});
			this.props.updateRoute('/dashboard');
		} catch (e) {
			alert('Login Failed. Please try again');
		}
	};

	render() {
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
	console.log(state);
	return {
		publicKey: state.UserProfileReducer.publicKey,
		privateKey: state.UserProfileReducer.privateKey,
		balance: state.UserProfileReducer.balance,
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
