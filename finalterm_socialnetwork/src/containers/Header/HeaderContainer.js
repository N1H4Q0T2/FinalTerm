import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components';

class HeaderContainer extends React.Component {
	render() {
		return <Header onLogOut={this.props.onLogOut}/>;
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		onLogOut: () => {
			alert('LOGOUT');
		},
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderContainer);
