import React from 'react';
import './FollowDashboardStyle.css';

const FollowDashboard = props => {
	console.log();
	return (
		<div className="FollowDashboard_container">
			<div className="FollowDashboard_window">
				<p className="FollowDashboard_title">
					ADD NEW USER TO YOUR FOLLOWING LIST
				</p>
				<input
					className="FollowDashboard_input"
					value={props.newFollowingUser}
					onChange={e => props.updateNewFollowingUser(e.target.value)}
				/>
				<div className="FollowDashboard_div1">
					<button
						className="FollowDashboard_button"
						onClick={() => {
							props.checkAddress(props.newFollowingUser);
						}}
					>
						CHECK ACCOUNT
					</button>
					<button
						className="FollowDashboard_button"
						onClick={() => {
							if (!props.available) {
								alert('Account is not available');
							} else {
								props.handleSubmit();
							}
						}}
					>
						SUBMIT
					</button>
				</div>
			</div>
		</div>
	);
};

export default FollowDashboard;
