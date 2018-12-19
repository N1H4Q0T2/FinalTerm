import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Post from '../../components/Post/Post';
import { update_Content } from '../../actions/PostReducerActions';

class PostContainer extends React.Component {
	onPost = () => {
		this.props.onPost(this.props.content);
	};

	render() {
		return <Post update_Content={this.props.update_Content} onPost={this.onPost}/>;
	}
}

const mapStateToProps = state => {
	return {
		content: state.PostReducer.content,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		update_Content: data => {
			return dispatch(update_Content(data));
		},
		onPost: data => {
			alert(data);
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(PostContainer)
);
