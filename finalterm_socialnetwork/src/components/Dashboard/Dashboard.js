import React from 'react';
import { UserInfo, Wall, Follow } from '../../containers';
import './DashboardStyle.css';

const Dashboard = props => (
	<div className="Dashboard_Container">
		<UserInfo />
		<Wall />
		<div>
			{/*FOLLOWER*/}
			<Follow />
			{/*FOLLOWING*/}
			<Follow />
		</div>
	</div>
);

export default Dashboard;
