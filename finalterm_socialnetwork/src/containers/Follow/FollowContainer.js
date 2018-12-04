import React from 'react';
import { connect } from 'react-redux';
import { Follow } from '../../components';

class FollowerContainer extends React.Component {
	render() {
		return <Follow data={this.props.tmp} title={this.props.title}/>;
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FollowerContainer);
