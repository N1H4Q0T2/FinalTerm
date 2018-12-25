import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Comment from '../../components/Comment/Comment';

class CommentContainer extends React.Component {
	render() {
		return <Comment />;
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(CommentContainer)
);
