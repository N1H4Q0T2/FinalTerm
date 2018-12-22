import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Post from '../../components/Post/Post';
import { update_Content } from '../../actions/PostReducerActions';
import { postContent } from '../../lib/function';

class PostContainer extends React.Component {
	onPost = async () => {
		if (this.props.content !== '') {
			const result = await this.props.onPost(
				this.props.data.publicKey,
				this.props.data.privateKey,
				this.props.content,
				this.props.data.bandwidth,
				this.props.data.bandwidthTime,
				this.props.data.bandwidthLimit
			);
			if (result === true) {
				alert('Post successful');
				alert('Transfer successful');
				this.props.history.push({
					pathname: '/dashboard',
				});
			} else {
				alert('Post fail');
			}
		}
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
		data: state.UserProfileReducer,
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
		onPost: async (
			account,
			privateKey,
			data,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			const result = await postContent(
				account,
				privateKey,
				data,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
			if (result === true) {
				dispatch(update_Content(''));
			}
			return result;
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(PostContainer)
);
