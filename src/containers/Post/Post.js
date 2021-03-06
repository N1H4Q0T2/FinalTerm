import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Post from '../../components/Post/Post';
import { update_Content } from '../../actions/PostReducerActions';
import { updateIsSubmitting, updatePostAndTransferSuccess } from '../../actions/SubmitReducerActions';
import { update_AccountPosts } from '../../actions/WallReducerActions';
import { postContent } from '../../lib/function';
import * as hashKey from '../../config/hashKey';
import { updateRoute } from '../../actions/RouteReducerActions';

class PostContainer extends React.Component {
	onPost = async () => {
		this.props.history.push({
			pathname: '/dashboard',
		});
		this.props.updateRoute('/dashboard');
		localStorage.setItem('currentRoute', '/dashboard');
		this.props.updateIsSubmitting(true);
		const privateKeyFromStorage = localStorage.getItem(
			this.props.data.publicKey
		);
		const privateKey = hashKey.decode(privateKeyFromStorage);
		if (this.props.content !== '') {
			const result = await this.props.onPost(
				this.props.data.publicKey,
				privateKey,
				this.props.content,
				this.props.data.bandwidth,
				this.props.data.bandwidthTime,
				this.props.data.bandwidthLimit
			);
			if (result === true) {
				this.props.updateIsSubmitting(false);
				this.props.updatePostAndTransferSuccess(true);
				alert('Post successful');
			} else {
				this.props.updateIsSubmitting(false);
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
		updateRoute: input => {
			return dispatch(updateRoute(input));
		},
		updatePostAndTransferSuccess: data => {
			return dispatch(updatePostAndTransferSuccess(data));
		},
		update_AccountPosts: data => {
			return dispatch(update_AccountPosts(data));
		},
		updateIsSubmitting: data => {
			return dispatch(updateIsSubmitting(data));
		},
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
