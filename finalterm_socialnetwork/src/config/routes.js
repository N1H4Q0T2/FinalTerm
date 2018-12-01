import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Dashboard, Header } from '../containers';

export default function getRoutes() {
	return (
		<Router>
			<div>
				<Header />
				<Route path="/" component={Dashboard} />
			</div>
		</Router>
	);
}
