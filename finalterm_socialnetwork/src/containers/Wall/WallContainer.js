import React from 'react';
import { connect } from 'react-redux';
import { Wall } from '../../components';

class WallContainer extends React.Component {
	render() {
		return <Wall />;
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
)(WallContainer);
