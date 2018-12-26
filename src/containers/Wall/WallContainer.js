import React from 'react';
import { connect } from 'react-redux';
import { Wall } from '../../components';
import {
	update_AccountPosts,
	updateEveryonePosts,
} from '../../actions/WallReducerActions';
import {
	reactOnePost,
	commentOnePost,
	getReactionOfOnePost,
	getAccountPostsInPage,
	getAllCommentOfOnePost,
} from '../../lib/function';
import * as hashKey from '../../config/hashKey';

class WallContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 1,
			hasMore: true,
			openCommentPopup: false,
			onePostData: null,
			commentData: '',
		};
	}
	componentDidMount() {
		const { publicKey } = this.props.UserProfileReducerData;
		this.props.onLoadAccountPost(publicKey, 1, null);
	}

	onLoadMoreData = async () => {
		const { accountPosts, everyonePosts } = this.props.WallReducerData;
		const { publicKey } = this.props.UserProfileReducerData;
		const { following } = this.props.FollowReducerData;
		if (this.state.mode === 1) {
			await this.props.onLoadAccountPost(
				publicKey,
				accountPosts[0].currentPage,
				accountPosts[0].posts
			);
		} else {
			await this.props.onLoadEveryonePost(following, everyonePosts);
		}
	};

	onChangeMode = mode => {
		const { following } = this.props.FollowReducerData;
		const { everyonePosts } = this.props.WallReducerData;
		if (mode === 2) {
			if (following.length === 0) {
				alert('Please wait for following list is loaded.');
			} else {
				if (everyonePosts.length === 0) {
					this.props.onLoadEveryonePost(following, null);
				}
				this.setState({ mode: mode });
			}
		} else {
			this.setState({ mode: mode });
		}
	};

	onUpdateCommentData = data => {
		this.setState({ commentData: data });
	};

	onCommentPopup = async data => {
		const { publicKey } = this.props.UserProfileReducerData;
		if (data !== null && this.state.openCommentPopup === false) {
			const result = await this.props.getAllCommentOfOnePost(
				publicKey,
				data.data.hash
			);
			const newData = {
				...data,
				comments: result,
			};
			this.setState({ onePostData: newData });
		}
		if (data === null) this.setState({ openCommentPopup: false });
		else this.setState({ openCommentPopup: true });
	};

	onCommentOnePost = async () => {
		const {
			publicKey,
			bandwidth,
			bandwidthTime,
			bandwidthLimit,
		} = this.props.UserProfileReducerData;
		const hash = this.state.onePostData.data.hash;
		const privateKeyFromStorage = localStorage.getItem(publicKey);
		const privateKey = hashKey.decode(privateKeyFromStorage);
		const result = await commentOnePost(
			publicKey,
			privateKey,
			this.state.commentData,
			hash,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		);
		if (result === true) {
			const result = await this.props.getAllCommentOfOnePost(
				publicKey,
				this.state.onePostData.data.hash
			);
			const newData = {
				...this.state.onePostData,
				comments: result,
			};
			this.setState({ onePostData: newData });
			alert('Comment successful');
		} else {
			alert('Comment fail');
		}
		this.setState({ commentData: '' });
	};

	onReactOnPost = async (data, typeOfReaction) => {
		const {
			publicKey,
			bandwidth,
			bandwidthTime,
			bandwidthLimit,
		} = this.props.UserProfileReducerData;
		const { accountPosts, everyonePosts } = this.props.WallReducerData;
		const privateKeyFromStorage = localStorage.getItem(publicKey);
		const privateKey = hashKey.decode(privateKeyFromStorage);
		const result = await reactOnePost(
			publicKey,
			privateKey,
			data.hash,
			typeOfReaction,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		);
		if (result === true) {
			const newReaction = await getReactionOfOnePost(data.hash);
			if (this.state.mode === 1) {
				const posts = accountPosts[0].posts;
				console.log(posts);
				const newPosts = posts.map(item => {
					if (item.hash === data.hash) {
						return {
							...item,
							reaction: newReaction,
						};
					} else {
						return item;
					}
				});
				const newData = [
					{
						posts: newPosts,
						currentPage: accountPosts[0].currentPage,
					},
				];
				this.props.updateAccountPosts(newData);
			} else {
				console.log(everyonePosts);
				const newReaction = await getReactionOfOnePost(data.hash);
				const newPosts = everyonePosts.map(user => {
					const posts = user.posts.map(post => {
						if (post.hash === data.hash) {
							return { ...post, reaction: newReaction };
						} else {
							return post;
						}
					});
					return posts;
				});
				var i = -1;
				const newData = everyonePosts.map(item => {
					i++;
					return {
						...item,
						posts: newPosts[i],
					};
				});
				console.log(newData);
				this.props.updateEveryonePosts(newData);
			}
			alert('React successful');
		} else {
			alert('React fail');
		}
	};

	render() {
		const { accountPosts, everyonePosts } = this.props.WallReducerData;
		const { avatar, userName } = this.props.UserProfileReducerData;
		return (
			<Wall
				postData={this.state.mode === 1 ? accountPosts : everyonePosts}
				onChangeMode={this.onChangeMode}
				mode={this.state.mode}
				avatar={this.state.mode === 1 ? avatar : null}
				username={this.state.mode === 1 ? userName : null}
				hasMore={this.state.hasMore}
				onLoadMoreData={this.onLoadMoreData}
				openCommentPopup={this.state.openCommentPopup}
				onCommentPopup={this.onCommentPopup}
				onePostData={this.state.onePostData}
				commentData={this.state.commentData}
				onUpdateCommentData={this.onUpdateCommentData}
				onCommentOnePost={this.onCommentOnePost}
				onReactOnPost={this.onReactOnPost}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		WallReducerData: state.WallReducer,
		UserProfileReducerData: state.UserProfileReducer,
		FollowReducerData: state.FollowReducer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoadAccountPost: async (account, page, oldData) => {
			const result = await getAccountPostsInPage(account, 50, page);
			if (result.newPage !== page) {
				if (oldData === null) {
					const data = [
						{
							posts: result.newPosts,
							currentPage: result.newPage,
						},
					];
					dispatch(update_AccountPosts(data));
				} else {
					var newData = oldData;
					newData = newData.concat(result.newPosts);
					const data = [
						{
							posts: newData,
							currentPage: result.newPage,
						},
					];
					console.log(newData);
					dispatch(update_AccountPosts(data));
				}
			}
		},
		onLoadEveryonePost: async (addresses, oldData) => {
			var data = [];
			for (var i = 0; i < addresses.length; i++) {
				if (oldData === null) {
					const accountPosts = await getAccountPostsInPage(
						addresses[i].address,
						50,
						1
					);
					const accountData = {
						...addresses[i],
						posts: accountPosts.newPosts,
						currentPage: accountPosts.newPage,
					};
					console.log(accountData);
					data.push(accountData);
				} else {
					const accountCurrentPage = oldData[i].currentPage;
					const accountPosts = await getAccountPostsInPage(
						addresses[i].address,
						50,
						accountCurrentPage
					);
					var newData = oldData[i].posts;
					newData = newData.concat(accountPosts.newPosts);
					const accountData = {
						...addresses[i],
						posts: newData,
						currentPage: accountPosts.newPage,
					};
					data.push(accountData);
				}
			}
			dispatch(updateEveryonePosts(data));
		},
		getAllCommentOfOnePost: async (account, hash) => {
			const result = await getAllCommentOfOnePost(account, hash);
			return result;
		},
		commentOnePost: async (
			account,
			privateKey,
			data,
			hashCodeOfPost,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			const result = await commentOnePost(
				account,
				privateKey,
				data,
				hashCodeOfPost,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
			return result;
		},
		reactOnePost: async (
			account,
			privateKey,
			hashCodeOfPost,
			typeOfReaction,
			bandwidth,
			bandwidthTime,
			bandwidthLimit
		) => {
			const result = await reactOnePost(
				account,
				privateKey,
				hashCodeOfPost,
				typeOfReaction,
				bandwidth,
				bandwidthTime,
				bandwidthLimit
			);
			return result;
		},
		getReactionOfOnePost: async hash => {
			const result = await getReactionOfOnePost(hash);
			return result;
		},
		updateAccountPosts: data => {
			dispatch(update_AccountPosts(data));
		},
		updateEveryonePosts: data => {
			dispatch(updateEveryonePosts(data));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WallContainer);
