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
import * as api from '../../config/api';
import * as v1 from '../../lib/tx/v1';

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
		onLogin: async (publicKey) => {
			var url = `${api.API_GET_ACCOUNT_TRANSACTIONS}${publicKey}%27%22`;
			const per_page = 50;
			axios.get(url).then(res => {
				const total_count = res.data.result.total_count;
				const total_page = Math.floor(total_count / per_page) + 1;
				for (var i = 0; i < total_page; i++) {
					var url2 = `${
						api.API_GET_ACCOUNT_TRANSACTIONS
					}${publicKey}%27%22&page=${i+1}&per_page=${per_page}`;
					axios.get(url2).then(response => {
						const transactions = response.data.result.txs.map(item => {
							const data = Buffer.from(item.tx, 'base64');
							const transaction = v1.decode(data);
							return transaction;
						});
						console.log(transactions);
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
