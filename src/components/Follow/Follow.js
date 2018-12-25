import React from 'react';
import './FollowStyle.css';
import defaultAvatar from '../../assets/images/user.png';

const FollowList = ({
	username,
	avatar,
	address,
	addressForShow,
	onTransferMoney,
}) => {
	return (
		<div>
			<div
				className="Follow_FollowList_Container"
				onClick={() => {
					onTransferMoney(address);
				}}
			>
				<img
					className="Follow_FollowList_Image"
					src={
						avatar === '--' ? defaultAvatar : `data:image/jpeg;base64,${avatar}`
					}
				/>
				<div className="Follow_FollowList_div1">
					<span className="Follow_FollowList_Username">{username}</span>
					<span className="Follow_FollowList_SubContent">{addressForShow}</span>
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
				address={currentAccount.address}
				addressForShow={`${currentAccount.address.slice(0, 15)}...`}
				onTransferMoney={props.onTransferMoney}
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
				{props.data.length === 0 ? (
					<p className="Follow_Loading">LOADING! PLEASE WAIT</p>
				) : (
					<ul className="Follow_List">{followData}</ul>
				)}
			</div>
		</div>
	);
};

export default Follower;
