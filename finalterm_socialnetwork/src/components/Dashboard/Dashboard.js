import React from 'react';
import { UserInfo, Wall, Follow } from '../../containers';
import './DashboardStyle.css';

const Dashboard = props => {
	const follower = 2;
	const following = 10;
	return (
		<div className="Dashboard_Container">
			<UserInfo follower={follower} following={following} />
			<Wall />
			<div>
				{/*FOLLOWER*/}
				<Follow title={'Follower'} tmp={follower} />
				{/*FOLLOWING*/}
				<Follow title={'Following'} tmp={following} />
			</div>
		</div>
	);
};

export default Dashboard;
