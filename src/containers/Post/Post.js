import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Post from '../../components/Post/Post';
import { update_Content } from '../../actions/PostReducerActions';
import * as v1 from '../../lib/tx/v1';
import * as api from '../../config/api';
import * as transaction from '../../lib/tx';

class PostContainer extends React.Component {
	onPost = () => {
		this.props.onPost(this.props.content, this.props.publicKey, this.props.privateKey);
	};

	render() {
		return (
			<Post
				update_Content={this.props.update_Content}
				onPost={this.onPost}
				content={this.props.content}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		publicKey: state.UserProfileReducer.publicKey,
		privateKey: state.UserProfileReducer.privateKey,
		content: state.PostReducer.content,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		update_Content: data => {
			return dispatch(update_Content(data));
		},
		onPost: async (data, account, privateKey) => {
			var url = api.API_GET_ACCOUNT_TRANSACTIONS + account + '%27%22';
			const accountTransactions = await axios({
				url,
				method: 'GET',
			});
			if (accountTransactions.status === 200) {
				const allTransaction = accountTransactions.data.result.txs.map(item => {
					const data = Buffer.from(item.tx, 'base64');
					const transaction = v1.decode(data);
					return transaction;
				});
				const accountTrans = allTransaction.filter(item => {
					return item.account === account;
				});
				const sequence = accountTrans.length + 1;
				const content = 'Nguyen Ho Quoc Thinh vừa post bài';
				let post_content = v1.PlainTextContent.encode({
					type: 1,
					text: content,
				});
				const tx = {
					version: 1,
					operation: 'post',
					account: account,
					params: {
						content: post_content,
						keys: [],
					},
					sequence: sequence,
					memo: Buffer.alloc(0),
				};
				transaction.sign(tx, privateKey);
				const txEncode = '0x' + transaction.encode(tx).toString('hex');
				url = `${api.API_COMMIT_TRANSACTION}${txEncode}`;
				const res = await axios({
					url,
					method: 'POST',
				});
			}
			dispatch(update_Content(''));
			alert('Post success');
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(PostContainer)
);
