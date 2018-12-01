import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components';

class HeaderContainer extends React.Component {
	render() {
		return <Header/>;
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
)(HeaderContainer);
