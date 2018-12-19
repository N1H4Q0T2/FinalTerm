import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Dashboard, Header, TransferMoney, Login, Post } from '../containers';

export default function getRoutes() {
	return (
		<Router>
			<div>
				<Header />
				<Route exact path="/" component={Login} />
				<Route exact path="/dashboard" component={Dashboard} />
				<Route exact path="/transfer" component={TransferMoney} />
				<Route exact path="/post" component={Post} />
			</div>
		</Router>
	);
}
