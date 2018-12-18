import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Dashboard, Header, TransferMoney } from '../containers';

export default function getRoutes() {
	return (
		<Router>
			<div>
				<Header />
				<Route exact path="/" component={Dashboard} />
				<Route exact path="/transfer" component={TransferMoney} />
			</div>
		</Router>
	);
}
