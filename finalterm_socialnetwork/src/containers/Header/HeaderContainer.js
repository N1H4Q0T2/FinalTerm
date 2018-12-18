import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components';
import { updateRoute } from '../../actions/RouteReducerActions';
import { withRouter } from 'react-router-dom';

class HeaderContainer extends React.Component {
	onTransfer = () => {
		this.props.history.push({
			pathname: '/transfer',
		});
		this.props.updateRoute('/transfer');
	};

	onHome = () => {
		this.props.history.push({
			pathname: '/',
		});
		this.props.updateRoute('/');
	};

	render() {
		return (
			<Header
				onLogOut={this.props.onLogOut}
				onTransfer={this.onTransfer}
				onHome={this.onHome}
				currentRoute={this.props.currentRoute}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentRoute: state.RouteReducer.currentRoute,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLogOut: () => {
			alert('LOGOUT');
		},
		updateRoute: input => {
			return dispatch(updateRoute(input));
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(HeaderContainer)
);
