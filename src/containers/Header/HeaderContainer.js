import React from 'react';
import { connect } from 'react-redux';
import { Header } from '../../components';
import { updateRoute } from '../../actions/RouteReducerActions';
import { reset_Balance } from '../../actions/UserProfileReducer';
import { withRouter } from 'react-router-dom';

class HeaderContainer extends React.Component {
	componentDidMount() {
		var currentRoute = localStorage.getItem('currentRoute');
		if (currentRoute !== null) {
			this.props.updateRoute(currentRoute);
		} 	
	}

	onTransfer = () => {
		this.props.history.push({
			pathname: '/transfer',
		});
		this.props.updateRoute('/transfer');
		localStorage.setItem('currentRoute', '/transfer');
	};

	onPost = () => {
		this.props.history.push({
			pathname: '/post',
		});
		this.props.updateRoute('/post');
		localStorage.setItem('currentRoute', '/post');
	};

	onHome = () => {
		this.props.history.push({
			pathname: '/dashboard',
		});
		this.props.updateRoute('/dashboard');
		localStorage.setItem('currentRoute', '/dashboard');
	};

	onLogOut = () => {
		this.props.reset_Balance();
		this.props.history.push({
			pathname: '/',
		});
		this.props.updateRoute('/');
		localStorage.setItem('currentRoute', '/');
	};

	render() {
		return (
			<Header
				onLogOut={this.onLogOut}
				onTransfer={this.onTransfer}
				onPost={this.onPost}
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
		reset_Balance: () => {
			return dispatch(reset_Balance());
		},
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(HeaderContainer)
);
