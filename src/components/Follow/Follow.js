import React from 'react';
import './FollowStyle.css';
import defaultAvatar from '../../assets/images/user.png';

const FollowList = ({ username, avatar, address }) => {
	return (
		<div>
			<div className="Follow_FollowList_Container">
				<img className="Follow_FollowList_Image" src={avatar === '--' ? defaultAvatar : `data:image/jpeg;base64,${avatar}`} />
				<div className="Follow_FollowList_div1">
					<span className="Follow_FollowList_Username">{username}</span>
					<span className="Follow_FollowList_SubContent">{address}</span>
				</div>
			</div>
			<div className="Follow_FollowList_div2" />
		</div>
	);
};

const Follower = props => {
	var followData = [];
	for (let i = 0; i < props.data.length; i++) {
		const currentAccount = props.data[i];
		const item = (
			<FollowList
				username={currentAccount.username}
				avatar={currentAccount.avatar}
				address={`${currentAccount.address.slice(0, 15)}...`}
			/>
		);
		followData.push(item);
	}
	return (
		<div className="Follow_Container">
			<div className="Follow_div1">
				<span className="Follow_Title">{props.title}</span>
			</div>
			<div className="Follow_div2">
				<ul className="Follow_List">{followData}</ul>
			</div>
		</div>
	);
};

export default Follower;
