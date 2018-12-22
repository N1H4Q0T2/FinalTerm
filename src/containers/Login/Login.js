import React from 'react';
import axios from 'axios';
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
	componentDidMount(){
		localStorage.setItem('currentRoute', '/');
	}

	onLogin = () => {
		this.props.history.push({
			pathname: '/dashboard',
		});
		this.props.updateRoute('/dashboard');
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
