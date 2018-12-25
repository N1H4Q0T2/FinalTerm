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
		const { accountPosts } = this.props.WallReducerData;
		const { publicKey } = this.props.UserProfileReducerData;
		const result = await this.props.onLoadAccountPost(
			publicKey,
			accountPosts[0].currentPage,
			accountPosts[0].posts
		);
		// console.log(result);
	};

	onChangeMode = mode => {
		const { following } = this.props.FollowReducerData;
		const { everyonePosts } = this.props.WallReducerData;
		if (mode === 2) {
			if (following.length === 0) {
				alert('Please wait for following list is loaded.');
			} else {
				if (everyonePosts.length === 0) {
					this.props.onLoadEveryonePost(following);
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
		onLoadEveryonePost: async addresses => {
			var data = [];
			for (var i = 0; i < addresses.length; i++) {
				const accountPosts = await getAccountPosts(addresses[i].address);
				const accountData = {
					...addresses[i],
					posts: accountPosts,
					currentPage: 1,
				};
				data.push(accountData);
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
