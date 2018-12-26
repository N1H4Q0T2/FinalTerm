import React from 'react';
import { connect } from 'react-redux';
import  Submit  from '../../components/Submit/Submit';

class SubmitContainer extends React.Component {
	render() {
		return (
			<div>
				<Submit data={this.props.data} />
			</div>
		);
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
)(SubmitContainer);
