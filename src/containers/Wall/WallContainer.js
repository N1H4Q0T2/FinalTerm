import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Wall } from '../../components';
import * as v1 from '../../lib/tx/v1';
import * as api from '../../config/api';
import { update_AccountPosts } from '../../actions/WallReducerActions';
import { getAccountPosts } from '../../lib/function';

class WallContainer extends React.Component {
	componentDidMount() {
		this.props.onLoadAccountPost(this.props.publicKey);
	}

	render() {
		return <Wall accountPosts={this.props.accountPosts} />;
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
			const result = await getAccountPosts(account);
			dispatch(update_AccountPosts(result));
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WallContainer);
