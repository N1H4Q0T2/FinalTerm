import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Dashboard } from '../containers';

export default function getRoutes() {
	return (
		<Router>
			<div>
				<Route path="/" component={Dashboard} />  
			</div>
		</Router>
	);
}
