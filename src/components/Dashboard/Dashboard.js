import React from 'react';
import { UserInfo, Wall, Follow, Submit } from '../../containers';
import './DashboardStyle.css';

const Dashboard = props => {
	const follower = 2;
	const following = 10;
	return (
		<div className="Dashboard_Container">
			<UserInfo follower={follower} following={following} />
			<Wall />
			<div>
				{/*FOLLOWING*/}
				<Follow title={'Following'} tmp={following} />
			</div>
			{props.isSubmitting && <Submit />}
		</div>
	);
};

export default Dashboard;
