import React from 'react';
import { connect } from 'react-redux';
import { Wall } from '../../components';
import {
	update_AccountPosts,
	updateEveryonePosts,
} from '../../actions/WallReducerActions';
import { getAccountPosts, getAccountPostsInPage } from '../../lib/function';

class WallContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 1,
			hasMore: true,
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
						20,
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
						20,
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
		onTest: async account => {
			const result = await getAccountPostsInPage(account, 50, 1);
			console.log(result);
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WallContainer);
