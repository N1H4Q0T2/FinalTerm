import React from 'react';
import './UserInfoStyle.css';
import defaultAvatar from '../../assets/images/user.png';
const UserInfo = props => {
	const avatar =
		props.data.avatar === '--'
			? defaultAvatar
			: `data:image/jpeg;base64,${props.data.avatar}`;

	return (
		<div className="UserInfo_Container">
			<img
				alt="UserAvatar"
				className="UserInfo_Image"
				src={
					props.editAvatar === ''
						? avatar
						: URL.createObjectURL(props.editAvatar)
				}
			/>
			{props.data.isEditing && (
				<input
					type="file"
					id="uploadImage"
					style={{ marginTop: 10 }}
					onChange={e => {
						props.updateEditAvatar(e.target.files[0]);
					}}
				/>
			)}
			{props.data.isEditing ? (
				<div className="UserInfo_Div1">
					<input
						className="UserInfo_EditUserName"
						placeholder={props.data.userName}
						onChange={e => props.updateEditUsername(e.target.value)}
					/>
					<div className="userInfo_Div2">
						<span className="UserInfo_Field">Balance: </span>
						<span className="UserInfo_Content UserInfo_FollowerNFollowing">
							{props.data.balance} CEL
						</span>
					</div>
					<div className="userInfo_Div2">
						<span className="UserInfo_Field">OXYGEN: </span>
						<span className="UserInfo_Content UserInfo_FollowerNFollowing">
							{props.data.bandwidth}
						</span>
					</div>
					<div className="userInfo_Div2">
						<span
							className="UserInfo_Cancel"
							onClick={props.onEditProfileClick}
						>
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
						<span className="UserInfo_Field">Balance: </span>
						<span className="UserInfo_Content UserInfo_FollowerNFollowing">
							{props.data.balance === 0 ? 'CALCULATING ...' : `${props.data.balance} CEL`}
						</span>
					</div>
					<div className="userInfo_Div2">
						<span className="UserInfo_Field">OXYGEN: </span>
						<span className="UserInfo_Content UserInfo_FollowerNFollowing">
							{props.data.bandwidth === 0
								? 'CALCULATING ... '
								: props.data.bandwidth}
						</span>
					</div>
					<div className="userInfo_Div2" onClick={props.onEditProfileClick}>
						<span className="UserInfo_EditProfile">Edit profile</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserInfo;
