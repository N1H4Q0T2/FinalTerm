import React from 'react';
import { connect } from 'react-redux';
import { Dashboard } from '../../components';
import { test } from '../../lib/test';

class DashboardContainer extends React.Component {
	render() {
		return (
			<div>
				<Dashboard data={this.props.data} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	console.log(state);
	return {
		data: state.TestReducer.data,
	};
};

const mapDispatchToProps = dispatch => {
	return {
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DashboardContainer);
