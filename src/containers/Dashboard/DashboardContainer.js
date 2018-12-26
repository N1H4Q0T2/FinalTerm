import React from 'react';
import { connect } from 'react-redux';
import { Dashboard } from '../../components';
import { test } from '../../lib/test';

class DashboardContainer extends React.Component {
	componentDidMount() {
		this.props.testing();
	}

	render() {
		return (
			<div>
				<Dashboard
					data={this.props.data}
					isSubmitting={this.props.SubmitReducerData.isSubmitting}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		SubmitReducerData: state.SubmitReducer,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		testing: () => {
			test();
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DashboardContainer);
