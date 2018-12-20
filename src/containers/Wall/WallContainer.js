import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Wall } from '../../components';
import * as v1 from '../../lib/tx/v1';
import * as api from '../../config/api';
import {update_AccountPosts} from '../../actions/WallReducerActions';

class WallContainer extends React.Component {
	componentDidMount(){
		this.props.onLoadAccountPost(this.props.publicKey);
	}

	render() {
		return <Wall accountPosts={this.props.accountPosts}/>;
	}
}

const mapStateToProps = state => {
	return {
		accountPosts: state.WallReducer.accountPosts,
		publicKey: state.UserProfileReducer.publicKey,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoadAccountPost: async account => {
			var result = [];
			var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
			const accountTransactions = await axios({
				url,
				method: 'GET',
			});
			if (accountTransactions.status === 200) {
				const total_count = accountTransactions.data.result.total_count;
				if (total_count !== '0') {
					accountTransactions.data.result.txs.map(item => {
						const data = Buffer.from(item.tx, 'base64');
						const transaction = v1.decode(data);
						if (transaction.operation === 'post') {
							try {
								const content_base64 = Buffer.from(transaction.params.content, 'base64');
								const real_data = v1.PlainTextContent.decode(content_base64);
								result.push(real_data);
							} catch (e) {
								console.log();
							}
						}
					});
				} else {
					console.log('Accout doesn\'t exist');
				}
			}
			dispatch(update_AccountPosts(result));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WallContainer);
