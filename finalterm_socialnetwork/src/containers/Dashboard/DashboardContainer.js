import React from 'react';
import { connect } from 'react-redux';
import { Dashboard } from '../../components';
import { testing } from '../../actions/TestAction';

class DashboardContainer extends React.Component {
	componentDidMount() {
		this.props.testing();
	}

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
		testing: () => dispatch(testing('dsds')),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DashboardContainer);
