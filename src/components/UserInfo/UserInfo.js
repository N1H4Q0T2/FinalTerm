import React from 'react';
import './UserInfoStyle.css';

const UserInfo = props => (
	<div className="UserInfo_Container">
		<img
			alt="UserAvatar"
			className="UserInfo_Image"
			src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.0-9/20116_809409945814637_7236562808378457208_n.jpg?_nc_cat=108&_nc_ht=scontent.fsgn5-5.fna&oh=600b19cb443ce0907e185cd5f248da2b&oe=5C690B13"
		/>
		{props.data.isEditing ? (
			<div className="UserInfo_Div1">
				<input
					className="UserInfo_EditUserName"
					placeholder={props.data.userName}
					onChange={e => props.updateEditUsername(e.target.value)}
				/>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Date of birth: </span>
					<input
						className="UserInfo_EditDateOfBirth"
						placeholder={props.data.dateOfBirth}
						onChange={e => props.updateEditDateOfBirth(e.target.value)}
					/>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Balance: </span>
					<span className="UserInfo_Content UserInfo_FollowerNFollowing">
						{props.data.balance} CEL
					</span>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Follower: </span>
					<span className="UserInfo_Content UserInfo_FollowerNFollowing">
						{props.follower}
					</span>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Following: </span>
					<span className="UserInfo_Content UserInfo_FollowerNFollowing">
						{props.following}
					</span>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Cancel" onClick={props.onEditProfileClick}>
						Cancel
					</span>
					<span
						className="UserInfo_Cancel UserInfo_SaveProfile"
						onClick={props.saveProfile}
					>
						Save profile
					</span>
				</div>
			</div>
		) : (
			<div className="UserInfo_Div1">
				<span className="UserInfo_Name">{props.data.userName}</span>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Date of birth: </span>
					<span className="UserInfo_Content">{props.data.dateOfBirth}</span>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Balance: </span>
					<span className="UserInfo_Content UserInfo_FollowerNFollowing">
						{props.data.balance} CEL
					</span>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Follower: </span>
					<span className="UserInfo_Content UserInfo_FollowerNFollowing">
						{props.follower}
					</span>
				</div>
				<div className="userInfo_Div2">
					<span className="UserInfo_Field">Following: </span>
					<span className="UserInfo_Content UserInfo_FollowerNFollowing">
						{props.following}
					</span>
				</div>
				<div className="userInfo_Div2" onClick={props.onEditProfileClick}>
					<span className="UserInfo_EditProfile">Edit profile</span>
				</div>
			</div>
		)}
	</div>
);

export default UserInfo;
