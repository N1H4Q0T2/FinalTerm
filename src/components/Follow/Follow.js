import React from 'react';
import './FollowStyle.css';

const FollowList = ({ data, subContent }) => {
	return (
		<div>
			<div className="Follow_FollowList_Container">
				<img
					className="Follow_FollowList_Image"
					src="https://i.pinimg.com/originals/c4/0c/a8/c40ca880de32fb08c1e2cdc025c23480.jpg"
				/>
				<div className="Follow_FollowList_div1">
					<span className="Follow_FollowList_Username">{data}</span>
					<span className="Follow_FollowList_SubContent">{subContent}</span>
				</div>
			</div>
			<div className="Follow_FollowList_div2"/>
		</div>
	);
};

const Follower = props => {
	let followList = [];
	for (let i = 0; i < props.data; i++) {
		const item = <FollowList data="Username" subContent="@email" />;
		followList.push(item);
	}
	return (
		<div className="Follow_Container">
			<div className="Follow_div1">
				<span className="Follow_Title">{props.title}</span>
			</div>
			<div className="Follow_div2">
				<ul className="Follow_List">{followList}</ul>
			</div>
		</div>
	);
};

export default Follower;
