import React from 'react';
import { connect } from 'react-redux';
import { Wall } from '../../components';
import {
	update_AccountPosts,
	updateEveryonePosts,
} from '../../actions/WallReducerActions';
import { getAccountPosts } from '../../lib/function';

class WallContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 1,
		};
	}
	componentDidMount() {
		const { publicKey } = this.props.UserProfileReducerData;
		this.props.onLoadAccountPost(publicKey);
	}

	componentWillUpdate() {}

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
		onLoadAccountPost: async account => {
			const result = await getAccountPosts(account);
			dispatch(update_AccountPosts(result));
		},
		onLoadEveryonePost: async addresses => {
			console.log(addresses);
			var data = [];
			for (var i = 0; i < addresses.length; i++) {
				const accountPosts = await getAccountPosts(addresses[i].address);
				const accountData = {
					...addresses[i],
					posts: accountPosts,
				};
				data.push(accountData);
			}
			dispatch(updateEveryonePosts(data));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WallContainer);
